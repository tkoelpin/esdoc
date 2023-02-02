// Object.defineProperty(exports, "__esModule", {value: true});

import path from 'path';

// function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : {def: obj}; }

// const path2 = _interopRequireDefault(path);

const filePathMap = {};

/**
 * Identifier Naming Util class.
 */
export default class NamingUtil {
  /**
   * naming with file path.
   * @param {string} filePath - target file path.
   * @returns {string} name
   */
  static filePathToName(filePath) {
    let [basename] = path.basename(filePath).split(`.`);
    basename = basename.replace(/[^a-zA-Z0-9_$]/gu, ``);

    filePathMap[filePath] = filePathMap[filePath] || 0;
    const count = filePathMap[filePath];
    if (count > 0) basename += count;
    filePathMap[filePath]++;

    return basename;
  }
}
// exports.default = NamingUtil;
