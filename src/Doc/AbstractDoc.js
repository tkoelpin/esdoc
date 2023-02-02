// Object.defineProperty(exports, "__esModule", {value: true});

import babelGenerator from 'babel-generator';
import path from 'path';

import ASTNodeContainer from '../Util/ASTNodeContainer.js';
import ASTUtil from '../Util/ASTUtil.js';
import InvalidCodeLogger from '../Util/InvalidCodeLogger.js';
import ParamParser from '../Parser/ParamParser.js';

// function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : {def: obj}; }

// const babelGenerator2 = _interopRequireDefault(babelGenerator);
// const path2 = _interopRequireDefault(path);

// const _ParamParser2 = _interopRequireDefault(_ParamParser);
// const _ASTUtil2 = _interopRequireDefault(_ASTUtil);
// const _InvalidCodeLogger2 = _interopRequireDefault(_InvalidCodeLogger);
// const _ASTNodeContainer2 = _interopRequireDefault(_ASTNodeContainer);

/**
 * Abstract Doc Class.
 * @todo rename this class name.
 */
export default class AbstractDoc {
  $ast;

  $node;

  $pathResolver;

  $commentTags;

  $value;

  /**
   * create instance.
   * @param {AST} ast - this is AST that contains this doc.
   * @param {ASTNode} node - this is self node.
   * @param {PathResolver} pathResolver - this is file path resolver that contains this doc.
   * @param {Tag[]} commentTags - this is tags that self node has.
   */
  constructor(ast, node, pathResolver, commentTags = []) {
    this.$ast = ast;
    this.$node = node;
    this.$pathResolver = pathResolver;
    this.$commentTags = commentTags;
    this.$value = {};

    Reflect.defineProperty(this.$node, `doc`, {value: this});

    this.$value.__docId__ = ASTNodeContainer.addNode(node);

    this.$apply();
  }

  /** @type {DocObject[]} */
  get value() {
    return JSON.parse(JSON.stringify(this.$value));
  }

  /**
   * apply doc comment.
   * @protected
   */
  $apply() {
    this.$kind();
    this.$variation();
    this.$name();
    this.$memberof();
    this.$member();
    this.$content();
    this.$generator();
    this.$async();

    this.$static();
    this.$longname();
    this.$access();
    this.$export();
    this.$importPath();
    this.$importStyle();
    this.$desc();
    this.$example();
    this.$see();
    this.$lineNumber();
    this.$deprecated();
    this.$experimental();
    this.$since();
    this.$version();
    this.$todo();
    this.$ignore();
    this.$pseudoExport();
    this.$undocument();
    this.$unknown();
    this.$param();
    this.$property();
    this.$return();
    this.$type();
    this.$abstract();
    this.$override();
    this.$throws();
    this.$emits();
    this.$listens();
    this.$decorator();
  }

  /**
   * decide `kind`.
   * @abstract
   */
  $kind() {
    throw new Error(`Method '$kind()' must be implemented.`);
  }

  /** for @_variation */
  /**
   * decide `variation`.
   * @todo implements `@variation`.
   * @abstract
   */
  $variation() {
    throw new Error(`Method '$variation()' must be implemented.`);
  }

  /**
   * decide `name`
   * @abstract
   */
  $name() {
    throw new Error(`Method '$name()' must be implemented.`);
  }

  /**
   * decide `memberof`.
   * @abstract
   */
  $memberof() {
    throw new Error(`Method '$memberof()' must be implemented.`);
  }

  /**
   * decide `member`.
   * @abstract
   */
  $member() {
    throw new Error(`Method '$member()' must be implemented.`);
  }

  /**
   * decide `content`.
   * @abstract
   */
  $content() {
    throw new Error(`Method '$content()' must be implemented.`);
  }

  /**
   * decide `generator`.
   * @abstract
   */
  $generator() {
    throw new Error(`Method '$generator()' must be implemented.`);
  }

  /**
   * decide `async`.
   * @abstract
   */
  $async() {
    throw new Error(`Method '$async()' must be implemented.`);
  }

  /**
   * decide `static`.
   */
  $static() {
    if (`static` in this.$node) {
      this.$value[`static`] = this.$node[`static`];
    } else {
      this.$value[`static`] = true;
    }
  }

  /**
   * decide `longname`.
   */
  $longname() {
    const {memberof, name} = this.$value;
    const scope = this.$value[`static`] ? `.` : `#`;
    if (memberof.includes(`~`)) {
      this.$value.longname = `${memberof}${scope}${name}`;
    } else {
      this.$value.longname = `${memberof}~${name}`;
    }
  }

