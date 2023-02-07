#!/usr/bin/env node

import childProcess from 'node:child_process';
import fs from 'node:fs';

const tgtDir = `./out/src`;
const cwd = process.cwd();

// Remove the build directory
fs.rmSync(tgtDir, {force: true, recursive: true});

// Make new build directory
fs.mkdirSync(tgtDir, {recursive: true});

// Compile the data through babel and put the result into the build directory
childProcess.execSync(`${cwd}/node_modules/.bin/babel --out-dir ${cwd}/out/src ${cwd}/src`);

// Make the Client-Runner processable
fs.chmodSync(`${tgtDir}/ESDocCLI.js`, 755);
