'use strict';

const ArgCheckResult = require('./arg-check-result');

/**
 * @module argValidator
 */
module.exports = {
    /**
     * Checks if the specified argument is a valid string.
     *
     * @param {*} arg The argument to check
     * @param {Number} [minLength=1] The expected minimum length of the string.
     *
     * @return {ArgCheckResult} An object that encapsulates the results of the
     *         argument validation check, and provides
     */
    checkString: function(arg, minLength) {
        if (typeof minLength !== 'number' || minLength < 0) {
            minLength = 1;
        }
        const ok = typeof arg === 'string' && arg.length >= minLength;
        return new ArgCheckResult(!ok);
    },

    /**
     * Checks if the specified argument is present amongst the list of possible
     * values.
     *
     * @param {*} arg The argument to check
     * @param {Array} values A list of allowed values that the argument must
     *        belong to.
     *
     * @return {ArgCheckResult} An object that encapsulates the results of the
     *         argument validation check, and provides
     */
    checkEnum: function(arg, values) {
        const ok = values instanceof Array && values.indexOf(arg) >= 0;
        return new ArgCheckResult(!ok);
    },

    /**
     * Checks if the specified argument is a valid number.
     *
     * @param {*} arg The argument to check
     * @param {Number} [min=1] The expected minimum value of the number.
     *
     * @return {ArgCheckResult} An object that encapsulates the results of the
     *         argument validation check, and provides
     */
    checkNumber: function(arg, min) {
        if (typeof min !== 'number') {
            min = 1;
        }
        const ok = typeof arg === 'number' && arg >= min;
        return new ArgCheckResult(!ok);
    },

    /**
     * Checks if the specified argument is a valid object.
     *
     * @param {*} arg The argument to check
     *
     * @return {ArgCheckResult} An object that encapsulates the results of the
     *         argument validation check, and provides
     */
    checkObject: function(arg) {
        const ok = arg && !(arg instanceof Array) && typeof arg === 'object';
        return new ArgCheckResult(!ok);
    },

    /**
     * Checks if the specified argument is a valid array.
     *
     * @param {*} arg The argument to check
     *
     * @return {ArgCheckResult} An object that encapsulates the results of the
     *         argument validation check, and provides
     */
    checkArray: function(arg) {
        const ok = arg instanceof Array;
        return new ArgCheckResult(!ok);
    },

    /**
     * Checks if the specified argument is a valid boolean.
     *
     * @param {*} arg The argument to check
     *
     * @return {ArgCheckResult} An object that encapsulates the results of the
     *         argument validation check, and provides
     */
    checkBoolean: function(arg) {
        const ok = typeof arg === 'boolean';
        return new ArgCheckResult(!ok);
    },

    /**
     * Checks if the specified argument is a valid function.
     *
     * @param {*} arg The argument to check
     *
     * @return {ArgCheckResult} An object that encapsulates the results of the
     *         argument validation check, and provides
     */
    checkFunction: function(arg) {
        const ok = typeof arg === 'function';
        return new ArgCheckResult(!ok);
    },

    /**
     * Checks if the specified argument is an instance of a particular type.
     *
     * @param {*} arg The argument to check
     * @param {Function} type The expected type of the argument
     *
     * @return {ArgCheckResult} An object that encapsulates the results of the
     *         argument validation check, and provides
     */
    checkInstance: function(arg, type) {
        const ok = typeof type === 'function' && arg instanceof type;
        return new ArgCheckResult(!ok);
    }
};
