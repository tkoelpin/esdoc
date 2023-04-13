// import assert from 'node:assert/strict';
// import path from 'node:path';
import util from 'node:util';

import CommonValidation from "./CommonValidation.js";

export default class ConfigValidaton {
    static #allowedKeys = {
        default: [`source`, `destination`, `includes`, `excludes`, `index`, `package`, `outputAST`, `plugins`],
        plugin:  [`name`, `option`]
    };

    /**
     * Check if the ESDoc config is suitable and well formed
     *
     * @static
     * @param {ESDocConfig} config - The ESDoc config object
     * @memberof Validator
     */
    static validate(config) {
        this.#requiredConfig(config);
        this.#optionalConfig(config);
        this.#pluginConfig(config);
    }

    static #requiredConfig(config) {
        // Checks if the config settings is not an object
        if (!CommonValidation.isObject(config)) {
            const msg = CommonValidation.error.invalidType(`config`, CommonValidation.getType(config), `Object`);
            throw new TypeError(msg);
        }

        // Checks if the config settings is an empty object
        if (CommonValidation.isEmpty(config)) {
            const msg = CommonValidation.error.emptyValue(`config`);
            throw new Error(msg);
        }

        // Checks if the config settings has invalid keys
        if (!CommonValidation.hasValidKeys(config, this.#allowedKeys[`default`])) {
            const invalidKeys = CommonValidation.getInvalidKeys(config, this.#allowedKeys[`default`]);
            const msg = CommonValidation.error.invalidKey(`config`, JSON.stringify(invalidKeys));
            throw new Error(msg);
        }

        // Checks if the config settings has not a 'source' attribute
        if (!Object.hasOwn(config, `source`)) {
            const msg = CommonValidation.error.missingKey(`config`, `source`);
            throw new Error(msg);
        }

        // Checks if the value of the 'source' attribute in the config settings is not a string
        if (!CommonValidation.isString(config.source)) {
            const msg = CommonValidation.error.invalidType(
                `config.source`,
                CommonValidation.getType(config.source),
                `String`
            );
            throw new TypeError(msg);
        }

        // Checks if the value of the 'source' attribute in the config settings is not empty
        if (CommonValidation.isEmpty(config.source)) {
            const msg = CommonValidation.error.emptyValue(`config.source`);
            throw new Error(msg);
        }

        // Checks if the config settings has not a 'destination' attribute
        if (!Object.hasOwn(config, `destination`)) {
            const msg = CommonValidation.error.missingKey(`config`, `destination`);
            throw new Error(msg);
        }

        // Checks if the value of the 'destination' attribute in the config settings is not a string
        if (!CommonValidation.isString(config.destination)) {
            const msg = CommonValidation.error.invalidType(
                `config.destination`,
                CommonValidation.getType(config.destination),
                `String`
            );
            throw new TypeError(msg);
        }

        // Checks if the value of the 'destination' attribute in the config settings is not empty
        if (CommonValidation.isEmpty(config.destination)) {
            const msg = CommonValidation.error.emptyValue(`config.destination`);
            throw new Error(msg);
        }
    }

    static #optionalConfig(config) {
        // Checks if the config settings has a 'includes' attribute
        if (Object.hasOwn(config, `includes`)) {
            // Checks if the value of the 'includes' attribute in the config settings is not an array
            if (!CommonValidation.isArray(config.includes)) {
                const msg = CommonValidation.error.invalidType(
                    `config.includes`,
                    CommonValidation.getType(config.includes),
                    `Array`
                );
                throw new TypeError(msg);
            }

            // Checks if the array of the 'includes' attribute in the config settings is not empty
            if (!CommonValidation.isEmpty(config.includes)) {
                const includeErrors = [];

                config.includes.forEach((value, key) => {
                    if (!CommonValidation.isString(value)) {
                        includeErrors.push(CommonValidation.error.invalidType(
                            `config.includes[${key}]`,
                            CommonValidation.getType(value),
                            `String`
                        ));
                    }

                    if (CommonValidation.isEmpty(value)) {
                        includeErrors.push(CommonValidation.error.emptyValue(`config.includes[${key}]`));
                    }
                });

                if (includeErrors.length > 0) throw new TypeError(includeErrors.join(`\n`));
            }
        }

        // Checks if the config settings has a 'excludes' attribute
        if (Object.hasOwn(config, `excludes`)) {
            // Checks if the value of the 'excludes' attribute in the config settings is not an array
            if (!CommonValidation.isArray(config.excludes)) {
                const msg = CommonValidation.error.invalidType(
                    `config.excludes`,
                    CommonValidation.getType(config.excludes),
                    `Array`
                );
                throw new TypeError(msg);
            }

            // Checks if the array of the 'excludes' attribute in the config settings is not empty
            if (!CommonValidation.isEmpty(config.excludes)) {
                const excludeErrors = [];

                config.excludes.forEach((value, key) => {
                    if (!CommonValidation.isString(value)) {
                        excludeErrors.push(CommonValidation.error.invalidType(
                            `config.excludes[${key}]`,
                            CommonValidation.getType(value),
                            `String`
                        ));
                    }

                    if (CommonValidation.isEmpty(value)) {
                        excludeErrors.push(CommonValidation.error.emptyValue(`config.excludes[${key}]`));
                    }
                });

                if (excludeErrors.length > 0) throw new TypeError(excludeErrors.join(`\n`));
            }
        }

        // Checks if the config settings has a 'excludes' attribute
        if (Object.hasOwn(config, `index`)) {
            // Checks if the value of the 'index' attribute in the config settings is not a string
            if (!CommonValidation.isString(config.index)) {
                const msg = CommonValidation.error.invalidType(
                    `config.index`,
                    CommonValidation.getType(config.index),
                    `String`
                );
                throw new TypeError(msg);
            }

            // Checks if the value of the 'index' attribute in the config settings is not empty
            if (CommonValidation.isEmpty(config.index)) {
                const msg = CommonValidation.error.emptyValue(`config.index`);
                throw new Error(msg);
            }
        }

        // Checks if the config settings has a 'excludes' attribute
        if (Object.hasOwn(config, `package`)) {
            // Checks if the value of the 'package' attribute in the config settings is not a string
            if (!CommonValidation.isString(config[`package`])) {
                const msg = CommonValidation.error.invalidType(
                    `config.package`,
                    CommonValidation.getType(config[`package`]),
                    `String`
                );
                throw new TypeError(msg);
            }

            // Checks if the value of the 'index' attribute in the config settings is not empty
            if (CommonValidation.isEmpty(config[`package`])) {
                const msg = CommonValidation.error.emptyValue(`config.package`);
                throw new Error(msg);
            }
        }

        if (Object.hasOwn(config, `outputAST`)) {
            // Checks if the value of the 'outputAST' attribute in the config settings is not a boolean
            if (!CommonValidation.isBoolean(config.outputAST)) {
                const msg = CommonValidation.error.invalidType(
                    `config.outputAST`,
                    CommonValidation.getType(config.outputAST),
                    `Boolean`
                );
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

        // Checks if the config settings has a 'plugins' attribute
        if (Object.hasOwn(config, `plugins`)) {
            // Checks if the value of the 'plugins' attribute in the config settings is not an array
            if (!CommonValidation.isArray(config.plugins)) {
                const msg = CommonValidation.error.invalidType(
                    `config.plugins`,
                    CommonValidation.getType(config.plugins),
                    `Array`
                );
                throw new TypeError(msg);
            }

            if (!CommonValidation.isEmpty(config.plugins)) {
                for (const [index, pluginConfig] of config.plugins.entries()) {
                    // Checks if the plugin value of the 'plugins' attribute in the config settings is not an object
                    if (!CommonValidation.isObject(pluginConfig)) {
                        const msg = CommonValidation.error.invalidType(
                            `config.plugins[${index}]`,
                            CommonValidation.getType(pluginConfig),
                            `Object`
                        );
                        throw new TypeError(msg);
                    }

                    // Checks if the plugin value of the 'plugins' attribute in the config settings is not empty
                    if (CommonValidation.isEmpty(pluginConfig)) {
                        const msg = CommonValidation.error.emptyValue(`config.plugins[${index}]`);
                        throw new Error(msg);
                    }

                    // Checks if the plugin value of the 'plugins' attribute in the config settings has invalid keys
                    if (!CommonValidation.hasValidKeys(pluginConfig, this.#allowedKeys.plugin)) {
                        const invalidKeys = CommonValidation.getInvalidKeys(pluginConfig, this.#allowedKeys.plugin);
                        const msg = CommonValidation.error.invalidKey(
                            `config.plugins[${index}]`,
                            JSON.stringify(invalidKeys)
                        );
                        throw new Error(msg);
                    }

                    // Checks if the plugin value has not a 'name' attribute
                    if (!Object.hasOwn(pluginConfig, `name`)) {
                        const msg = CommonValidation.error.missingKey(`config.plugins[${index}]`, `name`);
                        throw new Error(msg);
                    }

                    // Checks if the plugin value of the 'name' attribute is not a string
                    if (!CommonValidation.isString(pluginConfig.name)) {
                        const msg = CommonValidation.error.invalidType(
                            `config.plugins[${index}].name`,
                            CommonValidation.getType(pluginConfig.name),
                            `String`
                        );
                        throw new TypeError(msg);
                    }

                    // Checks if the plugin value of the 'name' attribute is not empty
                    if (CommonValidation.isEmpty(pluginConfig.name)) {
                        const msg = CommonValidation.error.emptyValue(`config.plugins[${index}].name`);
                        throw new Error(msg);
                    }

                    // Checks if the plugin value has a 'option' attribute
                    if (Object.hasOwn(pluginConfig, `option`)) {
                        // Checks if the plugin value of the 'option' attribute is not an object
                        if (!CommonValidation.isObject(pluginConfig.option)) {
                            const msg = CommonValidation.error.invalidType(
                                `config.plugins[${index}].option`,
                                CommonValidation.getType(pluginConfig.option),
                                `Object`
                            );
                            throw new TypeError(msg);
                        }

                        // Checks if the plugin value of the 'option' attribute is not empty
                        if (CommonValidation.isEmpty(pluginConfig.option)) {
                            const msg = CommonValidation.error.emptyValue(`config.plugins[${index}].option`);
                            throw new Error(msg);
                        }
                    }
                }
            }
        }
    }
}
