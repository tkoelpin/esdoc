// Object.defineProperty(exports, "__esModule", {value: true});

import AbstractDoc from './AbstractDoc.js';

// var _AbstractDoc2 = _interopRequireDefault(_AbstractDoc);

// function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : {def: obj}; }

/**
 * Doc Class for Assignment AST node.
 */
export default class AssignmentDoc extends AbstractDoc {
  /**
   * specify ``variable`` to kind.
   */
  $kind() {
    // super.#$kind();
    this.$value.kind = `variable`;
  }

  /**
   * take out self name from self node.
   */
  $name() {
    // super.#$name();
    const name = this.flattenMemberExpression(this.$node.left).replace(/^this\./u, ``);
    this.$value.name = name;
  }

  /**
   * take out self memberof from file path.
   */
  $memberof() {
    // super.#$memberof();
    this.$value.memberof = this.$pathResolver.filePath;
  }
}
// exports.default = AssignmentDoc;
