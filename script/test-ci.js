#!/usr/bin/env node

import sh from './sh.js';

sh.exec('./script/eslint.js');
sh.exec('./script/test.js --coverage');
sh.exec('./node_modules/.bin/codecov');
