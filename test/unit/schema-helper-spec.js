'use strict';

const _sinon = require('sinon');
const _chai = require('chai');
_chai.use(require('sinon-chai'));
_chai.use(require('chai-as-promised'));
const expect = _chai.expect;

const _rewire = require('rewire');
const _testUtils = require('@vamship/test-utils');
const _testValues = _testUtils.testValues;
const ObjectMock = _testUtils.ObjectMock;

const { ArgError, SchemaError } = require('@vamship/error-types').args;

let _schemaHelper = null;

describe('schemaHelper', function () {
    let _ajvMock = null;

    function _getSchema() {
        return {};
    }

    beforeEach(() => {
        const schemaValidator = _sinon.stub().callsFake(() => {
            return _ajvMock._isValid;
        });
        _ajvMock = new ObjectMock().addMock('compile', () => schemaValidator);
        _ajvMock._validator = schemaValidator;
        _ajvMock._isValid = true;

        _schemaHelper = _rewire('../../src/schema-helper');
        _schemaHelper.__set__('_ajv', _ajvMock.ctor);
    });

    it('should implement methods required by the interface', function () {
        expect(_schemaHelper.createSchemaChecker).to.be.a('function');
    });

    describe('createSchemaChecker()', () => {
        it('should throw an error if invoked without a valid schema object', () => {
            const inputs = _testValues.allButObject();
            const error = 'Invalid schema specified (arg #1)';

            inputs.forEach((schema, index) => {
                const wrapper = () => {
                    _schemaHelper.createSchemaChecker(schema);
                };

                expect(wrapper).to.throw(ArgError, error);
            });
        });

        it('should return a function when invoked with a valid schema object', () => {
            const schema = _getSchema();
            const validator = _schemaHelper.createSchemaChecker(schema);

            expect(validator).to.be.a('function');
        });

        it('should compile the specified schema object to create a schema validator', () => {
            const schema = _getSchema();
            const compileMethod = _ajvMock.mocks.compile;

            expect(_ajvMock.ctor).to.not.have.been.called;
            expect(compileMethod.stub).to.not.have.been.called;

            _schemaHelper.createSchemaChecker(schema);

            expect(_ajvMock.ctor).to.have.been.calledOnce;
            expect(compileMethod.stub).to.have.been.calledOnce;
            expect(compileMethod.stub).to.have.been.calledWith(schema);
        });

        describe('[schema validator behavior]', () => {
            function _createValidator(message) {
                const schema = _getSchema();
                return _schemaHelper.createSchemaChecker(schema, message);
            }

            it('should validate the input object against the previously compiled schema', () => {
                const validator = _createValidator();
                const target = {};

                expect(_ajvMock._validator).to.not.have.been.called;
                validator(target);
                expect(_ajvMock._validator).to.have.been.calledOnce;
                expect(_ajvMock._validator).to.have.been.calledWith(target);
            });

            it('should return true if schema validation is successful', () => {
                const validator = _createValidator();

                _ajvMock._isValid = true;
                const ret = validator({});
                expect(ret).to.be.true;
            });

            it('should return false if schema validation fails', () => {
                const validator = _createValidator();
                const schemaErr = {
                    dataPath: 'foo',
                    message: 'bar',
                };

                _ajvMock._isValid = false;
                _ajvMock._validator.errors = [schemaErr];
                const ret = validator({});
                expect(ret).to.be.false;
            });

            it('should throw an error if validation fails, and throwError=true', () => {
                const validator = _createValidator();
                const schemaErr = {
                    dataPath: 'foo',
                    message: 'bar',
                };
                const message = `[SchemaError] Schema validation failed. Details: [${schemaErr.dataPath}: ${schemaErr.message}]`;

                const wrapper = () => {
                    _ajvMock._isValid = false;
                    _ajvMock._validator.errors = [schemaErr];
                    return validator({}, true);
                };
                expect(wrapper).to.throw(SchemaError, message);
            });

            it('should return true if schema validation is successful and throwError=true', () => {
                const validator = _createValidator();

                _ajvMock._isValid = true;
                const ret = validator({}, true);
                expect(ret).to.be.true;
            });

            it('should default the schema error dataPath to "root" if one was not returned', () => {
                const schemaErr = {
                    message: 'bar',
                };
                const errMessage = `[SchemaError] Schema validation failed. Details: [<root>: ${schemaErr.message}]`;

                const wrapper = () => {
                    const validator = _createValidator();
                    _ajvMock._isValid = false;
                    _ajvMock._validator.errors = [schemaErr];
                    validator({}, true);
                };
                expect(wrapper).to.throw(SchemaError, errMessage);
            });

            it('should use the custom error message if one was specified during compilation', () => {
                const customMessage = 'Something went wrong';
                const schemaErr = {
                    dataPath: 'foo',
                    message: 'bar',
                };
                const errMessage = `[SchemaError] ${customMessage}. Details: [${schemaErr.dataPath}: ${schemaErr.message}]`;

                const wrapper = () => {
                    const validator = _createValidator(customMessage);
                    _ajvMock._isValid = false;
                    _ajvMock._validator.errors = [schemaErr];
                    validator({}, true);
                };

                expect(wrapper).to.throw(SchemaError, errMessage);
            });
        });
    });
});
