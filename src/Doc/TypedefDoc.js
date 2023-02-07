// Object.defineProperty(exports, "__esModule", {value: true});

import colorLogger from 'color-logger';

import AbstractDoc from './AbstractDoc.js';
import ParamParser from '../Parser/ParamParser.js';

// function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : {def: obj}; }

// var _colorLogger2 = _interopRequireDefault(_colorLogger);

// var _AbstractDoc2 = _interopRequireDefault(_AbstractDoc);
// var _ParamParser2 = _interopRequireDefault(_ParamParser);

/**
 * Doc class for virtual comment node of typedef.
 */
export default class TypedefDoc extends AbstractDoc {
  /**
   * apply own tag.
   * @private
   */
  $apply() {
    // super.$apply();

    this.$typedef();

    Reflect.deleteProperty(this.$value, `export`);
    Reflect.deleteProperty(this.$value, `importPath`);
    Reflect.deleteProperty(this.$value, `importStyle`);
  }

  /** specify ``typedef`` to kind. */
  $kind() {
    // super.#$kind();
    this.$value.kind = `typedef`;
  }

  /** set name by using tag. */
  $name() {
    const tags = this.$findAll([`@typedef`]);
    if (!tags) {
      colorLogger.w(`can not resolve name.`);
      return;
    }

    let name;
    for (const tag of tags) {
      const {paramName} = ParamParser.parseParamValue(tag.tagValue, true, true, false);
      name = paramName;
    }

    this.$value.name = name;
  }

  /** set memberof by using file path. */
  $memberof() {
    // super.#$memberof();

    let memberof;
    let {parent} = this.$node;
    while (parent) {
      if (parent.type === `ClassDeclaration`) {
        memberof = `${this.$pathResolver.filePath}~${parent.id.name}`;
        this.$value.memberof = memberof;
        return;
      }
      parent = parent.parent;
    }

    this.$value.memberof = this.$pathResolver.filePath;
  }

  /** for @typedef */
  $typedef() {
    const value = this.$findTagValue([`@typedef`]);
    if (!value) return;

    const {typeText, paramName, paramDesc} = ParamParser.parseParamValue(value, true, true, false);
    const result = ParamParser.parseParam(typeText, paramName, paramDesc);

    Reflect.deleteProperty(result, `description`);
    Reflect.deleteProperty(result, `nullable`);
    Reflect.deleteProperty(result, `spread`);

    this.$value.type = result;
  }
}
// exports.default = TypedefDoc;
