// import assert from 'node:assert/strict';
import {assert} from 'chai';
// import { describe, it } from 'mocha';
import CommonValidation from '../../../src/Validation/CommonValidation.js';
import Plugin from '../../../src/Plugin/Plugin.js';
import PluginEvent from '../../../src/Plugin/PluginEvent.js';

const plugins = [
    {
        "name": "esdoc-standard-plugin",
        "option": {
            "brand": {"title": "ESDoc", "logo": "./manual/asset/image/logo.png"},
            "test": {"source": "./test", "includes": ["\\.test\\.js$"]},
            "manual": {
                "index": "./README.md",
                "asset": "./manual/asset",
                "files": [
                    "./manual/usage.md",
                    "./manual/feature.md",
                    "./manual/tags.md",
                    "./manual/config.md",
                    "./manual/api.md",
                    "./manual/faq.md",
                    "./manual/migration.md",
                    "./CHANGELOG.md"
                ]
            }
        }
    },
    {
        "name": "esdoc-importpath-plugin",
        "option": {
            "replaces": [{"from": "^src/", "to": "out/src/"}]
        }
    }
];

describe(`Testing the Plugin class:`, () => {
   Plugin.init(plugins);
   Plugin.onStart();
//    const newConfig = Plugin.onHandleConfig(plugins);
});