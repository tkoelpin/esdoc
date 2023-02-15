#!/usr/bin/env node

import sh from './sh.js';

// const tgtDir = `./out/src`;
// const cwd = process.cwd();

// Remove the build directory
sh.rm('./out/src');

// Make new build directory
sh.mkdir('./out/src');

// Compile the data through babel and put the result into the build directory
sh.exec('./node_modules/.bin/babel --out-dir out/src src');
// childProcess.execSync(`${cwd}/node_modules/.bin/babel --out-dir ${cwd}/out/src ${cwd}/src`);

// Make the Client-Runner processable
sh.chmod('./out/src/ESDocCLI.js', '755');
