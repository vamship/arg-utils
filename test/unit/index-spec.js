'use strict';

const _chai = require('chai');
_chai.use(require('sinon-chai'));
_chai.use(require('chai-as-promised'));
const expect = _chai.expect;
const _rewire = require('rewire');

let _index = null;
const _schemaHelper = require('../../src/schema-helper');
const _argValidator = require('../../src/arg-validator');

describe('index', function() {
    beforeEach(() => {
        _index = _rewire('../../src/index');
    });

    it('should implement methods required by the interface', function() {
        expect(_index.schemaHelper).to.equal(_schemaHelper);
        expect(_index.argValidator).to.equal(_argValidator);
    });
});
