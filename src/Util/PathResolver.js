// Object.defineProperty(exports, "__esModule", {value: true});

import assert from 'assert';
import os from 'os';
import path from 'path';

// function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : {def: obj}; }

// const assert2 = _interopRequireDefault(assert);
// const os2 = _interopRequireDefault(os);
// const path2 = _interopRequireDefault(path);

/**
 * file path resolver.
 * @example
 * let pathResolver = new PathResolver('./src', 'foo/bar.js', 'foo-bar', 'foo/bar.js');
 * pathResolver.importPath; // 'foo-bar'
 * pathResolver.filePath; // 'src/foo/bar.js'
 * pathResolver.resolve('./baz.js'); // 'src/foo/baz.js'
 */
export default class PathResolver {
  /** @type {string} */
  #inDirPath;

  /** @type {string} */
  #filePath;

  /** @type {NPMPackageObject} */
  #packageName;

  /** @type {string} */
  #mainFilePath;

  /**
   * create instance.
   * @param {string} inDirPath - root directory path.
   * @param {string} filePath - relative file path from root directory path.
   * @param {string} [packageName] - npm package name.
   * @param {string} [mainFilePath] - npm main file path.
   */
  constructor(inDirPath, filePath, packageName = null, mainFilePath = null) {
    (0, assert)(inDirPath);
    (0, assert)(filePath);

    this.#inDirPath = path.resolve(inDirPath);
    this.#filePath = path.resolve(filePath);
    this.#packageName = packageName;

    if (mainFilePath) {
      this.#mainFilePath = path.resolve(mainFilePath);
    }
  }

  /**
   * import path that is considered package name, main file and path prefix.
   * @type {string}
   */
  get importPath() {
    const relativeFilePath = this.filePath;

    if (this.#mainFilePath === path.resolve(relativeFilePath)) {
      return this.#packageName;
    }

    let filePath;
    if (this.#packageName) {
      filePath = path.normalize(`${this.#packageName}${path.sep}${relativeFilePath}`);
    } else {
      filePath = `./${relativeFilePath}`;
    }

    return this.#slash(filePath);
  }

  /**
   * file full path.
   * @type {string}
   */
  get fileFullPath() {
    return this.#slash(this.#filePath);
  }

  /**
   * file path that is relative path on root dir.
   * @type {string}
   */
  get filePath() {
    const relativeFilePath = path.relative(path.dirname(this.#inDirPath), this.#filePath);
    return this.#slash(relativeFilePath);
  }

  /**
   * resolve file path on this file.
   * @param {string} relativePath - relative path on this file.
   */
  resolve(relativePath) {
    const selfDirPath = path.dirname(this.#filePath);
    const resolvedPath = path.resolve(selfDirPath, relativePath);
    const resolvedRelativePath = path.relative(path.dirname(this.#inDirPath), resolvedPath);
    return this.#slash(resolvedRelativePath);
  }

  /**
   * convert 'back slash' to 'slash'.
   * path separator is 'back slash' if platform is windows.
   * @param {string} filePath - target file path.
   * @returns {string} converted path.
   * @private
   */
  #slash(filePath) {
    let result = filePath;

    if (os.platform() === `win32`) {
      result = filePath.replace(/\\/gu, `/`);
    }

    return result;
  }
}
// exports.default = PathResolver;
