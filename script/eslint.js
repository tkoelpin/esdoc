#!/usr/bin/env node

import sh from './sh.js';

sh.exec('./node_modules/.bin/eslint ./src ./test/src');
