#!/usr/bin/env node

import sh from './sh.js';

sh.rm('./dist/docs');
sh.mkdir('./dist/docs');

sh.rm('./node_modules/esdoc');
sh.mkdir('./node_modules/esdoc/dist/src');
sh.cp('./dist/src', './node_modules/esdoc/dist/src/');
sh.cp('./package.json', './node_modules/esdoc/package.json');
sh.exec('node ./node_modules/esdoc/dist/src/ESDocCLI.js');