  /**
   * decide `access`.
   * process also @public, @private, @protected and @package.
   */
  $access() {
    const tag = this.find([`@access`, `@public`, `@private`, `@protected`, `@package`]);
    if (tag) {
      let access;
      /* eslint-disable max-statements-per-line */
      switch (tag.tagName) {
        case `@access`:
          access = tag.tagValue; break;
        case `@public`:
          access = `public`; break;
        case `@protected`:
          access = `protected`; break;
        case `@package`:
          access = `package`; break;
        case `@private`:
          access = `private`; break;
        default:
          throw new Error(`unexpected token: ${tag.tagName}`);
      }

      this.$value.access = access;
    } else {
      this.$value.access = null;
    }
  }

  /**
   * avoid unknown tag.
   */
  $public() {
    throw new Error(`Method '$public()' must be implemented.`);
  }

  /**
   * avoid unknown tag.
   */
  $protected() {
    throw new Error(`Method '$protected()' must be implemented.`);
  }

  /**
   * avoid unknown tag.
   */
  $private() {
    throw new Error(`Method '$private()' must be implemented.`);
  }

  /**
   * avoid unknown tag.
   */
  $package() {
    throw new Error(`Method '$package()' must be implemented.`);
  }

  /**
   * decide `export`.
   */
  $export() {
    let {parent} = this.$node;
    while (parent) {
      if (parent.type === `ExportDefaultDeclaration`) {
        this.$value[`export`] = true;
        return;
      } else if (parent.type === `ExportNamedDeclaration`) {
        this.$value[`export`] = true;
        return;
      }

      parent = parent.parent;
    }

    this.$value[`export`] = false;
  }

  /**
   * decide `importPath`.
   */
  $importPath() {
    this.$value.importPath = this.$pathResolver.importPath;
  }

  /**
   * decide `importStyle`.
   */
  $importStyle() {
    if (this.$node.__PseudoExport__) {
      this.$value.importStyle = null;
      return;
    }

    let {parent} = this.$node;
    const {name} = this.$value;
    while (parent) {
      if (parent.type === `ExportDefaultDeclaration`) {
        this.$value.importStyle = name;
        return;
      } else if (parent.type === `ExportNamedDeclaration`) {
        this.$value.importStyle = `{${name}}`;
        return;
      }
      parent = parent.parent;
    }

    this.$value.importStyle = null;
  }

  /**
   * decide `description`.
   */
  $desc() {
    this.$value.description = this.findTagValue([`@desc`]);
  }

  /**
   * decide `examples`.
   */
  $example() {
    const tags = this.findAll([`@example`]);
    if (!tags) return;
    if (!tags.length) return;

    this.$value.examples = [];
    for (const tag of tags) {
      this.$value.examples.push(tag.tagValue);
    }
  }

  /**
   * decide `see`.
   */
  $see() {
    const tags = this.findAll([`@see`]);
    if (!tags) return;
    if (!tags.length) return;

    this.$value.see = [];
    for (const tag of tags) {
      this.$value.see.push(tag.tagValue);
    }
  }

  /**
   * decide `lineNumber`.
   */
  $lineNumber() {
    const tag = this.find([`@lineNumber`]);
    if (tag) {
      this.$value.lineNumber = parseInt(tag.tagValue, 10);
    } else {
      const node = this.$node;
      if (node.loc) {
        this.$value.lineNumber = node.loc.start.line;
      }
    }
  }

  /**
   * decide `deprecated`.
   */
  $deprecated() {
    const tag = this.find([`@deprecated`]);
    if (tag) {
      if (tag.tagValue) {
        this.$value.deprecated = tag.tagValue;
      } else {
        this.$value.deprecated = true;
      }
    }
  }

  /**
   * decide `experimental`.
   */
  $experimental() {
    const tag = this.find([`@experimental`]);
    if (tag) {
      if (tag.tagValue) {
        this.$value.experimental = tag.tagValue;
      } else {
        this.$value.experimental = true;
      }
    }
  }

  /**
   * decide `since`.
   */
  $since() {
    const tag = this.find([`@since`]);
    if (tag) {
      this.$value.since = tag.tagValue;
    }
  }

  /**
   * decide `version`.
   */
  $version() {
    const tag = this.find([`@version`]);
    if (tag) {
      this.$value.version = tag.tagValue;
    }
  }

