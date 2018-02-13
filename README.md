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

## Installation

This library can be installed via npm using:

```
npm install @vamship/arg-utils
```

## Usage

This libary exports two modules:

* **schemaHelper**: Generates a schema validator function based on a schema object. This function can then be used to validate inputs against this schema.
* **argValidator**: Provides basic argument validation functionality for function input validation.

## Examples

## Argument Validation

```
const _argValidator = require('@vamship/arg-validator').argValidator;

...

function sayHello(name) {
    _argValidator.checkString(name)
        .throw('Invalid name argument (arg #1)');

    _argValidator.checkString(lang)
        .do(() => lang = 'english');
}
```

### Schema Validation

```
const _schemaHelper = require('@vamship/arg-validator').schemaHelper;
const schema = require('<path to json schema>');
const checkSchema = _schemaHelper.createSchemaChecker(schema);

...

function processInput(input) {
    checkSchema(input).throw();
}
```
