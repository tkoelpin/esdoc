import assert from 'node:assert/strict';
// import { describe, it } from 'mocha';
import Validator from '../../src/Util/Validator.js';

const test = {
    0: [],
    1: {},
    2: {source: 55},
    3: {source: ``},
    4: {source: `src`},
};

describe(`Validate JSON config file:`, () => {
    describe(`JSON config file contains ${JSON.stringify(test[0])}:`, () => {
        try {
            Validator.validateConfig(test[0]);
        } catch (err) {
            it(`Throws an {TypeError}.`, () => {
                assert.strictEqual(Validator.getType(err), `TypeError`);
            });

            it(`Error message is: "The variable config has a type of {Array}, but {Object} expected."`, () => {
                const msg = `The variable config has a type of {Array}, but {Object} expected.`;
                assert.strictEqual(err.message, msg);
            });
        }
    });

    describe(`JSON config file contains ${JSON.stringify(test[1])}:`, () => {
        try {
            Validator.validateConfig(test[1]);
        } catch (err) {
            it(`Throws an {Error}.`, () => {
                assert.strictEqual(Validator.getType(err), `Error`);
            });

            it(`Error message is: "The variable 'config' is empty and should not be empty."`, () => {
                const msg = `The variable 'config' is empty and should not be empty.`;
                assert.strictEqual(err.message, msg);
            });
        }
    });

    describe(`JSON config file contains ${JSON.stringify(test[2])}:`, () => {
        try {
            Validator.validateConfig(test[2]);
        } catch (err) {
            it(`Throws an {TypeError}.`, () => {
                assert.strictEqual(Validator.getType(err), `TypeError`);
            });

            it(`Error message is: "The variable config.source has a type of {Number}, but {String} expected."`, () => {
                const msg = `The variable config.source has a type of {Number}, but {String} expected.`;
                assert.strictEqual(err.message, msg);
            });
        }
    });

    // describe(`JSON config file contains ${JSON.stringify(test[3])}:`, () => {
    //     try {
    //         Validator.validateConfig(test[3]);
    //     } catch (err) {
    //         console.log(Validator.getType(err));
    //         console.log(err.message);
    //         // it(`Throws an {TypeError}.`, () => {
    //         //     assert.strictEqual(Validator.getType(err), `TypeError`);
    //         // });

    //         // it(`Error message is: "The variable config.source has a type of {Number}, but {String} expected."`, () => {
    //         //     const msg = `The variable config.source has a type of {Number}, but {String} expected.`;
    //         //     assert.strictEqual(err.message, msg);
    //         // });
    //     }
    // });

    // describe(`JSON config file contains ${JSON.stringify(test[4])}:`, () => {
    //     try {
    //         Validator.validateConfig(test[4]);
    //     } catch (err) {
    //         console.log(Validator.getType(err));
    //         console.log(err.message);
    //         // it(`Throws an {TypeError}.`, () => {
    //         //     assert.strictEqual(Validator.getType(err), `TypeError`);
    //         // });

    //         // it(`Error message is: "The variable config.source has a type of {Number}, but {String} expected."`, () => {
    //         //     const msg = `The variable config.source has a type of {Number}, but {String} expected.`;
    //         //     assert.strictEqual(err.message, msg);
    //         // });
    //     }
    // });
});