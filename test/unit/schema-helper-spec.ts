import { expect, use as _useWithChai } from 'chai';
import _sinonChai from 'sinon-chai';
import _chaiAsPromised from 'chai-as-promised';
import 'mocha';

_useWithChai(_sinonChai);
_useWithChai(_chaiAsPromised);

import { SinonStub, stub } from 'sinon';
import _esmock from 'esmock';
import Ajv, { JSONSchemaType } from 'ajv';
import {
    testValues as _testValues,
    MockImportHelper,
    ObjectMock,
} from '@vamship/test-utils';
import { ArgError, SchemaError } from '@vamship/error-types';

describe('schemaHelper', function () {
    type SchemaError = {
        instancePath?: string;
        message: string;
    };

    type AjvResult = {
        isValid: boolean;
        errors: Array<SchemaError> | undefined;
    };

    type SchemaChecker = (
        /* eslint-disable-next-line tsel/no-explicit-any */
        input: any,
        throwError?: boolean,
    ) => boolean & { errors?: SchemaError[] };

    /* eslint-disable-next-line tsel/no-explicit-any */
    type MockSchemaChecker = SinonStub<any[], boolean> & {
        errors?: SchemaError[];
    };

    type TargetModule = {
        /* eslint-disable-next-line tsel/no-explicit-any */
        createSchemaChecker: (schema: any, message?: string) => SchemaChecker;
    };

    type ImportResult = {
        testTarget: TargetModule;
        ajvMock: ObjectMock<Ajv>;
        ajvResult: AjvResult;
        validatorMock: MockSchemaChecker;
    };

    async function _import(): Promise<ImportResult> {
        const ajvResult: AjvResult = { isValid: true, errors: undefined };
        const validatorMock: MockSchemaChecker = stub().callsFake(() => {
            if (ajvResult.isValid) {
                return true;
            } else {
                validatorMock.errors = ajvResult.errors;
                return false;
            }
        });
        const ajvMock = new ObjectMock<Ajv>({} as Ajv).addMock(
            'compile',
            () => validatorMock,
        );

        const importHelper = new MockImportHelper<TargetModule>(
            'project://src/schema-helper.js',
            {
                ajv: 'ajv',
            },
            import.meta.resolve('../../../working'),
        ).setMock('ajv', { default: ajvMock.ctor });

        const testTarget = await _esmock(
            importHelper.importPath,
            importHelper.getLibs(),
            importHelper.getGlobals(),
        );

        return { testTarget, ajvMock, ajvResult, validatorMock };
    }

    type DummyData = {
        foo: string;
        bar: number;
    };

    function _getSchema(): JSONSchemaType<DummyData> {
        return {
            type: 'object',
            properties: {
                foo: {
                    type: 'string',
                },
                bar: {
                    type: 'number',
                },
            },
            required: ['foo', 'bar'],
        };
    }

    it('should implement methods required by the interface', async function () {
        const {
            testTarget: { createSchemaChecker },
        } = await _import();
        expect(createSchemaChecker).to.be.a('function');
    });

    describe('createSchemaChecker()', function () {
        _testValues.allButObject().forEach((schema, index) => {
            it(`should throw an error if invoked without a valid schema object (value=${schema})`, async function () {
                const {
                    testTarget: { createSchemaChecker },
                } = await _import();

                const error = 'Invalid schema specified (arg #1)';
                /* eslint-disable-next-line tsel/no-explicit-any */
                const wrapper = () => createSchemaChecker(schema as any);
                expect(wrapper).to.throw(ArgError, error);
            });
        });

        it('should return a function when invoked with a valid schema object', async function () {
            const {
                testTarget: { createSchemaChecker },
            } = await _import();

            const validator = createSchemaChecker(_getSchema());
            expect(validator).to.be.a('function');
        });

        it('should compile the specified schema object to create a schema validator', async function () {
            const {
                testTarget: { createSchemaChecker },
                ajvMock,
            } = await _import();

            const schema = _getSchema();

            const compileMethod = ajvMock.mocks.compile;

            expect(ajvMock.ctor).to.not.have.been.called;
            expect(compileMethod.stub).to.not.have.been.called;

            createSchemaChecker(schema);

            expect(ajvMock.ctor).to.have.been.calledOnceWithExactly();
            expect(ajvMock.ctor).to.have.been.calledWithNew;
            expect(compileMethod.stub).to.have.been.calledOnceWithExactly(
                schema,
            );
        });

        describe('[schema validator behavior]', async function () {
            type ValidatorResult = {
                validator: SchemaChecker;
                ajvResult: AjvResult;
                validatorMock: MockSchemaChecker;
            };

            async function _createValidator(
                message?: string,
            ): Promise<ValidatorResult> {
                const schema = _getSchema();
                const {
                    testTarget: { createSchemaChecker },
                    ajvResult,
                    validatorMock,
                } = await _import();

                return {
                    validator: createSchemaChecker(schema, message),
                    ajvResult,
                    validatorMock,
                };
            }

            it('should validate the input object against the previously compiled schema', async function () {
                const { validator, validatorMock } = await _createValidator();

                const target = {};

                expect(validatorMock).to.not.have.been.called;

                validator(target);

                expect(validatorMock).to.have.been.calledOnceWithExactly(
                    target,
                );
            });

            it('should return true if schema validation is successful', async function () {
                const { validator, ajvResult } = await _createValidator();
                ajvResult.isValid = true;

                const ret = validator({});
                expect(ret).to.be.true;
            });

            it('should return false if schema validation fails', async function () {
                const { validator, ajvResult } = await _createValidator();
                ajvResult.isValid = false;

                const ret = validator({});
                expect(ret).to.be.false;
            });

            it('should throw an error if validation fails, and throwError=true', async function () {
                const { validator, ajvResult } = await _createValidator();
                const schemaErr = {
                    instancePath: 'foo',
                    message: 'bar',
                };
                ajvResult.isValid = false;
                ajvResult.errors = [schemaErr];

                const message = `[SchemaError] Schema validation failed. Details: [${schemaErr.instancePath}: ${schemaErr.message}]`;

                const wrapper = () => validator({}, true);

                expect(wrapper).to.throw(SchemaError, message);
            });

            it('should return true if schema validation is successful and throwError=true', async function () {
                const { validator, ajvResult } = await _createValidator();
                ajvResult.isValid = true;
                const ret = validator({}, true);
                expect(ret).to.be.true;
            });

            it('should default the schema error instancePath to "root" if one was not returned', async function () {
                const { validator, ajvResult } = await _createValidator();
                const schemaErr = {
                    message: 'bar',
                };
                ajvResult.isValid = false;
                ajvResult.errors = [schemaErr];

                const errMessage = `[SchemaError] Schema validation failed. Details: [<root>: ${schemaErr.message}]`;
                const wrapper = () => validator({}, true);

                expect(wrapper).to.throw(SchemaError, errMessage);
            });

            it('should replace "/" with "." in the instancePath', async function () {
                const { validator, ajvResult } = await _createValidator();
                const schemaErr = {
                    instancePath: 'foo/bar/baz',
                    message: 'bar',
                };
                ajvResult.isValid = false;
                ajvResult.errors = [schemaErr];

                const errMessage = `[SchemaError] Schema validation failed. Details: [foo.bar.baz: ${schemaErr.message}]`;
                const wrapper = () => validator({}, true);

                expect(wrapper).to.throw(SchemaError, errMessage);
            });

            it('should use the custom error message if one was specified during compilation', async function () {
                const customMessage = 'Something went wrong';
                const { validator, ajvResult } = await _createValidator(
                    customMessage,
                );
                const schemaErr = {
                    instancePath: 'foo',
                    message: 'bar',
                };
                const errMessage = `[SchemaError] ${customMessage}. Details: [${schemaErr.instancePath}: ${schemaErr.message}]`;

                ajvResult.isValid = false;
                ajvResult.errors = [schemaErr];

                const wrapper = () => validator({}, true);
                expect(wrapper).to.throw(SchemaError, errMessage);
            });

            it('should throw a schema error with just the error message if the validation fails but does not return any errors', async function () {
                const customMessage = 'Something went wrong';
                const { validator, ajvResult } = await _createValidator(
                    customMessage,
                );
                const errMessage = `[SchemaError] ${customMessage}`;

                ajvResult.isValid = false;

                const wrapper = () => validator({}, true);
                expect(wrapper).to.throw(SchemaError, errMessage);
            });
        });
    });
});
