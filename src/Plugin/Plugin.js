// exports.PluginEvent = undefined;

import {createRequire} from 'node:module';
import {cwd} from 'node:process';
import path from 'node:path';

import PluginEvent from './PluginEvent.js';

/**
 * Plugin system for your plugin.
 */
class Plugin {
  #plugins;

  /**
   * create instance.
   */
  constructor() {
    this.#plugins = null;
  }

  /**
   * initialize with plugin property.
   * @param {Array<{name: string, option: object}>} plugins - expect config.plugins property.
   */
  init(plugins = []) {
    this.onHandlePlugins(plugins);
  }

  /**
   * exec plugin handler.
   * @param {string} handlerName - handler name(e.g. onHandleCode)
   * @param {PluginEvent} ev - plugin event object.
   * @private
   */
  #execHandler(handlerName, ev) {
    /* eslint-disable global-require */
    for (const item of this.#plugins) {
      let plugin;
      if (item.name.match(/^[./]/u)) {
        const pluginPath = path.resolve(item.name);
        plugin = createRequire(pluginPath);
      } else {
        plugin = createRequire(path.resolve(`./node_modules/${item.name}`));
      }

      if (!plugin[handlerName]) continue;

      ev.data.option = item.option;
      plugin[handlerName](ev);
    }
  }

  onHandlePlugins(plugins) {
    this.#plugins = plugins;
    const ev = new PluginEvent({plugins});
    this.#execHandler(`onHandlePlugins`, ev);
    this.#plugins = ev.data.plugins;
  }

  /**
   * handle start.
   */
  onStart() {
    const ev = new PluginEvent();
    this.#execHandler(`onStart`, ev);
  }

  /**
   * handle config.
   * @param {ESDocConfig} config - original esdoc config.
   * @returns {ESDocConfig} handled config.
   */
  onHandleConfig(config) {
    const ev = new PluginEvent({config});
    this.#execHandler(`onHandleConfig`, ev);
    return ev.data.config;
  }

  /**
   * handle code.
   * @param {string} code - original code.
   * @param {string} filePath - source code file path.
   * @returns {string} handled code.
   */
  onHandleCode(code, filePath) {
    const ev = new PluginEvent({code});
    ev.data.filePath = filePath;
    this.#execHandler(`onHandleCode`, ev);
    return ev.data.code;
  }

  /**
   * handle code parser.
   * @param {function(code: string)} parser - original js parser.
   * @param {object} parserOption - default babylon options.
   * @param {string} filePath - source code file path.
   * @param {string} code - original code.
   * @returns {{parser: function(code: string), parserOption: Object}} handled parser.
   */
  onHandleCodeParser(parser, parserOption, filePath, code) {
    const ev = new PluginEvent();
    ev.data = {
      code,
      filePath,
      parser,
      parserOption
    };
    this.#execHandler(`onHandleCodeParser`, ev);
    return {
      parser:       ev.data.parser,
      parserOption: ev.data.parserOption
    };
  }

  /**
   * handle AST.
   * @param {AST} ast - original ast.
   * @param {string} filePath - source code file path.
   * @param {string} code - original code.
   * @returns {AST} handled AST.
   */
  onHandleAST(ast, filePath, code) {
    const ev = new PluginEvent({ast});
    ev.data.filePath = filePath;
    ev.data.code = code;
    this.#execHandler(`onHandleAST`, ev);
    return ev.data.ast;
  }

  /**
   * handle docs.
   * @param {Object[]} docs - docs.
   * @returns {Object[]} handled docs.
   */
  onHandleDocs(docs) {
    const ev = new PluginEvent({docs});
    this.#execHandler(`onHandleDocs`, ev);
    return ev.data.docs;
  }

  /**
   * handle publish
   * @param {function(filePath: string, content: string)} writeFile - write content.
   * @param {function(srcPath: string, destPath: string)} copyDir - copy directory.
   * @param {function(filePath: string):string} readFile - read content.
   */
  onPublish(writeFile, copyDir, readFile) {
    const ev = new PluginEvent({});

    // hack: fixme
    ev.data.writeFile = writeFile;
    ev.data.copyFile = copyDir;
    ev.data.copyDir = copyDir;
    ev.data.readFile = readFile;

    this.#execHandler(`onPublish`, ev);
  }

  /**
   * handle content.
   * @param {string} content - original content.
   * @param {string} fileName - the fileName of the HTML file.
   * @returns {string} handled HTML.
   */
  onHandleContent(content, fileName) {
    const ev = new PluginEvent({content, fileName});
    this.#execHandler(`onHandleContent`, ev);
    return ev.data.content;
  }

  /**
   * handle complete
   */
  onComplete() {
    const ev = new PluginEvent();
    this.#execHandler(`onComplete`, ev);
  }
}

// export PluginEvent;

/**
 * Instance of Plugin class.
 */
export default new Plugin();
// exports.default = new Plugin();
