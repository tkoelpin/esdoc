#!/usr/bin/env node

import path from 'node:path';
import sh from './sh.js';

const esdoc = path.resolve(__dirname, '..', 'src', 'ESDocCLI.js');
const babel = path.resolve(__dirname, '..', 'node_modules', '.bin', 'babel-node');
const arg = [].concat(process.argv).splice(2);
const cmd = [babel, esdoc].concat(arg).join(' ');
sh.exec(cmd);
