'use strict';

const { ArgError } = require('@vamship/error-types').args;

/**
 * Represents the result of an argument check operation. This class is <b>not
 * intended for direct instantiation</b>. It will be returned as a result
 * of an argument check call
 * (ex: [checkString()]{@link module:argValidator.checkString})
 * from the [argValidator]{@link module:argValidator} module.
 */
class ArgCheckResult {
    /**
     * @param {Boolean} hasErrors A boolean parameter that indicates whether or
     *        not the argument check resulted in errors.
     * @param {Error} [defaultError=new ArgError()] The default error that will
     *        be thrown by [throw()]{@link ArgCheckResult#throw} if an
     *        overriding error argument is not specified.
     */
    constructor(hasErrors, defaultError) {
        if (typeof hasErrors !== 'boolean') {
            throw new Error('Invalid hasErrors specified (arg #1)');
        }
        if (!(defaultError instanceof Error)) {
            defaultError = new ArgError();
        }
        this._hasErrors = !!hasErrors;
        this._defaultError = defaultError;
    }

    /**
     * Determines whether or not the argument check resulted in errors.
     *
     * @type {Boolean}
     */
    get hasErrors() {
        return this._hasErrors;
    }

    /**
     * An exception throwing operation that will only be performed if the
     * argument check has failed.
     *
     * @param {String|Error} [error=new ArgError()] An argument error to be
     *        thrown if the check has failed.
     */
    throw(error) {
        if (this._hasErrors) {
            if (typeof error === 'string') {
                error = new ArgError(error);
            } else if (!(error instanceof Error)) {
                error = this._defaultError;
            }
            throw error;
        }
    }

    /**
     * An operation that will only be performed if the argument check has
     * failed. This method is intended to allow default values to be set for
     * the argument, or to perform pre error actions such as logging.
     *
     * @param {Function} [action=()=>{}] A function that provides an operation
     *        to be performed if the check has failed.
     *
     * @return {ArgCheckResult} A reference to the arg check object to allow
     *         chaining of actions.
     */
    do(action) {
        if (this._hasErrors && typeof action === 'function') {
            action();
        }
        return this;
    }
}

module.exports = ArgCheckResult;
