'use strict';

const _sinon = require('sinon');
const _chai = require('chai');
_chai.use(require('sinon-chai'));
_chai.use(require('chai-as-promised'));
const expect = _chai.expect;

const _rewire = require('rewire');

const { ArgError } = require('@vamship/error-types').args;
const _testUtils = require('@vamship/test-utils');
const _testValues = _testUtils.testValues;

let ArgCheckResult = null;

describe('ArgCheckResult', function() {
    beforeEach(() => {
        ArgCheckResult = _rewire('../../src/arg-check-result');
    });

    describe('ctor()', () => {
        it('should throw an error if invoked without a valid hasErrors argument', () => {
            const error = 'Invalid hasErrors specified (arg #1)';
            const inputs = _testValues.allButBoolean();

            inputs.forEach((hasErrors) => {
                const wrapper = () => {
                    return new ArgCheckResult(hasErrors);
                };

                expect(wrapper).to.throw(error);
            });
        });

        it('should expose the expected properties and methods', () => {
            const result = new ArgCheckResult(false);

            expect(result).to.be.an('object');
            expect(result.hasErrors).to.be.false;
            expect(result.throw).to.be.a('function');
            expect(result.do).to.be.a('function');
        });

        it('should set hasErrors to the input value', () => {
            const inputs = [true, false];

            inputs.forEach((hasErrors) => {
                const result = new ArgCheckResult(hasErrors);

                expect(result.hasErrors).to.equal(hasErrors);
            });
        });
    });

    describe('throw()', () => {
        it('should do nothing if hasErrors = false', () => {
            const message = 'something went wrong!';
            const wrapper = () => {
                const result = new ArgCheckResult(false);
                result.throw(new Error(message));
            };

            expect(wrapper).to.not.throw();
        });

        it('should throw the specified error if hasErrors=true', () => {
            const message = 'something went wrong!';
            const wrapper = () => {
                const result = new ArgCheckResult(true);
                result.throw(new Error(message));
            };

            expect(wrapper).to.throw(Error, message);
        });

        it('should wrap the argument in an ArgError if the input is a string', () => {
            const message = 'something went wrong!';
            const wrapper = () => {
                const result = new ArgCheckResult(true);
                result.throw(message);
            };

            expect(wrapper).to.throw(ArgError, message);
        });

        it('should throw a default error if the input is not a string or error', () => {
            const defaultError = new Error('something went wrong');
            const inputs = _testValues.allButString();

            inputs.forEach((error) => {
                const wrapper = () => {
                    const result = new ArgCheckResult(true, defaultError);
                    result.throw(error);
                };

                expect(wrapper).to.throw(Error, defaultError.message);
            });
        });

        it('should set the default error to an ArgError if one is not specified', () => {
            const inputs = _testValues.allButObject({});

            inputs.forEach((error) => {
                const wrapper = () => {
                    const result = new ArgCheckResult(true, error);
                    result.throw();
                };

                expect(wrapper).to.throw(ArgError, new ArgError().message);
            });
        });
    });

    describe('do()', () => {
        it('should return a reference to the arg check result object', () => {
            const result = new ArgCheckResult(false);
            const ret = result.do(() => {});
            expect(ret).to.equal(result);
        });

        it('should do nothing if hasErrors = false', () => {
            const spy = _sinon.spy();
            const result = new ArgCheckResult(false);
            result.do(spy);

            expect(spy).to.not.have.been.called;
        });

        it('should do nothing if the action is not a function', () => {
            const inputs = _testValues.allButFunction();

            inputs.forEach((action) => {
                const wrapper = () => {
                    const result = new ArgCheckResult(true);
                    result.do(action);
                };

                expect(wrapper).to.not.throw();
            });
        });

        it('should invoke the action if hasErrors=true', () => {
            const spy = _sinon.spy();
            const result = new ArgCheckResult(true);
            result.do(spy);

            expect(spy).to.have.been.calledOnce;
        });
    });
});
