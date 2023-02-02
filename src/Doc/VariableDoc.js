// Object.defineProperty(exports, "__esModule", {value: true});

import AbstractDoc from './AbstractDoc.js';

// function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : {def: obj}; }

// const _AbstractDoc2 = _interopRequireDefault(_AbstractDoc);

/**
 * Doc Class from Variable Declaration AST node.
 */
export default class VariableDoc extends AbstractDoc {
  /** specify ``variable`` to kind. */
  $kind() {
    // super.#$kind();
    this.$value.kind = `variable`;
  }

  /** set name by using self node. */
  $name() {
    // super.#$name();

    const {type} = this.$node.declarations[0].id;
    switch (type) {
      case `Identifier`:
        this.$value.name = this.$node.declarations[0].id.name;
        break;
      case `ObjectPattern`:
        // TODO: optimize for multi variables.
        // e.g. export const {a, b} = obj
        this.$value.name = this.$node.declarations[0].id.properties[0].key.name;
        break;
      case `ArrayPattern`:
        // TODO: optimize for multi variables.
        // e.g. export cont [a, b] = arr
        this.$value.name = this.$node.declarations[0].id.elements.find(v => v).name;
        break;
      default:
        throw new Error(`unknown declarations type: ${type}`);
    }
  }

  /** set memberof by using file path. */
  $memberof() {
    // super.#$memberof();
    this.$value.memberof = this.$pathResolver.filePath;
  }
}
// exports.default = VariableDoc;
