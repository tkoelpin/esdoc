import assert from 'node:assert/strict';
import path from 'node:path';
import util from 'node:util';

import T from './Template.js';
import ColorLogger from './ColorLogger.js';

String.prototype.format = () => {
    return [...arguments].reduce((p,c) => p.replace(/%s/,c), this);
};

export default class Validator {
    static #error = Object.freeze({
        common: {
            emptyValue:  T.build `The variable '{1}' is empty and it should not be empty.`,
            invalidType: T.build `The variable '{0}' has a type of {'{1}'}, but {'{2}'} expected.`,
             missingKey:  T.build `The object '{0}' needs the key '{1}' for further proceedings. Please fix it!`
        },
        validateConfig: {
            configType:         `The config settings is not an object.`,
            configValue:        `The config settinngs is empty and it should not be empty.`,
            destinationMissing: `The attribute 'destination' is missing in the config settings.`,
            destinationType:    `The value of the attribute 'destination' does not contain a string in the config settings.`,
            excludeType1:       `The %s array value of the attribute 'excludes' does not contain a string in the config settings.`,
            excludeType2:       `The value of the attribute 'excludes[%d]' does not contain a string in the config settings.`,
            includeType1:       `The %s array value of the attribute 'includes' does not contain a string in the config settings.`,
            includeType2:       `The value of the attribute 'includes[%d]' does not contain a string in the config settings.`,
            indexType:          `The value of the attribute 'index' does not contain a string in the config settings.`,
            packageType:        `The value of the attribute 'package' does not contain a string in the config settings.`,
            sourceEmpty:        `The value of the attribute 'source' does not contain a string in the config settings.`,
            sourceMissing:      `The attribute 'source' is missing in the config settings.`,
            sourceType:         `The value of the attribute 'source' does not contain a string in the config settings.`,
        }
    });

    static #regEx = Object.freeze({
        ordinals: {
            first:  /(?:^1$|[02-9]1$)/u,
            second: /(?:^2$|[02-9]2$)/u,
            third:  /(?:^3$|[02-9]3$)/u
        }
    })

    /**
     * Check if the ESDoc config is suitable and well formed
     *
     * @static
     * @param {ESDocConfig} config - The ESDoc config object
     * @memberof Validator
     */
    static validateConfig(config) {
        // Checks if the config settings is not an object
        if (!this.#isObject(config)) throw new Error(this.#error.common.invalidType(`config`, this.#getType(config), `Object`));

        // Checks if the config settings is an empty object
        if (this.#isEmpty(config)) throw new Error(this.#error.validateConfig.configValue);

        // Checks if the config settings has not a 'source' attribute
        if (!Object.hasOwn(config, `source`)) throw new Error(this.#error.validateConfig.sourceMissing);

        // Checks if the value of the 'source' attribute in the config settings is not a string
        if (!this.#isString(config.source)) throw new Error(this.#error.validateConfig.sourceType);

        // Checks if the config settings has not a 'destination' attribute
        if (!Object.hasOwn(config, `destination`)) throw new Error(this.#error.validateConfig.destinationMissing);

        // Checks if the value of the 'destination' attribute in the config settings is not a string
        if (!this.#isString(config.destination)) throw new Error(this.#error.validateConfig.destinationType);

        // Checks if the config settings has a 'includes' attribute
        if (Object.hasOwn(config, `includes`)) {
            // Checks if the value of the 'includes' attribute in the config settings is not an array
            if (!this.#isArray(config.includes)) throw new Error(this.#error.validateConfig.includesType);

            // Checks if the array of the 'includes' attribute in the config settings is not empty
            if (!this.#isEmpty(config.includes)) {
                const includeErrors = [];

                config.includes.forEach((value, key) => {
                    const ext = this.#getOrdinals(key + 1);
                    if (!this.#isString(value)) {
                        // includeErrors.push(util.format(this.#error.validateConfig.includeType1, ext));
                        console.log(util.format(this.#error.validateConfig.includeType1, ext));
                        console.log(util.format(this.#error.validateConfig.includeType2, key));
                    }
                });

                if (includeErrors.length > 0) throw new Error(includeErrors.join(`\n`));
            }
        }

        // Checks if the config settings has a 'excludes' attribute
        if (Object.hasOwn(config, `excludes`)) {
            // Checks if the value of the 'excludes' attribute in the config settings is not an array
            if (!this.#isArray(config.excludes)) {
                throw new Error(this.#error.common.invalidType(`config.excludes`, this.#getType(config.excludes), `Array`));
            }

            // Checks if the array of the 'excludes' attribute in the config settings is not empty
            if (!this.#isEmpty(config.excludes)) {
                const excludeErrors = [];

                config.excludes.forEach((value, key) => {
                    const ext = this.#getOrdinals(key + 1);
                    if (!this.#isString(value)) {
                        // excludeErrors.push(util.format(this.#error.validateConfig.excludeType, ext));
                        console.log(util.format(this.#error.validateConfig.excludeType, ext));
                        console.log(util.format(this.#error.validateConfig.excludeType, key));
                    }

                    if (this.#isEmpty(value)) console.log(util.format(this.#error.validateConfig.excludeType, key));
                });

                if (excludeErrors.length > 0) throw new Error(excludeErrors.join(`\n`));
            }
        }

        // Checks if the config settings has a 'excludes' attribute
        if (Object.hasOwn(config, `index`)) {
            // Checks if the value of the 'index' attribute in the config settings is not a string
            if (!this.#isString(config.index)) throw new Error(this.#error.validateConfig.indexType);
        }

        // Checks if the config settings has a 'excludes' attribute
        if (Object.hasOwn(config, `package`)) {
            // Checks if the value of the 'package' attribute in the config settings is not a string
            if (!this.#isString(config[`package`])) throw new Error(this.#error.validateConfig.packageType);
        }

        // console.log(config);

        // if (!config.includes) config.includes = [`\\.js$`];
        // if (!config.excludes) config.excludes = [`\\.config\\.js$`, `\\.test\\.js$`];

        // if (!config.index) config.index = `./README.md`;
        // if (!config[`package`]) config[`package`] = `./package.json`;
        // if (!(`outputAST` in config)) config.outputAST = true;

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

    static #getOrdinals(number) {
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

    static #getType(obj) {
        const typeString = {}.toString.call(obj);
        const type = typeString.slice(typeString.indexOf(` `) + 1, -1);

        if (type !== `Object`) return type;

        const {name} = obj.constructor;

        if (name !== undefined) return name;
        return type;
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
