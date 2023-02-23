import assert from 'node:assert/strict';
import path from 'node:path';

import ColorLogger from './ColorLogger.js';

export default class Validator {
    // static #type = Object.freeze({
    //     string: `[object String]`,
    //     integer: `[object Number]`,
    //     float: `[object Number]`,
    //     boolean: `[object Boolean]`,
    //     array: `[object Array]`,
    //     object: `[object Object]`,
    //     function: `[object Function]`,
    //     null: `[object Null]`,
    //     undefined: `[object Undefined]`
    // });

    static #error = Object.freeze({
        validateConfig: {
            configType:         `The config settings is not an object.`,
            configValue:        `The config settinngs is empty and it should not be empty.`,
            destinationMissing: `The attribute 'destination' is missing in the config settings.`,
            destinationType:    `The value of the attribute 'destination' does not contain a string in the config settings.`,
            sourceMissing:      `The attribute 'source' is missing in the config settings.`,
            sourceType:         `The value of the attribute 'source' does not contain a string in the config settings.`
        }
    });

    /**
     * Check if the ESDoc config is suitable and well formed
     *
     * @static
     * @param {ESDocConfig} config - The ESDoc config object
     * @memberof Validator
     */
    static validateConfig(config) {
        // Checks if the config settings is an object
        if (!this.#isObject(config)) throw new Error(this.#error.validateConfig.configType);

        // Checks if the config settings is an empty object
        if (this.#isEmpty(config)) throw new Error(this.#error.validateConfig.configValue);

        // Checks if the config settings has a 'source' attribute
        if (!Object.hasOwn(config, `source`)) throw new Error(this.#error.validateConfig.sourceMissing);

        // Checks if the value of the 'source' attribute in the config settings is not a string
        if (!this.#isString(config.source)) throw new Error(this.#error.validateConfig.sourceType);

        // Checks if the config settings has a 'destination' attribute
        if (!Object.hasOwn(config, `destination`)) throw new Error(this.#error.validateConfig.destinationMissing);

        // Checks if the value of the 'destination' attribute in the config settings is not a string
        if (!this.#isString(config.destination)) throw new Error(this.#error.validateConfig.destinationType);

        console.log(config);

        // let exit = false;

        // const keys = [[`access`, `esdoc-standard-plugin`], [`autoPrivate`, `esdoc-standard-plugin`], [`unexportedIdentifier`, `esdoc-standard-plugin`], [`undocumentIdentifier`, `esdoc-standard-plugin`], [`builtinExternal`, `esdoc-standard-plugin`], [`coverage`, `esdoc-standard-plugin`], [`test`, `esdoc-standard-plugin`], [`title`, `esdoc-standard-plugin`], [`manual`, `esdoc-standard-plugin`], [`lint`, `esdoc-standard-plugin`], [`includeSource`, `esdoc-exclude-source-plugin`], [`styles`, `esdoc-inject-style-plugin`], [`scripts`, `esdoc-inject-script-plugin`], [`experimentalProposal`, `esdoc-ecmascript-proposal-plugin`]];

        // for (const [key, plugin] of keys) {
        //     if (key in config) {
        //         console.log(`[31merror: config.${key} is invalid. Please use ${plugin}. how to migration: https://esdoc.org/manual/migration.html[0m`);
        //         exit = true;
        //     }
        // }

        // if (exit) process.exit(1);
    }

    static #getType(value) {
        const result = {}.toString.call(value);
        return result.slice(result.indexOf(` `) + 1, -1);
    }

    static #isString(value) { return this.#getType(value) === `String` }

    static #isNumber(value) { return this.#getType(value) === `Number`; }

    static #isBoolean(value) { return this.#getType(value) === `Boolean`; }

    static #isArray(value) { return this.#getType(value) === `Array`; }

    static #isObject(value) { return this.#getType(value) === `Object`; }

    static #isFunction(value) { return this.#getType(value) === `Function`; }

    static #isEmpty(value) { 
        return value === `` || value === 0 || value === [] || value === {} || value === null || value === undefined;
    }
}
