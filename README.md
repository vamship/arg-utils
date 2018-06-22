# Arg Utils

Utility library for argument validations. Provides modules for function
argument validations and JSON schema validations. Function argument checks are
important in loosely typed languages such as javascript, and a good development
practice is to explicitly check each function argument prior to using it, like
this:

```
function sayHello(name, lang) {
    if(typeof name !== 'string' || name.length <= 0) {
        throw new Error('Invalid name argument (arg #1)');
    }
    if(typeof lang !== 'string' || lang.length <= 0) {
        lang = 'english';
    }
}
```

In other situations (ex: AWS Lambda functions), the function may accept a
simple object as an input, but expect that the object conforms to a specific
schema.

This library makes it syntactically nicer to perform such checks, by providing
utility methods for both argument checks and schema validation.

## API Documentation

API documentation can be found [here](https://vamship.github.io/arg-utils).

## Installation

This library can be installed via npm using:

```
npm install @vamship/arg-utils
```

## Usage

This libary exports two modules:

*   **schemaHelper**: Generates a schema validator function based on a schema
    object. This function can then be used to validate inputs against this
    schema.
*   **argValidator**: Provides basic argument validation functionality for
    function input validation.

## Release Notes

### V2.0.0

This version introduces breaking changes in order to find a better balance
between "syntactic niceness" and performance. V1.x allowed error checks and
default settings to be applied by allowing chained function calls, for example:

```
    _argValidator.checkString(someArg).throw('some error');
```

While one could argue that this made the code more readable, quick performance
tests showed that these checks were multiple orders of magnitude slower than
simple error checks using `if-then-else` statements. The fact that they are
slower was expected, but how much slower they really were was a surprise.

Version 2.0.0 changes the validator signatures to accept the error message as
a part of the check function, and throws immediately, like this:

```
    _argValidator.checkString(someArg, 1, 'some error'); // Throws an error.

    _argValidator.checkString(someArg, 1); // Does not throw, returns false.
```

## Examples

## Argument Validation

```
const _argValidator = require('@vamship/arg-validator').argValidator;

...

function sayHello(name, lang) {
    _argValidator.checkString(name, 1, 'Invalid name (arg #1)');
    if(!_argValidator.checkString(lang, 1)){
        lang = 'english';
    }
}
```

### Schema Validation

```
const _schemaHelper = require('@vamship/arg-validator').schemaHelper;
const schema = require('<path to json schema>');
const checkSchema = _schemaHelper.createSchemaChecker(schema);

...

function processInput(input) {
    checkSchema(input, true) // Throws a schema error
}

...

function processInput(input) {
    if(!checkSchema(input)) { // Does not throw an error, but returns false

        // Perform some actions on schema validation failure
    }
}
```
