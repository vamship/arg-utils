'use strict';

const { ArgError } = require('@vamship/error-types').args;

/**
 * Reusable method that handles the result of a validation check, and performs
 * the necessary actions.
 *
 * @private
 * @param {Boolean} isValid Determines if the validation check was successful.
 * @param {String|Error} [error] The error to throw if the validation failed.
 *
 * @return {Boolean} True if the validation was successful, false otherwise.
 * @throws {ArgError|Error} Thrown if validation fails, and the input error is
 *         not undefined.
 */
function _handleResult(isValid, error) {
    if (!isValid) {
        if (error instanceof Error) {
            throw error;
        } else if (typeof error === 'string') {
            throw new ArgError(error);
        }
        return false;
    }
    return true;
}

/**
 * @module argValidator
 */
module.exports = {
    /**
     * The error to be thrown if validation fails. If the value is a string, an
     * ArgError will be thrown with the string as the message. If the value is
     * an Error, the error object will be thrown.
     *
     * @typedef {String|Error} module:argValidator.Error
     */
    /**
     * Checks if the specified argument is a valid string.
     *
     * @param {*} arg The argument to check
     * @param {Number} [minLength=1] The expected minimum length of the string.
     * @param {module:argValidator.Error} [error=undefined] The error to be
     *        thrown if validation fails.
     *
     * @return {Boolean} True if the string is valid, false otherwise.
     * @throws {ArgError|Error} Thrown if validation fails, and the input error
     *         is not undefined.
     */
    checkString: function(arg, minLength, error) {
        if (typeof minLength !== 'number' || minLength < 0) {
            minLength = 1;
        }
        const isOk = typeof arg === 'string' && arg.length >= minLength;
        return _handleResult(isOk, error);
    },

    /**
     * Checks if the specified argument is present amongst the list of possible
     * values.
     *
     * @param {*} arg The argument to check
     * @param {Array} values A list of allowed values that the argument must
     *        belong to.
     * @param {module:argValidator.Error} [error=undefined] The error to be
     *        thrown if validation fails.
     *
     * @return {Boolean} True if the string is valid, false otherwise.
     * @throws {ArgError|Error} Thrown if validation fails, and the input error
     *         is not undefined.
     */
    checkEnum: function(arg, values, error) {
        const isOk = values instanceof Array && values.indexOf(arg) >= 0;
        return _handleResult(isOk, error);
    },

    /**
     * Checks if the specified argument is a valid number.
     *
     * @param {*} arg The argument to check
     * @param {Number} [min=1] The expected minimum value of the number.
     * @param {module:argValidator.Error} [error=undefined] The error to be
     *        thrown if validation fails.
     *
     * @return {Boolean} True if the string is valid, false otherwise.
     * @throws {ArgError|Error} Thrown if validation fails, and the input error
     *         is not undefined.
     */
    checkNumber: function(arg, min, error) {
        if (typeof min !== 'number') {
            min = 1;
        }
        const isOk = typeof arg === 'number' && arg >= min;
        return _handleResult(isOk, error);
    },

    /**
     * Checks if the specified argument is a valid object.
     *
     * @param {*} arg The argument to check
     * @param {module:argValidator.Error} [error=undefined] The error to be
     *        thrown if validation fails.
     *
     * @return {Boolean} True if the string is valid, false otherwise.
     * @throws {ArgError|Error} Thrown if validation fails, and the input error
     *         is not undefined.
     */
    checkObject: function(arg, error) {
        const isOk = arg && !(arg instanceof Array) && typeof arg === 'object';
        return _handleResult(isOk, error);
    },

    /**
     * Checks if the specified argument is a valid array.
     *
     * @param {*} arg The argument to check
     * @param {module:argValidator.Error} [error=undefined] The error to be
     *        thrown if validation fails.
     *
     * @return {Boolean} True if the string is valid, false otherwise.
     * @throws {ArgError|Error} Thrown if validation fails, and the input error
     *         is not undefined.
     */
    checkArray: function(arg, error) {
        const isOk = arg instanceof Array;
        return _handleResult(isOk, error);
    },

    /**
     * Checks if the specified argument is a valid boolean.
     *
     * @param {*} arg The argument to check
     * @param {module:argValidator.Error} [error=undefined] The error to be
     *        thrown if validation fails.
     *
     * @return {Boolean} True if the string is valid, false otherwise.
     * @throws {ArgError|Error} Thrown if validation fails, and the input error
     *         is not undefined.
     */
    checkBoolean: function(arg, error) {
        const isOk = typeof arg === 'boolean';
        return _handleResult(isOk, error);
    },

    /**
     * Checks if the specified argument is a valid function.
     *
     * @param {*} arg The argument to check
     * @param {module:argValidator.Error} [error=undefined] The error to be
     *        thrown if validation fails.
     *
     * @return {Boolean} True if the string is valid, false otherwise.
     * @throws {ArgError|Error} Thrown if validation fails, and the input error
     *         is not undefined.
     */
    checkFunction: function(arg, error) {
        const isOk = typeof arg === 'function';
        return _handleResult(isOk, error);
    },

    /**
     * Checks if the specified argument is an instance of a particular type.
     *
     * @param {*} arg The argument to check
     * @param {Function} type The expected type of the argument
     * @param {module:argValidator.Error} [error=undefined] The error to be
     *        thrown if validation fails.
     *
     * @return {Boolean} True if the string is valid, false otherwise.
     * @throws {ArgError|Error} Thrown if validation fails, and the input error
     *         is not undefined.
     */
    checkInstance: function(arg, type, error) {
        const isOk = typeof type === 'function' && arg instanceof type;
        return _handleResult(isOk, error);
    }
};
