import { expect, use as _useWithChai } from 'chai';
import _sinonChai from 'sinon-chai';
import _chaiAsPromised from 'chai-as-promised';
import 'mocha';

_useWithChai(_sinonChai);
_useWithChai(_chaiAsPromised);

import { testValues as _testValues } from '@vamship/test-utils';
// import { args as _args }  from '@vamship/error-types';
// const { ArgError } = _args;

type AnyInput = _testValues.AnyInput;

import * as _argValidator from '../../src/arg-validator.js';

describe('argValidator', function () {
    //     it('should expose the expected methods and properties', () => {
    //         expect(_argValidator.checkString).to.be.a('function');
    //         expect(_argValidator.checkEnum).to.be.a('function');
    //         expect(_argValidator.checkNumber).to.be.a('function');
    //         expect(_argValidator.checkObject).to.be.a('function');
    //         expect(_argValidator.checkArray).to.be.a('function');
    //         expect(_argValidator.checkBoolean).to.be.a('function');
    //         expect(_argValidator.checkFunction).to.be.a('function');
    //         expect(_argValidator.checkInstance).to.be.a('function');
    //     });
    //     class Tester {
    //         private method: string;
    //         constructor(method: string) {
    //             this.method = method;
    //         }
    //         checkError(inputs: AnyInput, type: Error, message: string) {
    //             type = type || ArgError;
    //             message = message || new ArgError().message;
    //             inputs.forEach((arg) => {
    //                 const wrapper = () => {
    //                     return this.method(...arg);
    //                 };
    //                 expect(wrapper).to.throw(type, message);
    //             });
    //         }
    //         checkTrue(inputs: AnyInput) {
    //             inputs.forEach((arg) => {
    //                 expect(this.method(...arg)).to.be.true;
    //             });
    //         }
    //         checkFalse(inputs) {
    //             inputs.forEach((arg) => {
    //                 expect(this.method(...arg)).to.be.false;
    //             });
    //         }
    //     }
    //     class CustomError extends Error {
    //         constructor(message) {
    //             super(message);
    //         }
    //     }
    //     describe('checkString()', () => {
    //         function _createTester() {
    //             return new Tester(_argValidator.checkString);
    //         }
    //         function _getErrorInputs(error) {
    //             return _testValues.allButString('').map((item) => [item, 1, error]);
    //         }
    //         function _getValidInputs(count) {
    //             count = count || 10;
    //             const inputs = [];
    //             for (let index = 0; index < count; index++) {
    //                 inputs.push(_testValues.getString(`value_${index}`));
    //             }
    //             return inputs.map((item) => [item, 1]);
    //         }
    //         it('should return false if the input is not a valid string', () => {
    //             const inputs = _getErrorInputs();
    //             const tester = _createTester();
    //             tester.checkFalse(inputs);
    //         });
    //         it('should return false if the input is a valid string, but is too short', () => {
    //             const inputs = [
    //                 ['foo', 10],
    //                 ['', 1],
    //             ];
    //             const tester = _createTester();
    //             tester.checkFalse(inputs);
    //         });
    //         it('should default the min length to 1 if omitted', () => {
    //             const errorInputs = [['']];
    //             const okInputs = [[_testValues.getString('ok')]];
    //             const tester = _createTester();
    //             tester.checkFalse(errorInputs);
    //             tester.checkTrue(okInputs);
    //         });
    //         it('should throw the error if the error is a custom error type', () => {
    //             const message = _testValues.getString('message');
    //             const error = new CustomError(message);
    //             const inputs = _getErrorInputs(error);
    //             const tester = _createTester();
    //             tester.checkError(inputs, CustomError, message);
    //         });
    //         it('should throw an ArgError with a custom message if the error is a string', () => {
    //             const message = _testValues.getString('message');
    //             const inputs = _getErrorInputs(message);
    //             const tester = _createTester();
    //             tester.checkError(inputs, ArgError, message);
    //         });
    //         it('should return true if the input is a valid string and is long enough', () => {
    //             const inputs = _getValidInputs();
    //             const tester = _createTester();
    //             tester.checkTrue(inputs);
    //         });
    //     });
    //     describe('checkEnum()', () => {
    //         function _createTester() {
    //             return new Tester(_argValidator.checkEnum);
    //         }
    //         function _getErrorInputs(error, enumCount, inputCount) {
    //             if (typeof enumCount !== 'number') {
    //                 enumCount = 10;
    //             }
    //             if (typeof inputCount !== 'number') {
    //                 inputCount = 5;
    //             }
    //             const enumList = [];
    //             for (let index = 0; index < enumCount; index++) {
    //                 enumList.push(_testValues.getString(`enum_${index}`));
    //             }
    //             const inputs = _testValues.allButSelected();
    //             for (let index = 0; index < inputCount; index++) {
    //                 inputs.push(_testValues.getString(`value_${index}`));
    //             }
    //             return inputs.map((item) => [item, enumList, error]);
    //         }
    //         function _getValidInputs(enumCount, inputCount) {
    //             if (typeof enumCount !== 'number') {
    //                 enumCount = 10;
    //             }
    //             if (typeof inputCount !== 'number') {
    //                 inputCount = 5;
    //             }
    //             const enumList = [];
    //             for (let index = 0; index < enumCount; index++) {
    //                 enumList.push(_testValues.getString(`enum_${index}`));
    //             }
    //             const inputs = [];
    //             for (let index = 0; index < inputCount; index++) {
    //                 let enumIndex = Math.floor(Math.random() * enumCount);
    //                 inputs.push(enumList[enumIndex]);
    //             }
    //             return inputs.map((item) => [item, enumList]);
    //         }
    //         it('should return false if the input is not a valid enum member', () => {
    //             const inputs = _getErrorInputs();
    //             const tester = _createTester();
    //             tester.checkFalse(inputs);
    //         });
    //         it('should return false if the enum list is empty', () => {
    //             const inputs = _getErrorInputs(undefined, 0, 10);
    //             const tester = _createTester();
    //             tester.checkFalse(inputs);
    //         });
    //         it('should throw the error if the error is a custom error type', () => {
    //             const message = _testValues.getString('message');
    //             const error = new CustomError(message);
    //             const inputs = _getErrorInputs(error);
    //             const tester = _createTester();
    //             tester.checkError(inputs, CustomError, message);
    //         });
    //         it('should throw an ArgError with a custom message if the error is a string', () => {
    //             const message = _testValues.getString('message');
    //             const inputs = _getErrorInputs(message);
    //             const tester = _createTester();
    //             tester.checkError(inputs, ArgError, message);
    //         });
    //         it('should return true if the input is a valid enum value', () => {
    //             const inputs = _getValidInputs();
    //             const tester = _createTester();
    //             tester.checkTrue(inputs);
    //         });
    //     });
    //     describe('checkNumber()', () => {
    //         function _createTester() {
    //             return new Tester(_argValidator.checkNumber);
    //         }
    //         function _getErrorInputs(error) {
    //             return _testValues.allButNumber().map((item) => [item, 1, error]);
    //         }
    //         function _getValidInputs(count) {
    //             count = count || 10;
    //             const inputs = [];
    //             for (let index = 0; index < count; index++) {
    //                 inputs.push(_testValues.getNumber(100, 100));
    //             }
    //             return inputs.map((item) => [item, 1]);
    //         }
    //         it('should return false if the input is not a valid number', () => {
    //             const inputs = _getErrorInputs();
    //             const tester = _createTester();
    //             tester.checkFalse(inputs);
    //         });
    //         it('should return false if the input is a valid number, but is too small', () => {
    //             const inputs = [
    //                 [8, 10],
    //                 [0, 1],
    //                 [-1, 0],
    //             ];
    //             const tester = _createTester();
    //             tester.checkFalse(inputs);
    //         });
    //         it('should default the min value to 1 if omitted', () => {
    //             const errorInputs = [[-1, 0]];
    //             const okInputs = [[_testValues.getNumber(100, 100)]];
    //             const tester = _createTester();
    //             tester.checkFalse(errorInputs);
    //             tester.checkTrue(okInputs);
    //         });
    //         it('should throw the error if the error is a custom error type', () => {
    //             const message = _testValues.getString('message');
    //             const error = new CustomError(message);
    //             const inputs = _getErrorInputs(error);
    //             const tester = _createTester();
    //             tester.checkError(inputs, CustomError, message);
    //         });
    //         it('should throw an ArgError with a custom message if the error is a string', () => {
    //             const message = _testValues.getString('message');
    //             const inputs = _getErrorInputs(message);
    //             const tester = _createTester();
    //             tester.checkError(inputs, ArgError, message);
    //         });
    //         it('should return true if the input is a valid number and is large enough', () => {
    //             const inputs = _getValidInputs();
    //             const tester = _createTester();
    //             tester.checkTrue(inputs);
    //         });
    //     });
    //     describe('checkObject()', () => {
    //         function _createTester() {
    //             return new Tester(_argValidator.checkObject);
    //         }
    //         function _getErrorInputs(error) {
    //             return _testValues.allButObject().map((item) => [item, error]);
    //         }
    //         function _getValidInputs() {
    //             function Foo() {}
    //             const inputs = [{}, new Foo()];
    //             return inputs.map((item) => [item]);
    //         }
    //         it('should return false if the input is not a valid object', () => {
    //             const inputs = _getErrorInputs();
    //             const tester = _createTester();
    //             tester.checkFalse(inputs);
    //         });
    //         it('should throw the error if the error is a custom error type', () => {
    //             const message = _testValues.getString('message');
    //             const error = new CustomError(message);
    //             const inputs = _getErrorInputs(error);
    //             const tester = _createTester();
    //             tester.checkError(inputs, CustomError, message);
    //         });
    //         it('should throw an ArgError with a custom message if the error is a string', () => {
    //             const message = _testValues.getString('message');
    //             const inputs = _getErrorInputs(message);
    //             const tester = _createTester();
    //             tester.checkError(inputs, ArgError, message);
    //         });
    //         it('should return true if the input is a valid object', () => {
    //             const inputs = _getValidInputs();
    //             const tester = _createTester();
    //             tester.checkTrue(inputs);
    //         });
    //     });
    //     describe('checkArray()', () => {
    //         function _createTester() {
    //             return new Tester(_argValidator.checkArray);
    //         }
    //         function _getErrorInputs(error) {
    //             return _testValues.allButArray().map((item) => [item, error]);
    //         }
    //         function _getValidInputs() {
    //             const inputs = [[], new Array()];
    //             return inputs.map((item) => [item]);
    //         }
    //         it('should return false if the input is not a valid array', () => {
    //             const inputs = _getErrorInputs();
    //             const tester = _createTester();
    //             tester.checkFalse(inputs);
    //         });
    //         it('should throw the error if the error is a custom error type', () => {
    //             const message = _testValues.getString('message');
    //             const error = new CustomError(message);
    //             const inputs = _getErrorInputs(error);
    //             const tester = _createTester();
    //             tester.checkError(inputs, CustomError, message);
    //         });
    //         it('should throw an ArgError with a custom message if the error is a string', () => {
    //             const message = _testValues.getString('message');
    //             const inputs = _getErrorInputs(message);
    //             const tester = _createTester();
    //             tester.checkError(inputs, ArgError, message);
    //         });
    //         it('should return true if the input is a valid array', () => {
    //             const inputs = _getValidInputs();
    //             const tester = _createTester();
    //             tester.checkTrue(inputs);
    //         });
    //     });
    //     describe('checkBoolean()', () => {
    //         function _createTester() {
    //             return new Tester(_argValidator.checkBoolean);
    //         }
    //         function _getErrorInputs(error) {
    //             return _testValues.allButBoolean().map((item) => [item, error]);
    //         }
    //         function _getValidInputs() {
    //             const inputs = [true, false];
    //             return inputs.map((item) => [item]);
    //         }
    //         it('should return false if the input is not a valid boolean', () => {
    //             const inputs = _getErrorInputs();
    //             const tester = _createTester();
    //             tester.checkFalse(inputs);
    //         });
    //         it('should throw the error if the error is a custom error type', () => {
    //             const message = _testValues.getString('message');
    //             const error = new CustomError(message);
    //             const inputs = _getErrorInputs(error);
    //             const tester = _createTester();
    //             tester.checkError(inputs, CustomError, message);
    //         });
    //         it('should throw an ArgError with a custom message if the error is a string', () => {
    //             const message = _testValues.getString('message');
    //             const inputs = _getErrorInputs(message);
    //             const tester = _createTester();
    //             tester.checkError(inputs, ArgError, message);
    //         });
    //         it('should return true if the input is a valid boolean', () => {
    //             const inputs = _getValidInputs();
    //             const tester = _createTester();
    //             tester.checkTrue(inputs);
    //         });
    //     });
    //     describe('checkFunction()', () => {
    //         function _createTester() {
    //             return new Tester(_argValidator.checkFunction);
    //         }
    //         function _getErrorInputs(error) {
    //             return _testValues.allButFunction().map((item) => [item, error]);
    //         }
    //         function _getValidInputs() {
    //             const inputs = [() => {}, function foo() {}];
    //             return inputs.map((item) => [item]);
    //         }
    //         it('should return false if the input is not a valid function', () => {
    //             const inputs = _getErrorInputs();
    //             const tester = _createTester();
    //             tester.checkFalse(inputs);
    //         });
    //         it('should throw the error if the error is a custom error type', () => {
    //             const message = _testValues.getString('message');
    //             const error = new CustomError(message);
    //             const inputs = _getErrorInputs(error);
    //             const tester = _createTester();
    //             tester.checkError(inputs, CustomError, message);
    //         });
    //         it('should throw an ArgError with a custom message if the error is a string', () => {
    //             const message = _testValues.getString('message');
    //             const inputs = _getErrorInputs(message);
    //             const tester = _createTester();
    //             tester.checkError(inputs, ArgError, message);
    //         });
    //         it('should return true if the input is a valid function', () => {
    //             const inputs = _getValidInputs();
    //             const tester = _createTester();
    //             tester.checkTrue(inputs);
    //         });
    //     });
    //     describe('checkInstance()', () => {
    //         function _createTester() {
    //             return new Tester(_argValidator.checkInstance);
    //         }
    //         function _getErrorInputs(error) {
    //             const instanceList = _testValues.allButSelected();
    //             function Foo() {}
    //             return instanceList.map((item) => [item, Foo, error]);
    //         }
    //         function _getValidInputs(instanceCount, inputCount) {
    //             if (typeof instanceCount !== 'number') {
    //                 instanceCount = 5;
    //             }
    //             if (typeof inputCount !== 'number') {
    //                 inputCount = 10;
    //             }
    //             const instanceList = [];
    //             for (let index = 0; index < instanceCount; index++) {
    //                 instanceList.push(function () {});
    //             }
    //             const inputs = [];
    //             for (let index = 0; index < inputCount; index++) {
    //                 let instanceIndex = Math.floor(Math.random() * instanceCount);
    //                 let type = instanceList[instanceIndex];
    //                 inputs.push([new type(), type]);
    //             }
    //             return inputs;
    //         }
    //         it('should return false if the input is not a valid instance', () => {
    //             const inputs = _getErrorInputs();
    //             const tester = _createTester();
    //             tester.checkFalse(inputs);
    //         });
    //         it('should return false if the type is invalid', () => {
    //             const inputs = _testValues.allButFunction().map((type) => {
    //                 return [new Array(), type];
    //             });
    //             const tester = _createTester();
    //             tester.checkFalse(inputs);
    //         });
    //         it('should throw the error if the error is a custom error type', () => {
    //             const message = _testValues.getString('message');
    //             const error = new CustomError(message);
    //             const inputs = _getErrorInputs(error);
    //             const tester = _createTester();
    //             tester.checkError(inputs, CustomError, message);
    //         });
    //         it('should throw an ArgError with a custom message if the error is a string', () => {
    //             const message = _testValues.getString('message');
    //             const inputs = _getErrorInputs(message);
    //             const tester = _createTester();
    //             tester.checkError(inputs, ArgError, message);
    //         });
    //         it('should return true if the input is a valid instance value', () => {
    //             const inputs = _getValidInputs();
    //             const tester = _createTester();
    //             tester.checkTrue(inputs);
    //         });
    //     });
});
