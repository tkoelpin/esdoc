// Object.defineProperty(exports, "__esModule", {value: true});

import babelGenerator from 'babel-generator';

import AbstractDoc from './AbstractDoc.js';

// function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : {def: obj}; }

// var _babelGenerator2 = _interopRequireDefault(_babelGenerator);
// var _AbstractDoc2 = _interopRequireDefault(_AbstractDoc);

/**
 * Doc Class from Method Definition AST node.
 */
export default class MethodDoc extends AbstractDoc {
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

  /** use kind property of self node. */
  $kind() {
    // super.#$kind();
    this.$value.kind = this.$node.kind;
  }

  /** take out self name from self node */
  $name() {
    // super.#$name();

    if (this.$node.computed) {
      const expression = (0, babelGenerator)(this.$node.key).code;
      this.$value.name = `[${expression}]`;
    } else {
      this.$value.name = this.$node.key.name;
    }
  }

  /** take out memberof from parent class node */
  $memberof() {
    // super.#$memberof();

    let memberof;
    let {parent} = this.$node;
    while (parent) {
      if (parent.type === `ClassDeclaration` || parent.type === `ClassExpression`) {
        memberof = `${this.$pathResolver.filePath}~${parent.doc.value.name}`;
        this.$value.memberof = memberof;
        return;
      }
      parent = parent.parent;
    }
  }

  /** use generator property of self node. */
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
// exports.default = MethodDoc;
