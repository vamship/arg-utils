import { expect, use as _useWithChai } from 'chai';
import _sinonChai from 'sinon-chai';
import _chaiAsPromised from 'chai-as-promised';
import 'mocha';

_useWithChai(_sinonChai);
_useWithChai(_chaiAsPromised);

import * as _schemaHelper from '../../src/schema-helper.js';
import * as _argValidator from '../../src/arg-validator.js';
import * as _index from '../../src/index.js';

describe('index', function () {
    it('should implement methods required by the interface', function () {
        expect(_index.schemaHelper).to.equal(_schemaHelper);
        expect(_index.argValidator).to.equal(_argValidator);
    });
});
