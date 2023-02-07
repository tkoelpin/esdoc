import assert from 'node:assert/strict';
import colorLogger from 'color-logger';
import fs from 'node:fs';
import path from 'node:path';

import ASTUtil from './Util/ASTUtil.js';
import DocFactory from './Factory/DocFactory.js';
import ESParser from './Parser/ESParser.js';
import InvalidCodeLogger from './Util/InvalidCodeLogger.js';
import PathResolver from './Util/PathResolver.js';
import Plugin from './Plugin/Plugin.js';

/**
 * API Documentation Generator.
 *
 * @example
 * let config = {source: './src', destination: './esdoc'};
 * ESDoc.generate(config, (results, config)=>{
 *   console.log(results);
 * });
 */
export default class ESDoc {
  /**
   * Generate documentation.
   * @param {ESDocConfig} config - config for generation.
   */
  static generate(config) {
    assert.ok(config.source);
    assert.ok(config.destination);

    ESDoc.#checkOldConfig(config);

    Plugin.init(config.plugins);
    Plugin.onStart();
    const newConfig = Plugin.onHandleConfig(config);

    this.#setDefaultConfig(newConfig);

    colorLogger.debug = !!config.debug;
    const includes = config.includes ? config.includes.map(v => new RegExp(v, `u`)) : [];
    const excludes = config.excludes.map(v => new RegExp(v, `u`));

    let packageName = null;
    let mainFilePath = null;
    if (newConfig[`package`]) {
      try {
        const packageJSON = fs.readFileSync(newConfig[`package`], {encoding: `utf8`});
        const packageConfig = JSON.parse(packageJSON);
        packageName = packageConfig.name;
        mainFilePath = packageConfig.main;
      } catch {
        // ignore
      }
    }

    let results = [];
    const asts = [];
    const sourceDirPath = path.resolve(newConfig.source);

    this.#walk(newConfig.source, (filePath) => {
      const relativeFilePath = path.relative(sourceDirPath, filePath);
      let match = false;
      for (const reg of includes) {
        if (relativeFilePath.match(reg)) {
          match = true;
          break;
        }
      }
      if (!match) return;

      for (const reg of excludes) {
        if (relativeFilePath.match(reg)) return;
      }

      console.log(`parse: ${filePath}`);
      const temp = this.#traverse(newConfig.source, filePath, packageName, mainFilePath);
      if (!temp) return;
      results.push(...temp.results);
      if (newConfig.outputAST) {
        asts.push({
          ast:      temp.ast,
          filePath: `source${path.sep}${relativeFilePath}`
        });
      }
    });

    // config.index
    if (newConfig.index) {
      results.push(this.#generateForIndex(newConfig));
    }

    // config[`package`]
    if (newConfig[`package`]) {
      results.push(this.#generateForPackageJSON(newConfig));
    }

    results = this.#resolveDuplication(results);

    results = Plugin.onHandleDocs(results);

    // index.json
    {
      const dumpDir = path.resolve(newConfig.destination);
      const dumpPath = path.resolve(dumpDir, `index.json`);
      
      if (!fs.existsSync(dumpDir)) fs.mkdirSync(dumpDir, {recursive: true});
        
      fs.writeFileSync(dumpPath, JSON.stringify(results, null, 2));
    }

    // ast, array will be empty if config.outputAST is false - resulting in skipping the loop
    for (const ast of asts) {
      const json = JSON.stringify(ast.ast, null, 2);
      const filePath = path.resolve(newConfig.destination, `ast/${ast.filePath}.json`);
      fs.writeFileSync(filePath, json);
    }

    // publish
    this.#publish(newConfig);

    Plugin.onComplete();
  }

  /**
   * check ESDoc config. and if it is old, exit with warning message.
   * @param {ESDocConfig} config - check config
   * @private
   */
  static #checkOldConfig(config) {
    let exit = false;

    const keys = [[`access`, `esdoc-standard-plugin`], [`autoPrivate`, `esdoc-standard-plugin`], [`unexportedIdentifier`, `esdoc-standard-plugin`], [`undocumentIdentifier`, `esdoc-standard-plugin`], [`builtinExternal`, `esdoc-standard-plugin`], [`coverage`, `esdoc-standard-plugin`], [`test`, `esdoc-standard-plugin`], [`title`, `esdoc-standard-plugin`], [`manual`, `esdoc-standard-plugin`], [`lint`, `esdoc-standard-plugin`], [`includeSource`, `esdoc-exclude-source-plugin`], [`styles`, `esdoc-inject-style-plugin`], [`scripts`, `esdoc-inject-script-plugin`], [`experimentalProposal`, `esdoc-ecmascript-proposal-plugin`]];

    for (const [key, plugin] of keys) {
      if (key in config) {
        console.log(`[31merror: config.${key} is invalid. Please use ${plugin}. how to migration: https://esdoc.org/manual/migration.html[0m`);
        exit = true;
      }
    }

    if (exit) process.exit(1);
  }

  /**
   * set default config to specified config.
   * @param {ESDocConfig} config - specified config.
   * @private
   */
  static #setDefaultConfig(config) {
    if (!config.includes) config.includes = [`\\.js$`];

    if (!config.excludes) config.excludes = [`\\.config\\.js$`, `\\.test\\.js$`];

    if (!config.index) config.index = `./README.md`;

    if (!config[`package`]) config[`package`] = `./package.json`;

    if (!(`outputAST` in config)) config.outputAST = true;
  }

  /**
   * walk recursive in directory.
   * @param {string} dirPath - target directory path.
   * @param {function(entryPath: string)} callback - callback for find file.
   * @private
   */
  static #walk(dirPath, callback) {
    const entries = fs.readdirSync(dirPath);

    for (const entry of entries) {
      const entryPath = path.resolve(dirPath, entry);
      const stat = fs.statSync(entryPath);

      if (stat.isFile()) {
        callback(entryPath);
      } else if (stat.isDirectory()) {
        this.#walk(entryPath, callback);
      }
    }
  }

  /**
   * traverse doc comment in JavaScript file.
   * @param {string} inDirPath - root directory path.
   * @param {string} filePath - target JavaScript file path.
   * @param {string} [packageName] - npm package name of target.
   * @param {string} [mainFilePath] - npm main file path of target.
   * @returns {Object} - return document that is traversed.
   * @property {DocObject[]} results - this is contained JavaScript file.
   * @property {AST} ast - this is AST of JavaScript file.
   * @private
   */
  static #traverse(inDirPath, filePath, packageName, mainFilePath) {
    colorLogger.i(`parsing: ${filePath}`);
    let ast;
    try {
      ast = ESParser.parse(filePath);
    } catch (e) {
      InvalidCodeLogger.showFile(filePath, e);
      return null;
    }

    const pathResolver = new PathResolver(inDirPath, filePath, packageName, mainFilePath);
    const factory = new DocFactory(ast, pathResolver);

    ASTUtil.traverse(ast, (node, parent) => {
      try {
        factory.push(node, parent);
      } catch (e) {
        InvalidCodeLogger.show(filePath, node);
        throw e;
      }
    });

    return {
      ast,
      results: factory.results
    };
  }

  /**
   * generate index doc
   * @param {ESDocConfig} config
   * @returns {Tag}
   * @private
   */
  static #generateForIndex(config) {
    let indexContent = ``;

    if (fs.existsSync(config.index)) {
      indexContent = fs.readFileSync(config.index, {encoding: `utf8`}).toString();
    } else {
      console.log(`[31mwarning: ${config.index} is not found. Please check config.index.[0m`);
    }

    const tag = {
      access:   `public`,
      content:  indexContent,
      kind:     `index`,
      longname: path.resolve(config.index),
      name:     config.index,
      static:   true
    };

    return tag;
  }

  /**
   * generate package doc
   * @param {ESDocConfig} config
   * @returns {Tag}
   * @private
   */
  static #generateForPackageJSON(config) {
    let packageJSON = ``;
    let packagePath = ``;
    try {
      packageJSON = fs.readFileSync(config[`package`], {encoding: `utf-8`});
      packagePath = path.resolve(config[`package`]);
    } catch {
      // ignore
    }

    const tag = {
      access:   `public`,
      content:  packageJSON,
      kind:     `packageJSON`,
      longname: packagePath,
      name:     path.basename(packagePath),
      static:   true
    };

    return tag;
  }

  /**
   * resolve duplication docs
   * @param {Tag[]} docs
   * @returns {Tag[]}
   * @private
   */
  static #resolveDuplication(docs) {
    const memberDocs = docs.filter(doc => doc.kind === `member`);
    const removeIds = [];

    for (const memberDoc of memberDocs) {
      /*
       * member duplicate with getter/setter/method.
       * when it, remove member.
       * getter/setter/method are high priority.
       */
      const sameLongnameDoc = docs.find(doc => doc.longname === memberDoc.longname && doc.kind !== `member`);
      if (sameLongnameDoc) {
        removeIds.push(memberDoc.__docId__);
        continue;
      }

      const dup = docs.filter(doc => doc.longname === memberDoc.longname && doc.kind === `member`);
      if (dup.length > 1) {
        const ids = dup.map(v => v.__docId__);
        ids.sort((a, b) => (a < b ? -1 : 1));
        ids.shift();
        removeIds.push(...ids);
      }
    }

    return docs.filter(doc => !removeIds.includes(doc.__docId__));
  }

  /**
   * publish content
   * @param {ESDocConfig} config
   * @private
   */
  static #publish(config) {
    try {
      const write = (filePath, content, option) => {
        const targetPath = path.resolve(config.destination, filePath);
        const newContent = Plugin.onHandleContent(content, targetPath);

        console.log(`output: ${targetPath}`);
        fs.writeFileSync(targetPath, newContent, option);
      };

      const copy = (srcPath, destPath) => {
        const copyPath = path.resolve(config.destination, destPath);
        console.log(`output: ${copyPath}`);
        fs.copyFileSync(srcPath, copyPath);
      };

      const read = (filePath) => {
        const sourcePath = path.resolve(config.destination, filePath);
        return fs.readFileSync(sourcePath, {encoding: `utf8`}).toString();
      };

      Plugin.onPublish(write, copy, read);
    } catch (e) {
      InvalidCodeLogger.showError(e);
      process.exit(1);
    }
  }
}
