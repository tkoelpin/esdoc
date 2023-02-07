// Object.defineProperty(exports, "__esModule", {value: true});

import AbstractDoc from './AbstractDoc.js';
import MethodDoc from './MethodDoc.js';

// function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : {def: obj}; }

// const _AbstractDoc2 = _interopRequireDefault(_AbstractDoc);
// const _MethodDoc2 = _interopRequireDefault(_MethodDoc);


/**
 * Doc Class from ClassProperty AST node.
 */
export default class ClassPropertyDoc extends AbstractDoc {
  /**
   * apply own tag.
   * @private
   */
  $apply() {
    // super.$apply();

    Reflect.deleteProperty(this.$value, `export`);
    Reflect.deleteProperty(this.$value, `importPath`);
    Reflect.deleteProperty(this.$value, `importStyle`);
  }

  /** specify ``member`` to kind. */
  $kind() {
    // super.#$kind();
    this.$value.kind = `member`;
  }

  /** take out self name from self node */
  $name() {
    // super.#$name();
    this.$value.name = this.$node.key.name;
  }

  /** borrow {@link MethodDoc#@_memberof} */
  $memberof() {
    Reflect.apply(MethodDoc.prototype.$memberof, this, []);
  }
}
// exports.default = ClassPropertyDoc;