  /**
   * decide `todo`.
   */
  $todo() {
    const tags = this.findAll([`@todo`]);
    if (tags) {
      this.$value.todo = [];
      for (const tag of tags) {
        this.$value.todo.push(tag.tagValue);
      }
    }
  }

  /**
   * decide `ignore`.
   */
  $ignore() {
    const tag = this.find([`@ignore`]);
    if (tag) {
      this.$value.ignore = true;
    }
  }

  /**
   * decide `pseudoExport`.
   */
  $pseudoExport() {
    if (this.$node.__PseudoExport__) {
      this.$value.pseudoExport = true;
    }
  }

  /**
   * decide `undocument` with internal tag.
   */
  $undocument() {
    const tag = this.find([`@undocument`]);
    if (tag) {
      this.$value.undocument = true;
    }
  }

  /**
   * decide `unknown`.
   */
  $unknown() {
    for (const tag of this.$commentTags) {
      const methodName = tag.tagName.replace(/^[@]/u, `_$`);
      if (this[methodName]) continue;

      if (!this.$value.unknown) this.$value.unknown = [];
      this.$value.unknown.push(tag);
    }
  }

  /**
   * decide `param`.
   */
  $param() {
    const values = this.findAllTagValues([`@param`]);
    if (!values) return;

    this.$value.params = [];
    for (const value of values) {
      const {typeText, paramName, paramDesc} = ParamParser.parseParamValue(value);
      if (!typeText || !paramName) {
        InvalidCodeLogger.show(this.$pathResolver.fileFullPath, this.$node);
        continue;
      }
      const result = ParamParser.parseParam(typeText, paramName, paramDesc);
      this.$value.params.push(result);
    }
  }

  /**
   * decide `return`.
   */
  $return() {
    const value = this.findTagValue([`@return`, `@returns`]);
    if (!value) return;

    const {typeText, paramName, paramDesc} = ParamParser.parseParamValue(value, true, false, true);
    const result = ParamParser.parseParam(typeText, paramName, paramDesc);
    this.$value[`return`] = result;
  }

  /**
   * decide `property`.
   */
  $property() {
    const values = this.findAllTagValues([`@property`]);
    if (!values) return;

    this.$value.properties = [];
    for (const value of values) {
      const {typeText, paramName, paramDesc} = ParamParser.parseParamValue(value);
      const result = ParamParser.parseParam(typeText, paramName, paramDesc);
      this.$value.properties.push(result);
    }
  }

  /**
   * decide `type`.
   */
  $type() {
    const value = this.findTagValue([`@type`]);
    if (!value) return;

    const {typeText, paramName, paramDesc} = ParamParser.parseParamValue(value, true, false, false);
    const result = ParamParser.parseParam(typeText, paramName, paramDesc);
    this.$value.type = result;
  }

  /**
   * decide `abstract`.
   */
  $abstract() {
    const tag = this.find([`@abstract`]);
    if (tag) {
      this.$value[`abstract`] = true;
    }
  }

  /**
   * decide `override`.
   */
  $override() {
    const tag = this.find([`@override`]);
    if (tag) {
      this.$value.override = true;
    }
  }

  /**
   * decide `throws`.
   */
  $throws() {
    const values = this.findAllTagValues([`@throws`]);
    if (!values) return;

    this.$value[`throws`] = [];
    for (const value of values) {
      const {typeText, paramName, paramDesc} = ParamParser.parseParamValue(value, true, false, true);
      const result = ParamParser.parseParam(typeText, paramName, paramDesc);
      this.$value[`throws`].push({
        description: result.description,
        types:       result.types
      });
    }
  }

  /**
   * decide `emits`.
   */
  $emits() {
    const values = this.findAllTagValues([`@emits`]);
    if (!values) return;

    this.$value.emits = [];
    for (const value of values) {
      const {typeText, paramName, paramDesc} = ParamParser.parseParamValue(value, true, false, true);
      const result = ParamParser.parseParam(typeText, paramName, paramDesc);
      this.$value.emits.push({
        description: result.description,
        types:       result.types
      });
    }
  }

  /**
   * decide `listens`.
   */
  $listens() {
    const values = this.findAllTagValues([`@listens`]);
    if (!values) return;

    this.$value.listens = [];
    for (const value of values) {
      const {typeText, paramName, paramDesc} = ParamParser.parseParamValue(value, true, false, true);
      const result = ParamParser.parseParam(typeText, paramName, paramDesc);
      this.$value.listens.push({
        description: result.description,
        types:       result.types
      });
    }
  }

