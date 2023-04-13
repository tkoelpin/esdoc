// import assert from 'node:assert/strict';
import {assert} from 'chai';
// import { describe, it } from 'mocha';
import CommonValidation from '../../../src/Validation/CommonValidation.js';

const suite = {
    ordinals: {
        1: `1st`, 2: `2nd`, 3: `3rd`, 4: `4th`, 11: `11th`, 12: `12th`, 13: `13th`, 21: `21st`, 22: `22nd`, 23: `23rd`,
        24: `24th`
    },
    types: {
        String: `\`text\``,
        Number: `22`,
        Boolean: `true`,
        Null: `null`,
        Array: `[]`,
        Object: `({debug: false})`,
        Set: `new Set()`,
        Undefined: `undefined`
    },
    isString: [
        {value: `\`\``, result: true},
        {value: `\`test\``, result: true},
        {value: `50`, result: false},
        {value: `false`, result: false},
    ],
    isNumber: [
        {value: `-30`, result: true},
        {value: `0`, result: true},
        {value: `10`, result: true},
        {value: `\`test\``, result: false},
        {value: `false`, result: false},
    ],
    isBoolean: [
        {value: `false`, result: true},
        {value: `true`, result: true},
        {value: `10`, result: false},
        {value: `\`test\``, result: false},
        {value: `[]`, result: false},
    ],
    isArray: [
        {value: `[]`, result: true},
        {value: `[{foo: false}, 30, true, \`test\`]`, result: true},
        {value: `true`, result: false},
        {value: `10`, result: false},
        {value: `\`test\``, result: false},
    ],
    isFunction: [
        {value: `Object.freeze`, result: true},
        {value: `Math.max`, result: true},
        {value: `[]`, result: false},
        {value: `true`, result: false},
        {value: `10`, result: false},
        {value: `\`test\``, result: false},
    ],
    isObject: [
        {value: `({})`, result: true},
        {value: `({foo: false})`, result: true},
        {value: `true`, result: false},
        {value: `10`, result: false},
        {value: `\`test\``, result: false},
    ],
    isEmpty: [
        {value: `[]`, result: true},
        {value: `[{foo: false}, 30, true, \`test\`]`, result: false},
        {value: `true`, result: false},
        {value: `false`, result: false},
        {value: `10`, result: false},
        {value: `0`, result: true},
        {value: `\`test\``, result: false},
        {value: `\`\``, result: true}
    ]
};

describe(`Testing the CommonValidation class:`, () => {
    describe(`Testing the getOrdinal() method:`, () => {
        Object.entries(suite.ordinals).forEach(([cardinal, ordinal]) => {
            it(`getOrdinal(${cardinal}) => ${ordinal}`, () => {
                assert.strictEqual(CommonValidation.getOrdinal(cardinal), ordinal);
            });
        });
    });

    describe(`Testing the getType() method:`, () => {
        Object.entries(suite.types).forEach(([type, object]) => {
            it(`getType(${object}) => ${type}`, () => {
                assert.strictEqual(CommonValidation.getType(eval(object)), type);
            });
        });
    });

    describe(`Testing the isString() method:`, () => {
        suite.isString.forEach(({value, result}) => {
            it(`isString(${value}) => ${result}`, () => {
                assert.strictEqual(CommonValidation.isString(eval(value)), result);
            });
        });
    });

    describe(`Testing the isNumber() method:`, () => {
        suite.isNumber.forEach(({value, result}) => {
            it(`isNumber(${value}) => ${result}`, () => {
                assert.strictEqual(CommonValidation.isNumber(eval(value)), result);
            });
        });
    });

    describe(`Testing the isBoolean() method:`, () => {
        suite.isBoolean.forEach(({value, result}) => {
            it(`isBoolean(${value}) => ${result}`, () => {
                assert.strictEqual(CommonValidation.isBoolean(eval(value)), result);
            });
        });
    });

    describe(`Testing the isArray() method:`, () => {
        suite.isArray.forEach(({value, result}) => {
            it(`isArray(${value}) => ${result}`, () => {
                assert.strictEqual(CommonValidation.isArray(eval(value)), result);
            });
        });
    });

    describe(`Testing the isFunction() method:`, () => {
        suite.isFunction.forEach(({value, result}) => {
            it(`isFunction(${value}) => ${result}`, () => {
                assert.strictEqual(CommonValidation.isFunction(eval(value)), result);
            });
        });
    });

    describe(`Testing the isObject() method:`, () => {
        suite.isObject.forEach(({value, result}) => {
            it(`isObject(${value}) => ${result}`, () => {
                assert.strictEqual(CommonValidation.isObject(eval(value)), result);
            });
        });
    });

    describe(`Testing the isEmpty() method:`, () => {
        suite.isEmpty.forEach(({value, result}) => {
            it(`isEmpty(${value}) => ${result}`, () => {
                assert.strictEqual(CommonValidation.isEmpty(eval(value)), result);
            });
        });
    });
});