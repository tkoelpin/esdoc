// Object.defineProperty(exports, "__esModule", {value: true});

import fsExtra from 'fs-extra';

// function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : {def: obj}; }

// const fsExtra2 = _interopRequireDefault(fsExtra);

/**
 * logger for invalid code which can not be parsed with ESDoc.
 */
class InvalidCodeLogger {
  #logs;

  constructor() {
    this.#logs = [];
  }

  /**
   * show log.
   * @param {string} filePath - invalid code in this file.
   * @param {ASTNode} [node] - fail parsing node.
   */
  show(filePath, node) {
    if (!node) {
      this.showFile(filePath);
      return;
    }

    const lines = fsExtra.readFileSync(filePath).toString()
      .split(`\n`);
    const targetLines = [];
    let start;
    const end = node.loc.start.line;

    if (node.leadingComments && node.leadingComments[0]) {
      start = node.leadingComments[0].loc.start.line;
    } else {
      start = Math.max(0, end - 10);
    }

    for (let i = start - 1; i < end; i++) {
      targetLines.push(`${i + 1}| ${lines[i]}`);
    }

    console.log(`[31merror: could not process the following code.[32m`);
    console.log(filePath);
    console.log(targetLines.join(`\n`));
    console.log(`[0m`);

    this.#logs.push({
      filePath,
      log: [start, end]
    });
  }

  /**
   * show error log.
   * @param {Error} error - target error.
   */
  showError(error) {
    console.log(`[31m`);
    console.log(error);
    console.log(`[0m`);
  }

  /**
   * show log.
   * @param {string} filePath - invalid code in this file.
   * @param {Error} error - error object.
   */
  showFile(filePath, error) {
    const lines = fsExtra.readFileSync(filePath).toString()
      .split(`\n`);
    const start = Math.max(error.loc.line - 3, 1);
    const end = Math.min(error.loc.line + 3, lines.length);
    const targetLines = [];

    for (let i = start - 1; i < end; i++) {
      targetLines.push(`${i + 1}| ${lines[i]}`);
    }

    console.log(`[31mwarning: could not parse the following code. if you want to use ECMAScript proposals, see https://esdoc.org/manual/feature.html#ecmascript-proposal[32m`);
    console.log(filePath);
    console.log(`${targetLines.join(`\n`)}[0m`);

    this.#logs.push({
      filePath,
      log: [start, end]
    });
  }
}

/**
 * singleton for {@link InvalidCodeLogger}
 */
export default new InvalidCodeLogger();
// exports.default = new InvalidCodeLogger();
