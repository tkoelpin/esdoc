// Object.defineProperty(exports, "__esModule", {value: true});

import babelGenerator from 'babel-generator';

import AbstractDoc from './AbstractDoc.js';
import MethodDoc from './MethodDoc.js';

// function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : {def: obj}; }

// var _babelGenerator2 = _interopRequireDefault(_babelGenerator);

// var _AbstractDoc2 = _interopRequireDefault(_AbstractDoc);
// var _MethodDoc2 = _interopRequireDefault(_MethodDoc);

/**
 * Doc Class from Member Expression AST node.
 */
export default class MemberDoc extends AbstractDoc {
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

  /** use static property in class */
  $static() {
    let {parent} = this.$node;
    while (parent) {
      if (parent.type === `ClassMethod`) {
        this.$value[`static`] = parent[`static`];
        break;
      }
      parent = parent.parent;
    }
  }

  /** take out self name from self node */
  $name() {
    let name;
    if (this.$node.left.computed) {
      const expression = (0, babelGenerator)(this.$node.left.property).code.replace(/^this/u, ``);
      name = `[${expression}]`;
    } else {
      name = this.flattenMemberExpression(this.$node.left).replace(/^this\./u, ``);
    }
    this.$value.name = name;
  }

  /** borrow {@link MethodDoc#@_memberof} */
  $memberof() {
    Reflect.apply(MethodDoc.prototype.$memberof, this, []);
  }
}
// exports.default = MemberDoc;