  /**
   * decide `decorator`.
   */
  $decorator() {
    if (!this.$node.decorators) return;

    this.$value.decorators = [];
    for (const decorator of this.$node.decorators) {
      const value = {};
      switch (decorator.expression.type) {
        case `Identifier`:
          value.name = decorator.expression.name;
          value.arguments = null;
          break;
        case `CallExpression`:
          value.name = (0, babelGenerator)(decorator.expression).code.replace(/[(][\S\s.]*/u, ``);
          value.arguments = (0, babelGenerator)(decorator.expression).code.replace(/^[^(]+/u, ``);
          break;
        case `MemberExpression`:
          value.name = (0, babelGenerator)(decorator.expression).code.replace(/[(][\S\s.]*/u, ``);
          value.arguments = null;
          break;
        default:
          throw new Error(`unknown decorator expression type: ${decorator.expression.type}`);
      }
      this.$value.decorators.push(value);
    }
  }

  /**
   * find all tags.
   * @param {string[]} names - tag names.
   * @returns {Tag[]|null} found tags.
   * @private
   */
  findAll(names) {
    const results = [];
    for (const tag of this.$commentTags) {
      if (names.includes(tag.tagName)) results.push(tag);
    }

    return results.length ? results : null;
  }

  /**
   * find last tag.
   * @param {string[]} names - tag names.
   * @returns {Tag|null} found tag.
   * @protected
   */
  find(names) {
    const results = this.findAll(names);
    return results && results.length ? results[results.length - 1] : null;
  }

  /**
   * find all tag values.
   * @param {string[]} names - tag names.
   * @returns {*[]|null} found values.
   * @private
   */
  findAllTagValues(names) {
    const tags = this.findAll(names);
    if (!tags) return null;

    const results = [];
    for (const tag of tags) {
      results.push(tag.tagValue);
    }

    return results;
  }

  /**
   * find ta value.
   * @param {string[]} names - tag names.
   * @returns {*|null} found value.
   * @private
   */
  findTagValue(names) {
    const tag = this.find(names);
    return tag ? tag.tagValue : null;
  }

  /**
   * resolve long name.
   * if the name relates import path, consider import path.
   * @param {string} name - identifier name.
   * @returns {string} resolved name.
   * @private
   */
  resolveLongname(name) {
    let longname;

    let importPath = ASTUtil.findPathInImportDeclaration(this.$ast, name);
    if (!importPath) return name;

    if (importPath.charAt(0) === `.` || importPath.charAt(0) === `/`) {
      if (!path.extname(importPath)) importPath += `.js`;

      const resolvedPath = this.$pathResolver.resolve(importPath);
      longname = `${resolvedPath}~${name}`;
    } else {
      longname = `${importPath}~${name}`;
    }

    return longname;
  }

  /**
   * flatten member expression property name.
   * if node structure is [foo [bar [baz [this] ] ] ], flatten is ``this.baz.bar.foo``
   * @param {ASTNode} node - target member expression node.
   * @returns {string} flatten property.
   * @private
   */
  flattenMemberExpression(node) {
    const results = [];
    let target = node;

    while (target) {
      if (target.type === `ThisExpression`) {
        results.push(`this`);
        break;
      } else if (target.type === `Identifier`) {
        results.push(target.name);
        break;
      } else if (target.type === `CallExpression`) {
        results.push(target.callee.name);
        break;
      } else {
        results.push(target.property.name);
        target = target.object;
      }
    }

    return results.reverse().join(`.`);
  }

  /**
   * find class in same file, import or external.
   * @param {string} className - target class name.
   * @returns {string} found class long name.
   * @private
   */
  findClassLongname(className) {
    // find in same file.
    for (const node of this.$ast.program.body) {
      if (![`ExportDefaultDeclaration`, `ExportNamedDeclaration`].includes(node.type)) continue;
      if (node.declaration && node.declaration.type === `ClassDeclaration` && node.declaration.id.name === className) {
        return `${this.$pathResolver.filePath}~${className}`;
      }
    }

    // find in import.
    const importPath = ASTUtil.findPathInImportDeclaration(this.$ast, className);
    if (importPath) return this.resolveLongname(className);

    // find in external
    return className;
  }
}
// exports.default = AbstractDoc;
