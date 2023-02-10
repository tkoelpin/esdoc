#!/usr/bin/env node
import '@babel/register';

import ESParser from '../src/Parser/ESParser.js';
import Plugin from '../src/Plugin/Plugin.js';

Plugin.init([]);

if (!process.argv[2]) {
  console.log('usage: ast.js path/to/file');
  process.exit(1);
}

const ast = ESParser.parse({}, process.argv[2]);
console.log(JSON.stringify(ast, null, 2));
