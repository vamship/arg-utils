import { ArgError } from '@vamship/error-types';

/**
 * Reusable method that handles the result of a validation check, and performs
 * the necessary actions.
 *
 * @private
 * @param isValid Determines if the validation check was successful.
 * @param [error] The error to throw if the validation failed.
 *
 * @return True if the validation was successful, false otherwise.
 * @throws {ArgError|Error} Thrown if validation fails, and the input error is
 *         not undefined.
 */
function _handleResult(
    isValid: boolean,
    error: string | Error | undefined = undefined,
): boolean {
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
 * The error to be thrown if validation fails. If the value is a string, an
 * ArgError will be thrown with the string as the message. If the value is
 * an Error, the error object will be thrown.
 *
 * @typedef {String|Error} module:argValidator.Error
 */
/**
 * Checks if the specified argument is a valid string.
 *
 * @param arg The argument to check
 * @param [minLength=1] The expected minimum length of the string.
 * @param [error=undefined] The error to be
 *        thrown if validation fails.
 *
 * @return True if the string is valid, false otherwise.
 * @throws {ArgError|Error} Thrown if validation fails, and the input error
 *         is not undefined.
 */
export function checkString(
    arg: string | undefined,
    minLength: number = 1,
    error: string | Error | undefined = undefined,
): boolean {
    if (typeof minLength !== 'number' || minLength < 0) {
        minLength = 1;
    }
    const isOk = typeof arg === 'string' && arg.length >= minLength;
    return _handleResult(isOk, error);
}

/**
 * Checks if the specified argument is present amongst the list of possible
 * values.
 *
 * @param The argument to check
 * @param values A list of allowed values that the argument must belong to.
 * @param [error=undefined] The error to be thrown if validation fails.
 *
 * @return True if the string is valid, false otherwise.
 * @throws {ArgError|Error} Thrown if validation fails, and the input error
 *         is not undefined.
 */
export function checkEnum(
    arg: string | number | undefined,
    values: Array<string | number | undefined>,
    error: string | Error | undefined = undefined,
): boolean {
    const isOk = values instanceof Array && values.indexOf(arg) >= 0;
    return _handleResult(isOk, error);
}

/**
 * Checks if the specified argument is a valid number.
 *
 * @param arg The argument to check
 * @param [min=1] The expected minimum value of the number.
 * @param [error=undefined] The error to be thrown if validation fails.
 *
 * @return True if the string is valid, false otherwise.
 * @throws {ArgError|Error} Thrown if validation fails, and the input error
 *         is not undefined.
 */
export function checkNumber(
    arg: number | undefined,
    min: number | undefined,
    error: string | Error | undefined = undefined,
): boolean {
    if (typeof min !== 'number') {
        min = 1;
    }
    const isOk = typeof arg === 'number' && arg >= min;
    return _handleResult(isOk, error);
}

/**
 * Checks if the specified argument is a valid object.
 *
 * @param arg The argument to check
 * @param [error=undefined] The error to be thrown if validation fails.
 *
 * @return True if the string is valid, false otherwise.
 * @throws {ArgError|Error} Thrown if validation fails, and the input error
 *         is not undefined.
 */
export function checkObject(
    arg: Object | undefined,
    error: string | Error | undefined = undefined,
): boolean {
    const isOk = !!arg && !(arg instanceof Array) && typeof arg === 'object';
    return _handleResult(isOk, error);
}

/**
 * Checks if the specified argument is a valid array.
 *
 * @param arg The argument to check
 * @param [error=undefined] The error to be thrown if validation fails.
 *
 * @return True if the string is valid, false otherwise.
 * @throws {ArgError|Error} Thrown if validation fails, and the input error
 *         is not undefined.
 * @typeparam T The type of the array elements.
 */
export function checkArray<T>(
    arg: Array<T>,
    error: string | Error | undefined = undefined,
): boolean {
    const isOk = arg instanceof Array;
    return _handleResult(isOk, error);
}

/**
 * Checks if the specified argument is a valid boolean.
 *
 * @param arg The argument to check
 * @param [error=undefined] The error to be thrown if validation fails.
 *
 * @return True if the string is valid, false otherwise.
 * @throws {ArgError|Error} Thrown if validation fails, and the input error
 *         is not undefined.
 */
export function checkBoolean(
    arg: boolean,
    error: string | Error | undefined = undefined,
): boolean {
    const isOk = typeof arg === 'boolean';
    return _handleResult(isOk, error);
}

/**
 * Checks if the specified argument is a valid function.
 *
 * @param arg The argument to check
 * @param [error=undefined] The error to be thrown if validation fails.
 *
 * @return True if the string is valid, false otherwise.
 * @throws {ArgError|Error} Thrown if validation fails, and the input error
 *         is not undefined.
 */
export function checkFunction<T>(
    arg: T,
    error: string | Error | undefined = undefined,
): boolean {
    const isOk = typeof arg === 'function';
    return _handleResult(isOk, error);
}

/**
 * Checks if the specified argument is an instance of a particular type.
 *
 * @param arg The argument to check
 * @param type The expected type of the argument
 * @param [error=undefined] The error to be
 *        thrown if validation fails.
 *
 * @return True if the string is valid, false otherwise.
 * @throws {ArgError|Error} Thrown if validation fails, and the input error
 *         is not undefined.
 */
export function checkInstance<T>(
    arg: T,
    type: T,
    error: string | Error | undefined = undefined,
): boolean {
    const isOk = typeof type === 'function' && arg instanceof type;
    return _handleResult(isOk, error);
}
