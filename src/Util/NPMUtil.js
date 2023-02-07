import fs from 'fs';
import path from 'node:path';

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
      const json = fs.readFileSync(packageFilePath, {encode: `utf8`});
      packageObj = JSON.parse(json);
    } catch {
      const packageFilePath = path.resolve(path.dirname(filePath), `../../../package.json`);
      const json = fs.readFileSync(packageFilePath, {encode: `utf8`});
      packageObj = JSON.parse(json);
    }

    return packageObj;
  }
}
