#!/usr/bin/env node

import {createRequire} from 'node:module';
import fs from 'node:fs';
import minimist from 'minimist';
import path from 'node:path';

import ESDoc from './ESDoc.js';
import NPMUtil from './Util/NPMUtil.js';

/**
 * Command Line Interface for ESDoc.
 *
 * @example
 * let cli = new ESDocCLI(process.argv);
 * cli.exec();
 */
export default class ESDocCLI {
  /** @type {ESDocCLIArgv} */
  #argv;

  /**
   * Create instance.
   * @param {Object} argv - this is node.js argv(``process.argv``)
   */
  constructor(argv) {
    this.#argv = minimist(argv.slice(2));

    if (this.#argv.h || this.#argv.help) {
      this.#showHelp();
      process.exit(0);
    }

    if (this.#argv.v || this.#argv.version) {
      this.#showVersion();
      process.exit(0);
    }
  }

  /**
   * execute to generate document.
   */
  exec() {
    const configPath = this.#findConfigFilePath();
    const config = configPath ? this.#loadConfigFromFile(configPath) : this.#loadConfigFromPackageJSON();

    if (config) {
      ESDoc.generate(config);
    } else {
      this.#showHelp();
      process.exit(1);
    }
  }

  /**
   * show help of ESDoc
   * @private
   */
  #showHelp() {
    console.log(`Usage: esdoc [-c esdoc.json]`);
    console.log(``);
    console.log(`Options:`);
    console.log(`  -c`, `specify config file`);
    console.log(`  -h`, `output usage information`);
    console.log(`  -v`, `output the version number`);
    console.log(``);
    console.log(`ESDoc finds configuration by the order:`);
    console.log(`  1. '-c your-esdoc.json'`);
    console.log(`  2. '.esdoc.json' in current directory`);
    console.log(`  3. '.esdoc.js' in current directory`);
    console.log(`  4. 'esdoc' property in package.json`);
  }

  /**
   * show version of ESDoc
   * @private
   */
  #showVersion() {
    const packageObj = NPMUtil.findPackage();
    console.log(packageObj ? packageObj.version : `0.0.0`);    
  }

  /**
   * find ESDoc config file.
   * @returns {string|null} config file path.
   * @private
   */
  #findConfigFilePath() {
    if (this.#argv.c) return this.#argv.c;

    for (const filePath of [`./.esdoc.json`, `./.esdoc.js`]) {
      try {
        const absFilePath = path.resolve(filePath);
        if (fs.existsSync(absFilePath)) return absFilePath;
      } catch {
        // ignore
      }
    }

    return null;
  }

  /**
   * create config object from config file.
   * @param {string} configFilePath - config file path.
   * @return {ESDocConfig} config object.
   * @private
   */
  #loadConfigFromFile(configFilePath) {
    const absConfigFilePath = path.resolve(configFilePath);
    const ext = path.extname(absConfigFilePath);

    let result;

    if (ext === `.js`) {
      /* eslint-disable global-require */
      result = createRequire(absConfigFilePath);
    } else {
      const configJSON = fs.readFileSync(absConfigFilePath, {encode: `utf8`});
      const config = JSON.parse(configJSON);
      result = config;
    }

    return result;
  }

  /**
   * create config object from package.json.
   * @return {ESDocConfig|null} config object.
   * @private
   */
  #loadConfigFromPackageJSON() {
    try {
      const filePath = path.resolve(`./package.json`);
      const packageJSON = fs.readFileSync(filePath, `utf8`).toString();
      const packageObj = JSON.parse(packageJSON);
      return packageObj.esdoc;
    } catch {
      // ignore
    }

    return null;
  }
}

const executedFilePath = fs.realpathSync(process.argv[1]);
const filePath = path.normalize(import.meta.url.replace(`file:///`, ``));

if (executedFilePath === filePath) {
  const cli = new ESDocCLI(process.argv);
  cli.exec();
}
