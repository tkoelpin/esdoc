// Object.defineProperty(exports, "__esModule", {value: true});

import fsExtra from 'fs-extra';
import path from 'path';

// function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : {def: obj}; }

// const fsExtra2 = _interopRequireDefault(fsExtra);
// const path2 = _interopRequireDefault(path);

/**
 * Node Package Manager(npm) util class.
 */
export default class NPMUtil {
  /**
   * find ESDoc package.json object.
   * @returns {Object} package.json object.
   */
  static findPackage() {
    const filePath = path.normalize(import.meta.url.replace(`file:///`, ``));
    let packageObj = null;
    try {
      const packageFilePath = path.resolve(path.dirname(filePath), `../../package.json`);
      const json = fsExtra.readFileSync(packageFilePath, {encode: `utf8`});
      packageObj = JSON.parse(json);
    } catch {
      const packageFilePath = path.resolve(path.dirname(filePath), `../../../package.json`);
      const json = fsExtra.readFileSync(packageFilePath, {encode: `utf8`});
      packageObj = JSON.parse(json);
    }

    return packageObj;
  }
}
// exports.default = NPMUtil;
