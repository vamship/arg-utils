'use strict';

const Ajv = require('ajv');
const { SchemaError, ArgError } = require('@vamship/error-types').args;

/**
 * Utility library for performing JSON schema validations.
 *
 * @module schemaHelper
 */
module.exports = {
    /**
     * A function that can be used to check if the schema on a specific object
     * is valid.
     *
     * @typedef {Function} SchemaChecker
     * @param {Object} target The object to perform schema validation against.
     * @param {Boolean} [throwError=false] If set to true, will throw an error
     *        on schema validation failures.
     *
     * @return {Boolean} True if the validation was successful, false otherwise.
     * @throws {ArgError|Error} Thrown if validation fails, and if <b>throw</b>
     *         is set to true.
     */
    /**
     * Creates and returns a function that can be used to perform schema
     * validations.
     *
     * @param {Object} schema The schema to use when performing checks. This
     *        must be a valid JSON schema object.
     * @param {String} [errorMessage='Schema validation failed'] A custom error
     *        message to prepend to any errors generated by this method
     *
     * @return {module:schemaHelper~SchemaChecker} A validation function that
     *         accepts an input payload, and validates this against the schema.
     *         If validation succeeds, the method will return false. Otherwise
     *         an error will be thrown (SchemaError).
     */
    createSchemaChecker: function (schema, errorMessage) {
        if (!schema || schema instanceof Array || typeof schema !== 'object') {
            throw new ArgError('Invalid schema specified (arg #1)');
        }
        if (typeof errorMessage !== 'string') {
            errorMessage = 'Schema validation failed';
        }
        const validator = new Ajv().compile(schema);
        return (target, throwError) => {
            if (!validator(target)) {
                if (throwError) {
                    const { instancePath, message } = validator.errors[0];
                    throw new SchemaError(
                        `${errorMessage}. Details: [${
                            (instancePath || '<root>').replace(/\//g, '.')
                        }: ${message}]`
                    );
                }
                return false;
            }
            return true;
        };
    },
};
