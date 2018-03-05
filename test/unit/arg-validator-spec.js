'use strict';

const _chai = require('chai');
_chai.use(require('sinon-chai'));
_chai.use(require('chai-as-promised'));
const expect = _chai.expect;

const _rewire = require('rewire');

const _testUtils = require('@vamship/test-utils');
const _testValues = _testUtils.testValues;
const ArgCheckResult = require('../../src/arg-check-result');

let _argValidator = null;

describe('argValidator', function() {
    beforeEach(() => {
        _argValidator = _rewire('../../src/arg-validator');
    });

    it('should expose the expected methods and properties', () => {
        expect(_argValidator.checkString).to.be.a('function');
        expect(_argValidator.checkEnum).to.be.a('function');
        expect(_argValidator.checkNumber).to.be.a('function');
        expect(_argValidator.checkObject).to.be.a('function');
        expect(_argValidator.checkArray).to.be.a('function');
        expect(_argValidator.checkBoolean).to.be.a('function');
        expect(_argValidator.checkFunction).to.be.a('function');
        expect(_argValidator.checkInstance).to.be.a('function');
    });

    describe('checkString()', () => {
        it('should return an ArgCheckResult object when invoked', () => {
            const ret = _argValidator.checkString('foo');

            expect(ret).to.be.an.instanceof(ArgCheckResult);
        });

        it('should fail argument validation if the input is not a valid string', () => {
            const inputs = _testValues.allButString();

            inputs.forEach((arg) => {
                const ret = _argValidator.checkString(arg);
                expect(ret.hasErrors).to.be.true;
            });
        });

        it('should pass argument validation if the input is a valid string', () => {
            const inputs = ['foo', 'bar', 'baz'];

            inputs.forEach((arg) => {
                const ret = _argValidator.checkString(arg);
                expect(ret.hasErrors).to.be.false;
            });
        });

        it('should validate args against minmum length requirements', () => {
            const inputs = [
                {
                    arg: 'foo',
                    minLength: 4,
                    hasErrors: true
                },
                {
                    arg: 'foo',
                    minLength: 2,
                    hasErrors: false
                },
                {
                    arg: '',
                    minLength: 1,
                    hasErrors: true
                },
                {
                    arg: '',
                    minLength: 0,
                    hasErrors: false
                }
            ];

            inputs.forEach((input) => {
                const { arg, minLength, hasErrors } = input;
                const ret = _argValidator.checkString(arg, minLength);

                expect(ret.hasErrors).to.equal(hasErrors);
            });
        });

        it('should default the minLength parameter to 1', () => {
            const inputs = _testValues.allButNumber(-1);

            inputs.forEach((minLength) => {
                const ret = _argValidator.checkString('', minLength);

                expect(ret.hasErrors).to.be.true;
            });
        });
    });

    describe('checkEnum()', () => {
        it('should return an ArgCheckResult object when invoked', () => {
            const ret = _argValidator.checkEnum('foo', []);

            expect(ret).to.be.an.instanceof(ArgCheckResult);
        });

        it('should fail argument validation if values list is empty', () => {
            const values = [];

            const ret = _argValidator.checkEnum('foo', values);
            expect(ret.hasErrors).to.be.true;
        });

        it('should fail argument validation if values list is not an array', () => {
            const inputs = _testValues.allButArray();

            inputs.forEach((values) => {
                const ret = _argValidator.checkEnum('foo', values);
                expect(ret.hasErrors).to.be.true;
            });
        });

        it('should fail argument validation if arg is not present in the values list', () => {
            const inputs = _testValues.allButString('foo');
            const values = ['good', 'better', 'best'];

            inputs.forEach((arg) => {
                const ret = _argValidator.checkEnum(arg, values);
                expect(ret.hasErrors).to.be.true;
            });
        });

        it('should pass argument validation if arg is present in the values list', () => {
            const inputs = _testValues.allButString('foo');

            inputs.forEach((arg) => {
                const ret = _argValidator.checkEnum(arg, inputs);
                expect(ret.hasErrors).to.be.false;
            });
        });
    });

    describe('checkNumber()', () => {
        it('should return an ArgCheckResult object when invoked', () => {
            const ret = _argValidator.checkNumber(123);

            expect(ret).to.be.an.instanceof(ArgCheckResult);
        });

        it('should fail argument validation if the input is not a valid number', () => {
            const inputs = _testValues.allButNumber();

            inputs.forEach((arg) => {
                const ret = _argValidator.checkNumber(arg);
                expect(ret.hasErrors).to.be.true;
            });
        });

        it('should pass argument validation if the input is a valid number', () => {
            const inputs = [1, 1, 2, 3, 5, 8, 13, 21];

            inputs.forEach((arg) => {
                const ret = _argValidator.checkNumber(arg);
                expect(ret.hasErrors).to.be.false;
            });
        });

        it('should validate args against minmum value requirements', () => {
            const inputs = [
                {
                    arg: 2,
                    min: 4,
                    hasErrors: true
                },
                {
                    arg: 2,
                    min: 2,
                    hasErrors: false
                },
                {
                    arg: 0,
                    min: -1,
                    hasErrors: false
                }
            ];

            inputs.forEach((input) => {
                const { arg, min, hasErrors } = input;
                const ret = _argValidator.checkNumber(arg, min);

                expect(ret.hasErrors).to.equal(hasErrors);
            });
        });

        it('should default the min parameter to 1', () => {
            const inputs = _testValues.allButNumber();

            inputs.forEach((min) => {
                const ret = _argValidator.checkNumber(-1, min);

                expect(ret.hasErrors).to.be.true;
            });
        });
    });

    describe('checkObject()', () => {
        it('should return an ArgCheckResult object when invoked', () => {
            const ret = _argValidator.checkObject({});

            expect(ret).to.be.an.instanceof(ArgCheckResult);
        });

        it('should fail argument validation if the input is not a valid object', () => {
            const inputs = _testValues.allButObject();

            inputs.forEach((arg) => {
                const ret = _argValidator.checkObject(arg);
                expect(ret.hasErrors).to.be.true;
            });
        });

        it('should pass argument validation if the input is a valid object', () => {
            const inputs = [{}, new Error(), { abc: 123 }];

            inputs.forEach((arg) => {
                const ret = _argValidator.checkObject(arg);
                expect(ret.hasErrors).to.be.false;
            });
        });
    });

    describe('checkArray()', () => {
        it('should return an ArgCheckResult object when invoked', () => {
            const ret = _argValidator.checkArray([]);

            expect(ret).to.be.an.instanceof(ArgCheckResult);
        });

        it('should fail argument validation if the input is not a valid array', () => {
            const inputs = _testValues.allButArray();

            inputs.forEach((arg) => {
                const ret = _argValidator.checkArray(arg);
                expect(ret.hasErrors).to.be.true;
            });
        });

        it('should pass argument validation if the input is a valid array', () => {
            const inputs = [[1], ['foo', 'bar', {}]];

            inputs.forEach((arg) => {
                const ret = _argValidator.checkArray(arg);
                expect(ret.hasErrors).to.be.false;
            });
        });
    });

    describe('checkBoolean()', () => {
        it('should return an ArgCheckResult object when invoked', () => {
            const ret = _argValidator.checkBoolean([]);

            expect(ret).to.be.an.instanceof(ArgCheckResult);
        });

        it('should fail argument validation if the input is not a valid boolean', () => {
            const inputs = _testValues.allButBoolean();

            inputs.forEach((arg) => {
                const ret = _argValidator.checkBoolean(arg);
                expect(ret.hasErrors).to.be.true;
            });
        });

        it('should pass argument validation if the input is a valid boolean', () => {
            const inputs = [true, false];

            inputs.forEach((arg) => {
                const ret = _argValidator.checkBoolean(arg);
                expect(ret.hasErrors).to.be.false;
            });
        });
    });

    describe('checkFunction()', () => {
        it('should return an ArgCheckResult object when invoked', () => {
            const ret = _argValidator.checkFunction({});

            expect(ret).to.be.an.instanceof(ArgCheckResult);
        });

        it('should fail argument validation if the input is not a valid function', () => {
            const inputs = _testValues.allButFunction();

            inputs.forEach((arg) => {
                const ret = _argValidator.checkFunction(arg);
                expect(ret.hasErrors).to.be.true;
            });
        });

        it('should pass argument validation if the input is a valid function', () => {
            const inputs = [() => {}, function() {}];

            inputs.forEach((arg) => {
                const ret = _argValidator.checkFunction(arg);
                expect(ret.hasErrors).to.be.false;
            });
        });
    });

    describe('checkInstance()', () => {
        it('should return an ArgCheckResult object when invoked', () => {
            const ret = _argValidator.checkInstance({}, Array);

            expect(ret).to.be.an.instanceof(ArgCheckResult);
        });

        it('should fail argument validation if the input is not a valid instance of the type', () => {
            const inputs = _testValues.allButObject({});
            function Type() {}

            inputs.forEach((arg) => {
                const ret = _argValidator.checkInstance(arg, Type);
                expect(ret.hasErrors).to.be.true;
            });
        });

        it('should fail argument validation if the type argument is invalid', () => {
            const inputs = _testValues.allButFunction({});

            inputs.forEach((Type) => {
                const ret = _argValidator.checkInstance({}, Type);
                expect(ret.hasErrors).to.be.true;
            });
        });

        it('should pass argument validation if the arg is a valid instance of the type', () => {
            function Type() {}
            const inputs = [new Type(), new Type()];

            inputs.forEach((arg) => {
                const ret = _argValidator.checkInstance(arg, Type);
                expect(ret.hasErrors).to.be.false;
            });
        });
    });
});
