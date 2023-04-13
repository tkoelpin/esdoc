// import assert from 'node:assert/strict';
import {assert} from 'chai';
// import { describe, it } from 'mocha';
import CommonValidation from '../../../src/Validation/CommonValidation.js';
import ConfigValidation from '../../../src/Validation/ConfigValidation.js';

const scenarios = {
    0: {
        config: [],
        test: (config) => {
            try {
                ConfigValidation.validate(config);
            } catch (err) {
                it(`Throws an {TypeError}.`, () => {
                    assert.strictEqual(CommonValidation.getType(err), `TypeError`);
                });
    
                it(`Error message is: "The variable config has a type of {Array}, but {Object} expected."`, () => {
                    const msg = `The variable config has a type of {Array}, but {Object} expected.`;
                    assert.strictEqual(err.message, msg);
                });
            }
        }
    },
    1: {
        config: {},
        test: (config) => {
            try {
                ConfigValidation.validate(config);
            } catch (err) {
                it(`Throws an {Error}.`, () => {
                    assert.strictEqual(CommonValidation.getType(err), `Error`);
                });
    
                it(`Error message is: "The variable 'config' is empty and should not be empty."`, () => {
                    const msg = `The variable 'config' is empty and should not be empty.`;
                    assert.strictEqual(err.message, msg);
                });
            }
        }
    },
    2: {
        config: {foo: `bar`},
        test: (config) => {
            try {
                ConfigValidation.validate(config);
            } catch (err) {
                it(`Throws an {Error}.`, () => {
                    assert.strictEqual(CommonValidation.getType(err), `Error`);
                });
    
                it(`Error message is: "The keys of the object 'config' are invalid: ["foo"]. Please remove or disable it for further proceedings!"`, () => {
                    const msg = `The keys of the object 'config' are invalid: ["foo"]. Please remove or disable it for further proceedings!`;
                    assert.strictEqual(err.message, msg);
                });
            }
        }
    },
    3: {
        config: {source: 55},
        test: (config) => {
            try {
                ConfigValidation.validate(config);
            } catch (err) {
                it(`Throws an {TypeError}.`, () => {
                    assert.strictEqual(CommonValidation.getType(err), `TypeError`);
                });
    
                it(`Error message is: "The variable config.source has a type of {Number}, but {String} expected."`, () => {
                    const msg = `The variable config.source has a type of {Number}, but {String} expected.`;
                    assert.strictEqual(err.message, msg);
                });
            }
        }
    },
    4: {
        config: {source: ``},
        test: (config) => {
            try {
                ConfigValidation.validate(config);
            } catch (err) {
                it(`Throws an {Error}.`, () => {
                    assert.strictEqual(CommonValidation.getType(err), `Error`);
                });
    
                it(`Error message is: "The variable 'config.source' is empty and should not be empty."`, () => {
                    const msg = `The variable 'config.source' is empty and should not be empty.`;
                    assert.strictEqual(err.message, msg);
                });
            }
        }
    },
    5: {
        config: {source: `src`},
        test: (config) => {
            try {
                ConfigValidation.validate(config);
            } catch (err) {
                it(`Throws an {Error}.`, () => {
                    assert.strictEqual(CommonValidation.getType(err), `Error`);
                });
    
                it(`Error message is: "The object 'config' needs the key 'destination' for further proceedings. Please fix it!"`, () => {
                    const msg = `The object 'config' needs the key 'destination' for further proceedings. Please fix it!`;
                    assert.strictEqual(err.message, msg);
                });
            }
        }
    },
    6: {
        config: {source: `src`, destination: 55},
        test: (config) => {
            try {
                ConfigValidation.validate(config);
            } catch (err) {
                it(`Throws an {TypeError}.`, () => {
                    assert.strictEqual(CommonValidation.getType(err), `TypeError`);
                });
    
                it(`Error message is: "The variable config.destination has a type of {Number}, but {String} expected."`, () => {
                    const msg = `The variable config.destination has a type of {Number}, but {String} expected.`;
                    assert.strictEqual(err.message, msg);
                });
            }
        }
    },
    7: {
        config: {source: `src`, destination: ``},
        test: (config) => {
            try {
                ConfigValidation.validate(config);
            } catch (err) {
                it(`Throws an {Error}.`, () => {
                    assert.strictEqual(CommonValidation.getType(err), `Error`);
                });
    
                it(`Error message is: "The variable 'config.destination' is empty and should not be empty."`, () => {
                    const msg = `The variable 'config.destination' is empty and should not be empty.`;
                    assert.strictEqual(err.message, msg);
                });
            }
        }
    },
    8: {
        config: {source: `src`, destination: `dest`},
        test: (config) => {
            it(`Result is {Undefined}`, () => {
                const check = ConfigValidation.validate(config);
                assert.strictEqual(CommonValidation.getType(check), `Undefined`);
            });
        }
    },
    9: {
        config: {source: `src`, destination: `dest`, includes: `foo`},
        test: (config) => {
            try {
                ConfigValidation.validate(config);
            } catch (err) {
                it(`Throws an {TypeError}.`, () => {
                    assert.strictEqual(CommonValidation.getType(err), `TypeError`);
                });
    
                it(`Error message is: "The variable config.includes has a type of {String}, but {Array} expected."`, () => {
                    const msg = `The variable config.includes has a type of {String}, but {Array} expected.`;
                    assert.strictEqual(err.message, msg);
                });
            }
        }
    },
    10: {
        config: {source: `src`, destination: `dest`, includes: []},
        test: (config) => {
            it(`Result is {Undefined}`, () => {
                const check = ConfigValidation.validate(config);
                assert.strictEqual(CommonValidation.getType(check), `Undefined`);
            });
        }
    },
    11: {
        config: {source: `src`, destination: `dest`, includes: [2]},
        test: (config) => {
            try {
                ConfigValidation.validate(config);
            } catch (err) {
                it(`Throws an {TypeError}.`, () => {
                    assert.strictEqual(CommonValidation.getType(err), `TypeError`);
                });
    
                it(`Error message is: "The variable config.includes[0] has a type of {Number}, but {String} expected."`, () => {
                    const msg = `The variable config.includes[0] has a type of {Number}, but {String} expected.`;
                    assert.strictEqual(err.message, msg);
                });
            }
        }
    },
    12: {
        config: {source: `src`, destination: `dest`, includes: [true, `test`]},
        test: (config) => {
            try {
                ConfigValidation.validate(config);
            } catch (err) {
                it(`Throws an {TypeError}.`, () => {
                    assert.strictEqual(CommonValidation.getType(err), `TypeError`);
                });
    
                it(`Error message is: "The variable config.includes[0] has a type of {Boolean}, but {String} expected."`, () => {
                    const msg = `The variable config.includes[0] has a type of {Boolean}, but {String} expected.`;
                    assert.strictEqual(err.message, msg);
                });
            }
        }
    },
    13: {
        config: {source: `src`, destination: `dest`, includes: [``]},
        test: (config) => {
            try {
                ConfigValidation.validate(config);
            } catch (err) {
                it(`Throws an {TypeError}.`, () => {
                    assert.strictEqual(CommonValidation.getType(err), `TypeError`);
                });
        
                it(`Error message is: "The variable 'config.includes[0]' is empty and should not be empty."`, () => {
                    const msg = `The variable 'config.includes[0]' is empty and should not be empty.`;
                    assert.strictEqual(err.message, msg);
                });
            }
        }
    },
    14: {
        config: {source: `src`, destination: `dest`, includes: [`test`]},
        test: (config) => {
            it(`Result is {Undefined}`, () => {
                const check = ConfigValidation.validate(config);
                assert.strictEqual(CommonValidation.getType(check), `Undefined`);
            });
        }
    },
    15: {
        config: {source: `src`, destination: `dest`, includes: [`test`], excludes: `foo`},
        test: (config) => {
            try {
                ConfigValidation.validate(config);
            } catch (err) {
                it(`Throws an {TypeError}.`, () => {
                    assert.strictEqual(CommonValidation.getType(err), `TypeError`);
                });
    
                it(`Error message is: "The variable config.excludes has a type of {String}, but {Array} expected."`, () => {
                    const msg = `The variable config.excludes has a type of {String}, but {Array} expected.`;
                    assert.strictEqual(err.message, msg);
                });
            }
        }
    },
    16: {
        config: {source: `src`, destination: `dest`, includes: [`test`], excludes: []},
        test: (config) => {
            it(`Result is {Undefined}`, () => {
                const check = ConfigValidation.validate(config);
                assert.strictEqual(CommonValidation.getType(check), `Undefined`);
            });
        }
    },
    17: {
        config: {source: `src`, destination: `dest`, includes: [`test`], excludes: [3]},
        test: (config) => {
            try {
                ConfigValidation.validate(config);
            } catch (err) {
                it(`Throws an {TypeError}.`, () => {
                    assert.strictEqual(CommonValidation.getType(err), `TypeError`);
                });
        
                it(`Error message is: "The variable config.excludes[0] has a type of {Number}, but {String} expected."`, () => {
                    const msg = `The variable config.excludes[0] has a type of {Number}, but {String} expected.`;
                    assert.strictEqual(err.message, msg);
                });
            }
        }
    },
    18: {
        config: {source: `src`, destination: `dest`, includes: [`test`], excludes: [false, `lib`]},
        test: (config) => {
            try {
                ConfigValidation.validate(config);
            } catch (err) {
                it(`Throws an {TypeError}.`, () => {
                    assert.strictEqual(CommonValidation.getType(err), `TypeError`);
                });
        
                it(`Error message is: "The variable config.excludes[0] has a type of {Boolean}, but {String} expected."`, () => {
                    const msg = `The variable config.excludes[0] has a type of {Boolean}, but {String} expected.`;
                    assert.strictEqual(err.message, msg);
                });
            }
        }
    },
    19: {
        config: {source: `src`, destination: `dest`, includes: [`test`], excludes: [``]},
        test: (config) => {
            try {
                ConfigValidation.validate(config);
            } catch (err) {
                it(`Throws an {TypeError}.`, () => {
                    assert.strictEqual(CommonValidation.getType(err), `TypeError`);
                });
        
                it(`Error message is: "The variable 'config.excludes[0]' is empty and should not be empty."`, () => {
                    const msg = `The variable 'config.excludes[0]' is empty and should not be empty.`;
                    assert.strictEqual(err.message, msg);
                });
            }
        }
    },
    20: {
        config: {source: `src`, destination: `dest`, includes: [`test`], excludes: [`lib`]},
        test: (config) => {
            it(`Result is {Undefined}`, () => {
                const check = ConfigValidation.validate(config);
                assert.strictEqual(CommonValidation.getType(check), `Undefined`);
            });
        }
    },    
    21: {
        config: {source: `src`, destination: `dest`, includes: [`test`], excludes: [`lib`], index: null},
        test: (config) => {
            try {
                ConfigValidation.validate(config);
            } catch (err) {
                it(`Throws an {TypeError}.`, () => {
                    assert.strictEqual(CommonValidation.getType(err), `TypeError`);
                });
        
                it(`Error message is: "The variable config.index has a type of {Null}, but {String} expected."`, () => {
                    const msg = `The variable config.index has a type of {Null}, but {String} expected.`;
                    assert.strictEqual(err.message, msg);
                });
            }
        }
    },
    22: {
        config: {source: `src`, destination: `dest`, includes: [`test`], excludes: [`lib`], index: ``},
        test: (config) => {
            try {
                ConfigValidation.validate(config);
            } catch (err) {
                it(`Throws an {Error}.`, () => {
                    assert.strictEqual(CommonValidation.getType(err), `Error`);
                });
        
                it(`Error message is: "The variable 'config.index' is empty and should not be empty."`, () => {
                    const msg = `The variable 'config.index' is empty and should not be empty.`;
                    assert.strictEqual(err.message, msg);
                });
            }
        }
    },
    23: {
        config: {source: `src`, destination: `dest`, includes: [`test`], excludes: [`lib`], index: `README.md`},
        test: (config) => {
            it(`Result is {Undefined}`, () => {
                const check = ConfigValidation.validate(config);
                assert.strictEqual(CommonValidation.getType(check), `Undefined`);
            });
        }
    },
    24: {
        config: {source: `src`, destination: `dest`, includes: [`test`], excludes: [`lib`], index: `README.md`, package: [25]},
        test: (config) => {
            try {
                ConfigValidation.validate(config);
            } catch (err) {
                it(`Throws an {TypeError}.`, () => {
                    assert.strictEqual(CommonValidation.getType(err), `TypeError`);
                });
        
                it(`Error message is: "The variable config.package has a type of {Array}, but {String} expected."`, () => {
                    const msg = `The variable config.package has a type of {Array}, but {String} expected.`;
                    assert.strictEqual(err.message, msg);
                });
            }
        }
    },
    25: {
        config: {source: `src`, destination: `dest`, includes: [`test`], excludes: [`lib`], index: `README.md`, package: ``},
        test: (config) => {
            try {
                ConfigValidation.validate(config);
            } catch (err) {
                it(`Throws an {Error}.`, () => {
                    assert.strictEqual(CommonValidation.getType(err), `Error`);
                });
        
                it(`Error message is: "The variable 'config.package' is empty and should not be empty."`, () => {
                    const msg = `The variable 'config.package' is empty and should not be empty.`;
                    assert.strictEqual(err.message, msg);
                });
            }
        }
    },
    26: {
        config: {source: `src`, destination: `dest`, includes: [`test`], excludes: [`lib`], index: `README.md`, package: `package.json`},
        test: (config) => {
            it(`Result is {Undefined}`, () => {
                const check = ConfigValidation.validate(config);
                assert.strictEqual(CommonValidation.getType(check), `Undefined`);
            });
        }
    },
    27: {
        config: {source: `src`, destination: `dest`, includes: [`test`], excludes: [`lib`], index: `README.md`, package: `package.json`, outputAST: `path`},
        test: (config) => {
            try {
                ConfigValidation.validate(config);
            } catch (err) {
                it(`Throws an {TypeError}.`, () => {
                    assert.strictEqual(CommonValidation.getType(err), `TypeError`);
                });
        
                it(`Error message is: "The variable config.outputAST has a type of {String}, but {Boolean} expected."`, () => {
                    const msg = `The variable config.outputAST has a type of {String}, but {Boolean} expected.`;
                    assert.strictEqual(err.message, msg);
                });
            }
        }
    },
    28: {
        config: {source: `src`, destination: `dest`, includes: [`test`], excludes: [`lib`], index: `README.md`, package: `package.json`, outputAST: false},
        test: (config) => {
            it(`Result is {Undefined}`, () => {
                const check = ConfigValidation.validate(config);
                assert.strictEqual(CommonValidation.getType(check), `Undefined`);
            });
        }
    },
    29: {
        config: {source: `src`, destination: `dest`, plugins: `foo`},
        test: (config) => {
            try {
                ConfigValidation.validate(config);
            } catch (err) {
                it(`Throws an {TypeError}.`, () => {
                    assert.strictEqual(CommonValidation.getType(err), `TypeError`);
                });
        
                it(`Error message is: "The variable config.plugins has a type of {String}, but {Array} expected."`, () => {
                    const msg = `The variable config.plugins has a type of {String}, but {Array} expected.`;
                    assert.strictEqual(err.message, msg);
                });
            }
        }
    },
    30: {
        config: {source: `src`, destination: `dest`, plugins: []},
        test: (config) => {
            it(`Result is {Undefined}`, () => {
                const check = ConfigValidation.validate(config);
                assert.strictEqual(CommonValidation.getType(check), `Undefined`);
            });
        }
    },
    31: {
        config: {source: `src`, destination: `dest`, plugins: [true]},
        test: (config) => {
            try {
                ConfigValidation.validate(config);
            } catch (err) {
                it(`Throws an {TypeError}.`, () => {
                    assert.strictEqual(CommonValidation.getType(err), `TypeError`);
                });
        
                it(`Error message is: "The variable config.plugins[0] has a type of {Boolean}, but {Object} expected."`, () => {
                    const msg = `The variable config.plugins[0] has a type of {Boolean}, but {Object} expected.`;
                    assert.strictEqual(err.message, msg);
                });
            }
        }
    },
    32: {
        config: {source: `src`, destination: `dest`, plugins: [{}]},
        test: (config) => {
            try {
                ConfigValidation.validate(config);
            } catch (err) {
                it(`Throws an {Error}.`, () => {
                    assert.strictEqual(CommonValidation.getType(err), `Error`);
                });
        
                it(`Error message is: "The variable 'config.plugins[0]' is empty and should not be empty."`, () => {
                    const msg = `The variable 'config.plugins[0]' is empty and should not be empty.`;
                    assert.strictEqual(err.message, msg);
                });
            }
        }
    },
    33: {
        config: {source: `src`, destination: `dest`, plugins: [{foo: 23}]},
        test: (config) => {
            try {
                ConfigValidation.validate(config);
            } catch (err) {
                it(`Throws an {Error}.`, () => {
                    assert.strictEqual(CommonValidation.getType(err), `Error`);
                });
        
                it(`Error message is: "The keys of the object 'config.plugins[0]' are invalid: ['foo']. Please remove or disable it for further proceedings!"`, () => {
                    const msg = `The keys of the object 'config.plugins[0]' are invalid: ["foo"]. Please remove or disable it for further proceedings!`;
                    assert.strictEqual(err.message, msg);
                });
            }
        }
    },
    34: {
        config: {source: `src`, destination: `dest`, plugins: [{name: null}]},
        test: (config) => {
            try {
                ConfigValidation.validate(config);
            } catch (err) {
                it(`Throws an {TypeError}.`, () => {
                    assert.strictEqual(CommonValidation.getType(err), `TypeError`);
                });
        
                it(`Error message is: "The variable config.plugins[0].name has a type of {Null}, but {String} expected."`, () => {
                    const msg = `The variable config.plugins[0].name has a type of {Null}, but {String} expected.`;
                    assert.strictEqual(err.message, msg);
                });
            }
        }
    },
    35: {
        config: {source: `src`, destination: `dest`, plugins: [{name: ``}]},
        test: (config) => {
            try {
                ConfigValidation.validate(config);
            } catch (err) {
                it(`Throws an {Error}.`, () => {
                    assert.strictEqual(CommonValidation.getType(err), `Error`);
                });
        
                it(`Error message is: "The variable 'config.plugins[0].name' is empty and should not be empty."`, () => {
                    const msg = `The variable 'config.plugins[0].name' is empty and should not be empty.`;
                    assert.strictEqual(err.message, msg);
                });
            }
        }
    },
    36: {
        config: {source: `src`, destination: `dest`, plugins: [{name: `esdoc-standard-plugin`}]},
        test: (config) => {
            try {
                ConfigValidation.validate(config);
            } catch (err) {
                it(`Throws an {TypeError}.`, () => {
                    assert.strictEqual(CommonValidation.getType(err), `TypeError`);
                });
        
                it(`Error message is: "The variable config.plugins[0].name has a type of {Null}, but {String} expected."`, () => {
                    const msg = `The variable config.plugins[0].name has a type of {Null}, but {String} expected.`;
                    assert.strictEqual(err.message, msg);
                });
            }
        }
    },
    37: {
        config: {source: `src`, destination: `dest`, plugins: [{name: `esdoc-standard-plugin`, option: false}]},
        test: (config) => {
            try {
                ConfigValidation.validate(config);
            } catch (err) {
                it(`Throws an {TypeError}.`, () => {
                    assert.strictEqual(CommonValidation.getType(err), `TypeError`);
                });
        
                it(`Error message is: "The variable config.plugins[0].option has a type of {Boolean}, but {Object} expected."`, () => {
                    const msg = `The variable config.plugins[0].option has a type of {Boolean}, but {Object} expected.`;
                    assert.strictEqual(err.message, msg);
                });
            }
        }
    },
    38: {
        config: {source: `src`, destination: `dest`, plugins: [{name: `esdoc-standard-plugin`, option: {}}]},
        test: (config) => {
            try {
                ConfigValidation.validate(config);
            } catch (err) {
                it(`Throws an {Error}.`, () => {
                    assert.strictEqual(CommonValidation.getType(err), `Error`);
                });
        
                it(`Error message is: "The variable 'config.plugins[0].option' is empty and should not be empty."`, () => {
                    const msg = `The variable 'config.plugins[0].option' is empty and should not be empty.`;
                    assert.strictEqual(err.message, msg);
                });
            }
        }
    }


    // : {
    //     config: {},
    //     test: (config) => {
    //         try {
    //             ConfigValidation.validate(config);
    //         } catch (err) {
    //             console.log(CommonValidation.getType(err));
    //             console.log(err.message);
    //             // it(`Throws an {Error}.`, () => {
    //             //     assert.strictEqual(CommonValidation.getType(err), `Error`);
    //             // });
        
    //             // it(`Error message is: "The object 'config' needs the key 'destination' for further proceedings. Please fix it!"`, () => {
    //             //     const msg = `The object 'config' needs the key 'destination' for further proceedings. Please fix it!`;
    //             //     assert.strictEqual(err.message, msg);
    //             // });
    //         }
    //     }
    // }
};
describe(`Testing the ConfigValidation class:`, () => {
    describe(`Validate JSON config file. The config file contains:`, () => {
        Object.values(scenarios).forEach(({config, test}) => {
            describe(JSON.stringify(config), () => test(config));
        });
    });
});
