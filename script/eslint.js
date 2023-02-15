#!/usr/bin/env node

import sh from './sh.js';

const cwd = process.cwd();

sh.exec(`${cwd}./node_modules/.bin/eslint ./src ./test/src`);
