// Object.defineProperty(exports, "__esModule", {value: true});

import fs from 'fs';

import AbstractDoc from './AbstractDoc.js';

// function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : {def: obj}; }

// var _fs2 = _interopRequireDefault(_fs);

// var _AbstractDoc2 = _interopRequireDefault(_AbstractDoc);

/**
 * Doc Class from source file.
 */
export default class FileDoc extends AbstractDoc {
  /**
   * apply own tag.
   * @private
   */
  #apply() {
    // super.#apply();

    Reflect.deleteProperty(this.$value, `export`);
    Reflect.deleteProperty(this.$value, `importPath`);
    Reflect.deleteProperty(this.$value, `importStyle`);
  }

  /** specify ``file`` to kind. */
  $kind() {
    // super.#$kind();
    this.$value.kind = `file`;
  }

  /** take out self name from file path */
  $name() {
    // super.#$name();
    this.$value.name = this.$pathResolver.filePath;
  }

  /** specify name to longname */
  $longname() {
    this.$value.longname = this.$pathResolver.fileFullPath;
  }

  /** specify file content to value.content */
  $content() {
    // super.#$content();

    const filePath = this.$pathResolver.fileFullPath;
    const content = fs.readFileSync(filePath, {encode: `utf8`}).toString();
    this.$value.content = content;
  }
}
// exports.default = FileDoc;
