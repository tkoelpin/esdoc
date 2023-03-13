import assert from 'node:assert/strict';
import path from 'node:path';
import util from 'node:util';

import T from './Template.js';
import ColorLogger from './ColorLogger.js';

export default class Validator {
    static #regEx = Object.freeze({
        ordinals: {
            first:  /(?:^1$|[02-9]1$)/u,
            second: /(?:^2$|[02-9]2$)/u,
            third:  /(?:^3$|[02-9]3$)/u
        }
    });

    static #error = Object.freeze({
        emptyValue:  T.build `The variable '${0}' is empty and should not be empty.`,
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

    /**
     * Check if the ESDoc config is suitable and well formed
     *
     * @static
     * @param {ESDocConfig} config - The ESDoc config object
     * @memberof Validator
     */
    static validateConfig(config) {
        this.#requiredConfig(config);
        this.#optionalConfig(config);
        this.#pluginConfig(config);
    }

    static #requiredConfig(config) {
        // Checks if the config settings is not an object
        if (!this.isObject(config)) {
            const msg = this.#error.invalidType(`config`, this.getType(config), `Object`);
            throw new TypeError(msg);
        }

        // Checks if the config settings is an empty object
        console.log(this.isEmpty(config));
        if (this.isEmpty(config)) {
            console.log(`Yep, I'm empty.`);
            const msg = this.#error.emptyValue(`config`);
            throw new Error(msg);
        }

        // Checks if the config settings has not a 'source' attribute
        if (!Object.hasOwn(config, `source`)) {
            const msg = this.#error.missingKey(`config`, `source`);
            throw new Error(msg);
        }

        // Checks if the value of the 'source' attribute in the config settings is not a string
        if (!this.isString(config.source)) {
            const msg = this.#error.invalidType(`config.source`, this.getType(config.source), `String`);
            throw new TypeError(msg);
        }

        // Checks if the value of the 'source' attribute in the config settings is not empty
        if (this.isEmpty(config)) {
            const msg = this.#error.emptyValue(`config.source`);
            throw new Error(msg);
        }

        // Checks if the config settings has not a 'destination' attribute
        if (!Object.hasOwn(config, `destination`)) {
            const msg = this.#error.missingKey(`config`, `destination`);
            throw new Error(msg);
        }

        // Checks if the value of the 'destination' attribute in the config settings is not a string
        if (!this.isString(config.destination)) {
            const msg = this.#error.invalidType(`config.destination`, this.getType(config.destination), `String`);
            throw new TypeError(msg);
        }

        // Checks if the value of the 'destination' attribute in the config settings is not empty
        if (this.isEmpty(config.destination)) {
            const msg = this.#error.emptyValue(`config.destination`);
            throw new Error(msg);
        }
    }

    static #optionalConfig(config) {
        // Checks if the config settings has a 'includes' attribute
        if (Object.hasOwn(config, `includes`)) {
            // Checks if the value of the 'includes' attribute in the config settings is not an array
            if (!this.isArray(config.includes)) {
                const msg = this.#error.invalidType(`config.includes`, this.getType(config.includes), `Array`);
                throw new TypeError(msg);
            }

            // Checks if the array of the 'includes' attribute in the config settings is not empty
            if (!this.isEmpty(config.includes)) {
                const includeErrors = [];

                config.includes.forEach((value, key) => {
                    const ext = this.#getOrdinals(key + 1);
                    if (!this.isString(value)) {
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
            if (!this.isArray(config.excludes)) {
                const msg = this.#error.invalidType(`config.excludes`, this.getType(config.excludes), `Array`);
                throw new TypeError(msg);
            }

            // Checks if the array of the 'excludes' attribute in the config settings is not empty
            if (!this.isEmpty(config.excludes)) {
                const excludeErrors = [];

                config.excludes.forEach((value, key) => {
                    const ext = this.#getOrdinals(key + 1);
                    if (!this.isString(value)) {
                        // excludeErrors.push(util.format(this.#error.validateConfig.excludeType, ext));
                        console.log(util.format(this.#error.validateConfig.excludeType, ext));
                        console.log(util.format(this.#error.validateConfig.excludeType, key));
                    }

                    if (this.isEmpty(value)) console.log(util.format(this.#error.validateConfig.excludeType, key));
                });

                if (excludeErrors.length > 0) throw new Error(excludeErrors.join(`\n`));
            }
        }

        // Checks if the config settings has a 'excludes' attribute
        if (Object.hasOwn(config, `index`)) {
            // Checks if the value of the 'index' attribute in the config settings is not a string
            if (!this.isString(config.index)) {
                const msg = this.#error.invalidType(`config.index`, this.getType(config.index), `String`);
                throw new TypeError(msg);
            }

            // Checks if the value of the 'index' attribute in the config settings is not empty
            if (this.isEmpty(config.index)) {
                const msg = this.#error.emptyValue(`config.index`);
                throw new Error(msg);
            }
        }

        // Checks if the config settings has a 'excludes' attribute
        if (Object.hasOwn(config, `package`)) {
            // Checks if the value of the 'package' attribute in the config settings is not a string
            if (!this.isString(config[`package`])) {
                const msg = this.#error.invalidType(`config.package`, this.getType(config[`package`]), `String`);
                throw new TypeError(msg);
            }

            // Checks if the value of the 'index' attribute in the config settings is not empty
            if (this.isEmpty(config[`package`])) {
                const msg = this.#error.emptyValue(`config.package`);
                throw new Error(msg);
            }
        }

        if (Object.hasOwn(config, `outputAST`)) {
            // Checks if the value of the 'outputAST' attribute in the config settings is not a boolean
            if (!this.isBoolean(config.outputAST)) {
                const msg = this.#error.invalidType(`config.outputAST`, this.getType(config.outputAST), `String`);
                throw new TypeError(msg);
            }
        }
    }

    static #pluginConfig(config) {
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
}
