#!/usr/bin/env node

import sh from './sh.js';

// const tgtDir = `./dist/src`;
// const cwd = process.cwd();

// Remove the build directory
sh.rm('./dist/src');

// Make new build directory
sh.mkdir('./dist/src');

// Compile the data through babel and put the result into the build directory
sh.exec('./node_modules/.bin/babel --out-dir dist/src src');
// childProcess.execSync(`${cwd}/node_modules/.bin/babel --out-dir ${cwd}/dist/src ${cwd}/src`);

// Make the Client-Runner processable
sh.chmod('./dist/src/ESDocCLI.js', '755');
