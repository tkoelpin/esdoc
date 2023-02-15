import fs from 'node:fs';

import AbstractDoc from './AbstractDoc.js';
import NamingUtil from '../Util/NamingUtil.js';
import ParamParser from '../Parser/ParamParser.js';

/**
 * Doc Class from Class Declaration AST node.
 */
export default class ClassDoc extends AbstractDoc {
  /**
   * apply own tag.
   * @private
   */
  $apply() {
    // super.$apply();

    this.$interface();
    this.$extends();
    this.$implements();
  }

  /** specify ``class`` to kind. */
  $kind() {
    // super.#$kind();
    this.$value.kind = `class`;
  }

  /** take out self name from self node */
  $name() {
    // super.#$name();

    if (this.$node.id) {
      this.$value.name = this.$node.id.name;
    } else {
      this.$value.name = NamingUtil.filePathToName(this.$pathResolver.filePath);
    }
  }

  /** take out self memberof from file path. */
  $memberof() {
    // super.#$memberof();
    this.$value.memberof = this.$pathResolver.filePath;
  }

  /** for @interface */
  $interface() {
    const tag = this.find([`@interface`]);
    if (tag) {
      this.$value[`interface`] = [``, `true`, true].includes(tag.tagValue);
    } else {
      this.$value[`interface`] = false;
    }
  }

  /** for @extends, does not need to use this tag. */
  $extends() {
    const values = this.findAllTagValues([`@extends`, `@extend`]);
    if (values) {
      this.$value[`extends`] = [];
      for (const value of values) {
        const {typeText} = ParamParser.parseParamValue(value, true, false, false);
        this.$value[`extends`].push(typeText);
      }
      return;
    }

    if (this.$node.superClass) {
      const node = this.$node;
      let longnames = [];
      const targets = [];

      if (node.superClass.type === `CallExpression`) {
        targets.push(node.superClass.callee, ...node.superClass.arguments);
      } else {
        targets.push(node.superClass);
      }

      for (const target of targets) {
        /* eslint-disable default-case */
        switch (target.type) {
          case `Identifier`:
            longnames.push(this.resolveLongname(target.name));
            break;
          case `MemberExpression`:
            {
              const fullIdentifier = this.flattenMemberExpression(target);
              const [rootIdentifier] = fullIdentifier.split(`.`);
              const rootLongname = this.resolveLongname(rootIdentifier);
              const filePath = rootLongname.replace(/~.*/u, ``);
              longnames.push(`${filePath}~${fullIdentifier}`);
            }
            break;
        }
      }

      if (node.superClass.type === `CallExpression`) {
        // expression extends may have non-class, so filter only class by name rule.
        longnames = longnames.filter(v => v.match(/^[A-Z]|^[$_][A-Z]/u));

        const filePath = this.$pathResolver.fileFullPath;
        const {line} = node.superClass.loc.start;
        const start = node.superClass.loc.start.column;
        const end = node.superClass.loc.end.column;
        this.$value.expressionExtends = this.readSelection(filePath, line, start, end);
      }

      if (longnames.length) this.$value[`extends`] = longnames;
    }
  }

  /** for @implements */
  $implements() {
    const values = this.findAllTagValues([`@implements`, `@implement`]);
    if (!values) return;

    this.$value[`implements`] = [];
    for (const value of values) {
      const {typeText} = ParamParser.parseParamValue(value, true, false, false);
      this.$value[`implements`].push(typeText);
    }
  }

  /**
   * read selection text in file.
   * @param {string} filePath - target file full path.
   * @param {number} line - line number (one origin).
   * @param {number} startColumn - start column number (one origin).
   * @param {number} endColumn - end column number (one origin).
   * @returns {string} selection text
   * @private
   */
  readSelection(filePath, line, startColumn, endColumn) {
    const code = fs.readFileSync(filePath).toString();
    const lines = code.split(`\n`);
    const selectionLine = lines[line - 1];
    const tmp = [];
    for (let i = startColumn; i < endColumn; i++) {
      tmp.push(selectionLine.charAt(i));
    }
    return tmp.join(``);
  }
}
// exports.default = ClassDoc;
