// Object.defineProperty(exports, "__esModule", {value: true});

import babelGenerator from 'babel-generator';

import AbstractDoc from './AbstractDoc.js';
import NamingUtil from '../Util/NamingUtil.js';

// function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : {def: obj}; }

// var _babelGenerator2 = _interopRequireDefault(_babelGenerator);

// var _AbstractDoc2 = _interopRequireDefault(_AbstractDoc);
// var _NamingUtil2 = _interopRequireDefault(_NamingUtil);


/**
 * Doc Class from Function declaration AST node.
 */
export default class FunctionDoc extends AbstractDoc {
  /** specify ``function`` to kind. */
  $kind() {
    // super.#$kind();
    this.$value.kind = `function`;
  }

  /** take out self name from self node */
  $name() {
    // super.#$name();

    if (this.$node.id) {
      if (this.$node.id.type === `MemberExpression`) {
        // e.g. foo[bar.baz] = function bal(){}
        const expression = (0, babelGenerator)(this.$node.id).code;
        this.$value.name = `[${expression}]`;
      } else {
        this.$value.name = this.$node.id.name;
      }
    } else {
      this.$value.name = NamingUtil.filePathToName(this.$pathResolver.filePath);
    }
  }

  /** take out self name from file path */
  $memberof() {
    // super.#$memberof();
    this.$value.memberof = this.$pathResolver.filePath;
  }

  /** check generator property in self node */
  $generator() {
    // super.#$generator();
    this.$value.generator = this.$node.generator;
  }

  /**
   * use async property of self node.
   */
  $async() {
    // super.#$async();
    this.$value.async = this.$node.async;
  }
}
// exports.default = FunctionDoc;
