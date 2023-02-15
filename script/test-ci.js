#!/usr/bin/env node

import sh from './sh.js';

const cwd = process.cwd();

sh.exec(`${cwd}/script/eslint.js`);
sh.exec(`${cwd}/script/test.js --coverage`);
// sh.exec(`${cwd}/node_modules/.bin/codecov`);
