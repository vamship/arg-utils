import { expect, use as _useWithChai } from 'chai';
import _sinonChai from 'sinon-chai';
import _chaiAsPromised from 'chai-as-promised';
import 'mocha';

_useWithChai(_sinonChai);
_useWithChai(_chaiAsPromised);

import { SinonStub, stub } from 'sinon';
import Ajv from 'ajv';
import {
    testValues as _testValues,
    MockImporter,
    ObjectMock,
} from '@vamship/test-utils';
import { ArgError, SchemaError } from '@vamship/error-types';

type AnyInput = _testValues.AnyInput;

// import * as _schemaHelper from '../../src/schema-helper.js';

describe.only('schemaHelper', function () {
    type SchemaChecker = (input: any, throwError?: boolean) => boolean;
    type TargetModule = {
        createSchemaChecker: (schema: any, message?: string) => SchemaChecker;
    };
    type ImportResult = {
        testTarget: TargetModule;
        ajvInstance: { isValid: boolean };
        schemaValidator: SinonStub<any[], boolean>;
    };

    const importer = new MockImporter<TargetModule>(
        'project://src/schema-helper.ts',
        {
            ajv: 'ajv',
        },
    );

    async function _import(): Promise<ImportResult> {
        const ajvInstance = {
            isValid: false,
        };

        const ajvMock = new ObjectMock<Ajv>({} as Ajv).addMock(
            'compile',
            () => schemaValidator,
        );
        const schemaValidator = stub().callsFake(() => ajvInstance.isValid);

        const testTarget = await importer.import({
            ajv: ajvMock.ctor,
        });

        return { testTarget, ajvInstance, schemaValidator };
    }

    it('should implement methods required by the interface', async function () {
        const { testTarget: { createSchemaChecker } } = await _import();
        expect(createSchemaChecker).to.be.a('function');
    });

    // describe('createSchemaChecker()', () => {
    //     it('should throw an error if invoked without a valid schema object', () => {
    //         const inputs = _testValues.allButObject();
    //         const error = 'Invalid schema specified (arg #1)';
    //         inputs.forEach((schema, index) => {
    //             const wrapper = () => {
    //                 _schemaHelper.createSchemaChecker(schema);
    //             };
    //             expect(wrapper).to.throw(ArgError, error);
    //         });
    //     });
    //     it('should return a function when invoked with a valid schema object', () => {
    //         const schema = _getSchema();
    //         const validator = _schemaHelper.createSchemaChecker(schema);
    //         expect(validator).to.be.a('function');
    //     });
    //     it('should compile the specified schema object to create a schema validator', () => {
    //         const schema = _getSchema();
    //         const compileMethod = _ajvMock.mocks.compile;
    //         expect(_ajvMock.ctor).to.not.have.been.called;
    //         expect(compileMethod.stub).to.not.have.been.called;
    //         _schemaHelper.createSchemaChecker(schema);
    //         expect(_ajvMock.ctor).to.have.been.calledOnce;
    //         expect(_ajvMock.ctor).to.have.been.calledWithNew;
    //         expect(compileMethod.stub).to.have.been.calledOnce;
    //         expect(compileMethod.stub).to.have.been.calledWith(schema);
    //     });
    //     describe('[schema validator behavior]', () => {
    //         function _createValidator(message) {
    //             const schema = _getSchema();
    //             return _schemaHelper.createSchemaChecker(schema, message);
    //         }
    //         it('should validate the input object against the previously compiled schema', () => {
    //             const validator = _createValidator();
    //             const target = {};
    //             expect(_ajvMock._validator).to.not.have.been.called;
    //             validator(target);
    //             expect(_ajvMock._validator).to.have.been.calledOnce;
    //             expect(_ajvMock._validator).to.have.been.calledWith(target);
    //         });
    //         it('should return true if schema validation is successful', () => {
    //             const validator = _createValidator();
    //             _ajvMock._isValid = true;
    //             const ret = validator({});
    //             expect(ret).to.be.true;
    //         });
    //         it('should return false if schema validation fails', () => {
    //             const validator = _createValidator();
    //             const schemaErr = {
    //                 instancePath: 'foo',
    //                 message: 'bar',
    //             };
    //             _ajvMock._isValid = false;
    //             _ajvMock._validator.errors = [schemaErr];
    //             const ret = validator({});
    //             expect(ret).to.be.false;
    //         });
    //         it('should throw an error if validation fails, and throwError=true', () => {
    //             const validator = _createValidator();
    //             const schemaErr = {
    //                 instancePath: 'foo',
    //                 message: 'bar',
    //             };
    //             const message = `[SchemaError] Schema validation failed. Details: [${schemaErr.instancePath}: ${schemaErr.message}]`;
    //             const wrapper = () => {
    //                 _ajvMock._isValid = false;
    //                 _ajvMock._validator.errors = [schemaErr];
    //                 return validator({}, true);
    //             };
    //             expect(wrapper).to.throw(SchemaError, message);
    //         });
    //         it('should return true if schema validation is successful and throwError=true', () => {
    //             const validator = _createValidator();
    //             _ajvMock._isValid = true;
    //             const ret = validator({}, true);
    //             expect(ret).to.be.true;
    //         });
    //         it('should default the schema error instancePath to "root" if one was not returned', () => {
    //             const schemaErr = {
    //                 message: 'bar',
    //             };
    //             const errMessage = `[SchemaError] Schema validation failed. Details: [<root>: ${schemaErr.message}]`;
    //             const wrapper = () => {
    //                 const validator = _createValidator();
    //                 _ajvMock._isValid = false;
    //                 _ajvMock._validator.errors = [schemaErr];
    //                 validator({}, true);
    //             };
    //             expect(wrapper).to.throw(SchemaError, errMessage);
    //         });
    //         it('should replace "/" with "." in the instancePath', () => {
    //             const schemaErr = {
    //                 instancePath: 'foo/bar/baz',
    //                 message: 'bar',
    //             };
    //             const errMessage = `[SchemaError] Schema validation failed. Details: [foo.bar.baz: ${schemaErr.message}]`;
    //             const wrapper = () => {
    //                 const validator = _createValidator();
    //                 _ajvMock._isValid = false;
    //                 _ajvMock._validator.errors = [schemaErr];
    //                 validator({}, true);
    //             };
    //             expect(wrapper).to.throw(SchemaError, errMessage);
    //         });
    //         it('should use the custom error message if one was specified during compilation', () => {
    //             const customMessage = 'Something went wrong';
    //             const schemaErr = {
    //                 instancePath: 'foo',
    //                 message: 'bar',
    //             };
    //             const errMessage = `[SchemaError] ${customMessage}. Details: [${schemaErr.instancePath}: ${schemaErr.message}]`;
    //             const wrapper = () => {
    //                 const validator = _createValidator(customMessage);
    //                 _ajvMock._isValid = false;
    //                 _ajvMock._validator.errors = [schemaErr];
    //                 validator({}, true);
    //             };
    //             expect(wrapper).to.throw(SchemaError, errMessage);
    //         });
    //     });
    // });
});
