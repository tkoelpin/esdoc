// import assert from 'node:assert/strict';
// import path from 'node:path';
// import util from 'node:util';

import T from '../Util/Template.js';
import ColorLogger from '../Util/ColorLogger.js';

export default class CommonValidation {
    static #regEx = Object.freeze({
        ordinals: {
            first:  /(?:^1$|[02-9]1$)/u,
            second: /(?:^2$|[02-9]2$)/u,
            third:  /(?:^3$|[02-9]3$)/u
        }
    });

    static error = Object.freeze({
        emptyValue:  T.build `The variable '${0}' is empty and should not be empty.`,
        invalidKey:  T.build `The keys of the object '${0}' are invalid: ${1}. Please remove or disable it for further proceedings!`,
        invalidType: T.build `The variable ${0} has a type of {${1}}, but {${2}} expected.`,
        missingKey:  T.build `The object '${0}' needs the key '${1}' for further proceedings. Please fix it!`
        // validateConfig: {
        //     configType:         `The config settings is not an object.`,
        //     configValue:        `The config settinngs is empty and it should not be empty.`,
        //     destinationMissing: `The attribute 'destination' is missing in the config settings.`,
        //     destinationType:    `The value of the attribute 'destination' does not contain a string in the config settings.`,
        //     excludeType1:       `The %s array value of the attribute 'excludes' does not contain a string in the config settings.`,
        //     excludeType2:       `The value of the attribute 'excludes[%d]' does not contain a string in the config settings.`,
        //     includeType1:       `The %s array value of the attribute 'includes' does not contain a string in the config settings.`,
        //     includeType2:       `The value of the attribute 'includes[%d]' does not contain a string in the config settings.`,
        //     indexType:          `The value of the attribute 'index' does not contain a string in the config settings.`,
        //     packageType:        `The value of the attribute 'package' does not contain a string in the config settings.`,
        //     sourceEmpty:        `The value of the attribute 'source' does not contain a string in the config settings.`,
        //     sourceMissing:      `The attribute 'source' is missing in the config settings.`,
        //     sourceType:         `The value of the attribute 'source' does not contain a string in the config settings.`,
        // }
    });

    static getOrdinal(number) {
        const num = number.toString();
        let ext;

        switch (true) {
            case this.#regEx.ordinals.first.test(num):
                ext = `st`;
                break;
            case this.#regEx.ordinals.second.test(num):
                ext = `nd`;
                break;
            case this.#regEx.ordinals.third.test(num):
                ext = `rd`;
                break;
            default:
                ext = `th`;
        }

        return `${number}${ext}`;
    }

    static getType(obj) {
        const typeString = {}.toString.call(obj);
        const type = typeString.slice(typeString.indexOf(` `) + 1, -1);

        if (type !== `Object` && type !== `Error`) return type;

        const {name} = obj.constructor;

        if (name !== undefined) return name;
        return type;
    }

    static isString(value) { return this.getType(value) === `String` }

    static isNumber(value) { return this.getType(value) === `Number`; }

    static isBoolean(value) { return this.getType(value) === `Boolean`; }

    static isArray(value) { return this.getType(value) === `Array`; }

    static isObject(value) { return this.getType(value) === `Object`; }

    static isFunction(value) { return this.getType(value) === `Function`; }

    static isEmpty(value) {
        if (this.isArray(value)) return JSON.stringify(value) === `[]`;
        if (this.isObject(value)) return JSON.stringify(value) === `{}`;

        return value === `` || value === 0 || value === null || value === undefined;
    }

    static hasValidKeys(obj, allowedKeys) {
        const invalidKeys = Object.keys(obj).filter(key => !allowedKeys.includes(key));
        return invalidKeys.length === 0;
    }

    static getInvalidKeys(obj, allowedKeys) {
        return Object.keys(obj).filter(key => !allowedKeys.includes(key));
    }
}
