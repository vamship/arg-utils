import { expect, use as _useWithChai } from 'chai';
import _sinonChai from 'sinon-chai';
import _chaiAsPromised from 'chai-as-promised';
import 'mocha';

_useWithChai(_sinonChai);
_useWithChai(_chaiAsPromised);

import { testValues as _testValues } from '@vamship/test-utils';
import { ArgError } from '@vamship/error-types';

type AnyInput = _testValues.AnyInput;

import * as _argValidator from '../../src/arg-validator.js';

describe('argValidator', function () {
    it('should expose the expected methods and properties', async function () {
        expect(_argValidator.checkString).to.be.a('function');
        expect(_argValidator.checkEnum).to.be.a('function');
        expect(_argValidator.checkNumber).to.be.a('function');
        expect(_argValidator.checkObject).to.be.a('function');
        expect(_argValidator.checkArray).to.be.a('function');
        expect(_argValidator.checkBoolean).to.be.a('function');
        expect(_argValidator.checkFunction).to.be.a('function');
        expect(_argValidator.checkInstance).to.be.a('function');
    });

    interface ITesterInput {
        arg: AnyInput;
        error: string | Error | undefined;
    }

    class Tester<T extends ITesterInput> {
        private _runTest: (input: T) => boolean;

        constructor(runTest: (input: T) => boolean) {
            this._runTest = runTest;
        }

        testFalseResponse(inputs: T[]): void {
            inputs.forEach((input: T) => {
                const { arg } = input;
                const runTest = this._runTest;
                it(`should return false if the input is not valid (value=${arg})`, async function () {
                    //eslint-disable-next-line tsel/no-unused-expressions
                    expect(runTest(input)).to.be.false;
                });
            });
        }

        testError(inputs: T[], errorType: unknown, message: string): void {
            inputs.forEach((input: T) => {
                const { arg } = input;
                const runTest = this._runTest;
                it(`should return false if the input is not valid (value=${arg})`, async function () {
                    const wrapper = () => runTest(input);
                    expect(wrapper).to.throw(errorType as Error, message);
                });
            });
        }

        testTrueResponse(inputs: T[]): void {
            inputs.forEach((input: T) => {
                const { arg } = input;
                const runTest = this._runTest;
                it(`should return true if the input is valid (value=${arg})`, async function () {
                    //eslint-disable-next-line tsel/no-unused-expressions
                    expect(runTest(input)).to.be.true;
                });
            });
        }
    }

    class CustomError extends Error {
        constructor(message: string) {
            super(message);
        }
    }

    describe('checkString()', function () {
        interface IStringCheckInput extends ITesterInput {
            minLength: number | undefined;
        }

        function _getErrorInputs(
            error: string | Error | undefined = undefined,
        ): IStringCheckInput[] {
            return _testValues
                .allButString('')
                .map(
                    (arg: AnyInput): IStringCheckInput => ({
                        arg,
                        error,
                        minLength: 1,
                    }),
                )
                .concat([
                    { arg: 'foo', error, minLength: 4 },
                    { arg: 'abcdef', error, minLength: 8 },
                ]);
        }

        function _getOmittedLenErrorInputs(
            error: string | Error | undefined = undefined,
        ): IStringCheckInput[] {
            return [
                { arg: '', minLength: undefined, error },
                { arg: '', minLength: -1, error },
            ];
        }

        function _getValidInputs(
            count = 1,
            error: string | Error | undefined = undefined,
        ): IStringCheckInput[] {
            return new Array(count)
                .fill(0)
                .map((item: number, index: number) =>
                    _testValues.getString(`value_${index}`),
                )
                .concat(['', ' '])
                .map((arg: string) => ({ arg, minLength: arg.length, error }));
        }

        function _getOmittedLenValidInputs(
            error: string | Error | undefined = undefined,
        ): IStringCheckInput[] {
            return [
                {
                    arg: _testValues.getString('ok'),
                    minLength: undefined,
                    error,
                },
                { arg: _testValues.getString('ok'), minLength: -1, error },
            ];
        }

        const tester = new Tester<IStringCheckInput>(
            (input: IStringCheckInput): boolean => {
                const { arg, minLength, error } = input;
                /* eslint-disable-next-line tsel/no-explicit-any */
                return _argValidator.checkString(arg as any, minLength, error);
            },
        );

        describe('[invalid inputs - return false]', function () {
            tester.testFalseResponse(_getErrorInputs());
            tester.testFalseResponse(_getOmittedLenErrorInputs());
        });

        describe('[invalid - throw custom error]', function () {
            const message = 'something went wrong';
            const error = new CustomError(message);

            tester.testError(_getErrorInputs(error), CustomError, message);
            tester.testError(
                _getOmittedLenErrorInputs(error),
                CustomError,
                message,
            );
        });

        describe('[invalid - throw arg error]', function () {
            const message = 'something went wrong';

            tester.testError(_getErrorInputs(message), ArgError, message);
            tester.testError(
                _getOmittedLenErrorInputs(message),
                ArgError,
                message,
            );
        });

        describe('[valid inputs - return true]', function () {
            tester.testTrueResponse(_getValidInputs());
            tester.testTrueResponse(_getOmittedLenValidInputs());
        });
    });

    describe('checkEnum()', function () {
        interface IEnumCheckInput extends ITesterInput {
            enumList: Array<string | number | undefined>;
        }

        function _getErrorInputs(
            error: string | Error | undefined = undefined,
        ): IEnumCheckInput[] {
            const enumLength = 10;
            const inputCount = 5;
            const enumList = new Array(enumLength)
                .fill(0)
                .map((item, index) => `enum_${index}`);

            return new Array(inputCount)
                .fill(0)
                .map((item, index): AnyInput => `value_${index}`)
                .concat(_testValues.allButSelected())
                .map(
                    (arg: AnyInput): IEnumCheckInput => ({
                        arg,
                        enumList,
                        error,
                    }),
                );
        }

        function _getValidInputs(
            error: string | Error | undefined = undefined,
        ): IEnumCheckInput[] {
            const enumLength = 10;
            const inputCount = 5;
            const enumList = new Array(enumLength)
                .fill(0)
                .map((item, index) => `enum_${index}`);

            return new Array(inputCount)
                .fill(0)
                .map(
                    (item, index) =>
                        enumList[Math.floor(Math.random() * enumLength)],
                )
                .map(
                    (arg: AnyInput): IEnumCheckInput => ({
                        arg,
                        enumList,
                        error,
                    }),
                );
        }

        const tester = new Tester<IEnumCheckInput>(
            (input: IEnumCheckInput): boolean => {
                const { arg, enumList, error } = input;
                /* eslint-disable-next-line tsel/no-explicit-any */
                return _argValidator.checkEnum(arg as any, enumList, error);
            },
        );

        describe('[invalid inputs - return false]', function () {
            tester.testFalseResponse(_getErrorInputs());
        });

        describe('[invalid - throw custom error]', function () {
            const message = 'something went wrong';
            const error = new CustomError(message);

            tester.testError(_getErrorInputs(error), CustomError, message);
        });

        describe('[invalid - throw arg error]', function () {
            const message = 'something went wrong';

            tester.testError(_getErrorInputs(message), ArgError, message);
        });

        describe('[valid inputs - return true]', function () {
            tester.testTrueResponse(_getValidInputs());
        });
    });

    describe('checkNumber()', function () {
        interface INumberCheckInput extends ITesterInput {
            minValue: number | undefined;
        }

        function _getErrorInputs(
            error: string | Error | undefined = undefined,
        ): INumberCheckInput[] {
            return _testValues.allButNumber().map((arg: AnyInput) => ({
                arg,
                minValue: 1,
                error,
            }));
        }

        function _getOmittedMinErrorInputs(
            error: string | Error | undefined = undefined,
        ): INumberCheckInput[] {
            return [
                { arg: -1, minValue: undefined, error },
                { arg: -2, minValue: undefined, error },
            ];
        }

        function _getValidInputs(
            error: string | Error | undefined = undefined,
        ): INumberCheckInput[] {
            const inputCount = 5;
            return new Array(inputCount)
                .fill(0)
                .map(
                    (item, index) =>
                        _testValues.getNumber(100, 100) * (index + 1),
                )
                .map((arg) => ({ arg, minValue: 1, error }));
        }

        function _getOmittedMinValidInputs(
            error: string | Error | undefined = undefined,
        ): INumberCheckInput[] {
            return [
                { arg: 3, minValue: undefined, error },
                { arg: 4, minValue: undefined, error },
            ];
        }

        const tester = new Tester<INumberCheckInput>(
            (input: INumberCheckInput): boolean => {
                const { arg, minValue, error } = input;
                /* eslint-disable-next-line tsel/no-explicit-any */
                return _argValidator.checkNumber(arg as any, minValue, error);
            },
        );

        describe('[invalid inputs - return false]', function () {
            tester.testFalseResponse(_getErrorInputs());
            tester.testFalseResponse(_getOmittedMinErrorInputs());
        });

        describe('[invalid - throw custom error]', function () {
            const message = 'something went wrong';
            const error = new CustomError(message);

            tester.testError(_getErrorInputs(error), CustomError, message);
            tester.testError(
                _getOmittedMinErrorInputs(error),
                CustomError,
                message,
            );
        });

        describe('[invalid - throw arg error]', function () {
            const message = 'something went wrong';

            tester.testError(_getErrorInputs(message), ArgError, message);
            tester.testError(
                _getOmittedMinErrorInputs(message),
                ArgError,
                message,
            );
        });

        describe('[valid inputs - return true]', function () {
            tester.testTrueResponse(_getValidInputs());
            tester.testTrueResponse(_getOmittedMinValidInputs());
        });
    });

    describe('checkObject()', function () {
        //eslint-disable-next-line tsel/no-empty-object-type
        interface IObjectCheckInput extends ITesterInput {}

        function _getErrorInputs(
            error: string | Error | undefined = undefined,
        ): IObjectCheckInput[] {
            return _testValues.allButObject().map((arg: AnyInput) => ({
                arg,
                error,
            }));
        }

        function _getValidInputs(
            error: string | Error | undefined = undefined,
        ): IObjectCheckInput[] {
            class Foo {}
            /* eslint-disable-next-line tsel/no-explicit-any */
            return [{}, new Foo() as any].map((arg) => ({ arg, error }));
        }

        const tester = new Tester<IObjectCheckInput>(
            (input: IObjectCheckInput): boolean => {
                const { arg, error } = input;
                /* eslint-disable-next-line tsel/no-explicit-any */
                return _argValidator.checkObject(arg as any, error);
            },
        );

        describe('[invalid inputs - return false]', function () {
            tester.testFalseResponse(_getErrorInputs());
        });

        describe('[invalid - throw custom error]', function () {
            const message = 'something went wrong';
            const error = new CustomError(message);

            tester.testError(_getErrorInputs(error), CustomError, message);
        });

        describe('[invalid - throw arg error]', function () {
            const message = 'something went wrong';

            tester.testError(_getErrorInputs(message), ArgError, message);
        });

        describe('[valid inputs - return true]', function () {
            tester.testTrueResponse(_getValidInputs());
        });
    });

    describe('checkArray()', function () {
        //eslint-disable-next-line tsel/no-empty-object-type
        interface IArrayCheckInput extends ITesterInput {}

        function _getErrorInputs(
            error: string | Error | undefined = undefined,
        ): IArrayCheckInput[] {
            return _testValues.allButArray().map((arg: AnyInput) => ({
                arg,
                error,
            }));
        }

        function _getValidInputs(
            error: string | Error | undefined = undefined,
        ): IArrayCheckInput[] {
            return [[]].map((arg) => ({ arg, error }));
        }

        const tester = new Tester<IArrayCheckInput>(
            (input: IArrayCheckInput): boolean => {
                const { arg, error } = input;
                /* eslint-disable-next-line tsel/no-explicit-any */
                return _argValidator.checkArray(arg as any, error);
            },
        );

        describe('[invalid inputs - return false]', function () {
            tester.testFalseResponse(_getErrorInputs());
        });

        describe('[invalid - throw custom error]', function () {
            const message = 'something went wrong';
            const error = new CustomError(message);

            tester.testError(_getErrorInputs(error), CustomError, message);
        });

        describe('[invalid - throw arg error]', function () {
            const message = 'something went wrong';

            tester.testError(_getErrorInputs(message), ArgError, message);
        });

        describe('[valid inputs - return true]', function () {
            tester.testTrueResponse(_getValidInputs());
        });
    });

    describe('checkBoolean()', function () {
        //eslint-disable-next-line tsel/no-empty-object-type
        interface IBooleanCheckInput extends ITesterInput {}

        function _getErrorInputs(
            error: string | Error | undefined = undefined,
        ): IBooleanCheckInput[] {
            return _testValues.allButBoolean().map((arg: AnyInput) => ({
                arg,
                error,
            }));
        }

        function _getValidInputs(
            error: string | Error | undefined = undefined,
        ): IBooleanCheckInput[] {
            return [true, false].map((arg) => ({ arg, error }));
        }

        const tester = new Tester<IBooleanCheckInput>(
            (input: IBooleanCheckInput): boolean => {
                const { arg, error } = input;
                /* eslint-disable-next-line tsel/no-explicit-any */
                return _argValidator.checkBoolean(arg as any, error);
            },
        );

        describe('[invalid inputs - return false]', function () {
            tester.testFalseResponse(_getErrorInputs());
        });

        describe('[invalid - throw custom error]', function () {
            const message = 'something went wrong';
            const error = new CustomError(message);

            tester.testError(_getErrorInputs(error), CustomError, message);
        });

        describe('[invalid - throw arg error]', function () {
            const message = 'something went wrong';

            tester.testError(_getErrorInputs(message), ArgError, message);
        });

        describe('[valid inputs - return true]', function () {
            tester.testTrueResponse(_getValidInputs());
        });
    });

    describe('checkFunction()', function () {
        //eslint-disable-next-line tsel/no-empty-object-type
        interface IFunctionCheckInput extends ITesterInput {}

        function _getErrorInputs(
            error: string | Error | undefined = undefined,
        ): IFunctionCheckInput[] {
            return _testValues.allButFunction().map((arg: AnyInput) => ({
                arg,
                error,
            }));
        }

        function _getValidInputs(
            error: string | Error | undefined = undefined,
        ): IFunctionCheckInput[] {
            return [function foo() {}, () => undefined].map((arg) => ({
                /* eslint-disable-next-line tsel/no-explicit-any */
                arg: arg as any,
                error,
            }));
        }

        const tester = new Tester<IFunctionCheckInput>(
            (input: IFunctionCheckInput): boolean => {
                const { arg, error } = input;
                /* eslint-disable-next-line tsel/no-explicit-any */
                return _argValidator.checkFunction(arg as any, error);
            },
        );

        describe('[invalid inputs - return false]', function () {
            tester.testFalseResponse(_getErrorInputs());
        });

        describe('[invalid - throw custom error]', function () {
            const message = 'something went wrong';
            const error = new CustomError(message);

            tester.testError(_getErrorInputs(error), CustomError, message);
        });

        describe('[invalid - throw arg error]', function () {
            const message = 'something went wrong';

            tester.testError(_getErrorInputs(message), ArgError, message);
        });

        describe('[valid inputs - return true]', function () {
            tester.testTrueResponse(_getValidInputs());
        });
    });

    describe('checkInstance()', function () {
        interface IInstanceCheckInput extends ITesterInput {
            type: unknown;
        }

        class Foo {}

        function _getErrorInputs(
            error: string | Error | undefined = undefined,
        ): IInstanceCheckInput[] {
            return _testValues.allButSelected().map((arg: AnyInput) => ({
                arg,
                type: Foo,
                error,
            }));
        }

        function _getValidInputs(
            error: string | Error | undefined = undefined,
        ): IInstanceCheckInput[] {
            return [new Foo()].map((arg) => ({
                /* eslint-disable-next-line tsel/no-explicit-any */
                arg: arg as any,
                type: Foo,
                error,
            }));
        }

        const tester = new Tester<IInstanceCheckInput>(
            (input: IInstanceCheckInput): boolean => {
                const { arg, type, error } = input;
                /* eslint-disable-next-line tsel/no-explicit-any */
                return _argValidator.checkInstance(arg as any, type, error);
            },
        );

        describe('[invalid inputs - return false]', function () {
            tester.testFalseResponse(_getErrorInputs());
        });

        describe('[invalid - throw custom error]', function () {
            const message = 'something went wrong';
            const error = new CustomError(message);

            tester.testError(_getErrorInputs(error), CustomError, message);
        });

        describe('[invalid - throw arg error]', function () {
            const message = 'something went wrong';

            tester.testError(_getErrorInputs(message), ArgError, message);
        });

        describe('[valid inputs - return true]', function () {
            tester.testTrueResponse(_getValidInputs());
        });
    });
});
