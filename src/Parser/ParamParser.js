// Object.defineProperty(exports, "__esModule", {value: true});

import assert from 'assert';

// function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : {def: obj}; }

// const assert2 = _interopRequireDefault(assert);

/**
 * Param Type Parser class.
 */
export default class ParamParser {
  /**
   * parse param value.
   * @param {string} value - param value.
   * @param {boolean} [type=true] if true, contain param type.
   * @param {boolean} [name=true] if true, contain param name.
   * @param {boolean} [desc=true] if true, contain param description.
   * @return {{typeText: string, paramName: string, paramDesc: string}} parsed value.
   *
   * @example
   * let value = '{number} param - this is number param';
   * let {typeText, paramName, paramDesc} = ParamParser.parseParamValue(value);
   *
   * let value = '{number} this is number return value';
   * let {typeText, paramDesc} = ParamParser.parseParamValue(value, true, false, true);
   *
   * let value = '{number}';
   * let {typeText} = ParamParser.parseParamValue(value, true, false, false);
   */
  static parseParamValue(value, type = true, name = true, desc = true) {
    let newValue = value.trim();

    let match;
    let typeText = null;
    let paramName = null;
    let paramDesc = null;

    // e.g {number}
    if (type) {
      // ``@`` is special char in ``{@link foo}``
      const reg = /^\{([^@]*?)\}(\s+|$)/u;
      match = newValue.match(reg);
      if (match) {
        [, typeText] = match;
        newValue = newValue.replace(reg, ``);
      } else {
        typeText = `*`;
      }
    }

    // e.g. [p1=123]
    if (name) {
      if (newValue.charAt(0) === `[`) {
        paramName = ``;
        let counter = 0;
        for (const c of newValue) {
          paramName += c;
          if (c === `[`) counter++;
          if (c === `]`) counter--;
          if (counter === 0) break;
        }

        if (paramName) {
          newValue = newValue.substring(paramName.length).trim();
        }
      } else {
        match = newValue.match(/^(\S+)/u);
        if (match) {
          [, paramName] = match;
          newValue = newValue.replace(/^\S+\s*/u, ``);
        }
      }
    }

    // e.g. this is p1 desc.
    if (desc) {
      match = newValue.match(/^-?\s*((:?.|\n)*)$/mu);
      if (match) {
        [, paramDesc] = match;
      }
    }

    (0, assert)(typeText || paramName || paramDesc, `param is invalid. param = "${newValue}"`);

    return {
      paramDesc,
      paramName,
      typeText
    };
  }

  /**
   * parse param text and build formatted result.
   * @param {string} typeText - param type text.
   * @param {string} [paramName] - param name.
   * @param {string} [paramDesc] - param description.
   * @returns {ParsedParam} formatted result.
   *
   * @example
   * let value = '{number} param - this is number param';
   * let {typeText, paramName, paramDesc} = ParamParser.parseParamValue(value);
   * let result = ParamParser.parseParam(typeText, paramName, paramDesc);
   */
  static parseParam(typeText = null, paramName = null, paramDesc = null) {
    const result = {};

    if (typeText) {
      let newTypeText = typeText;

      // check nullable
      if (newTypeText[0] === `?`) {
        result.nullable = true;
      } else if (newTypeText[0] === `!`) {
        result.nullable = false;
      } else {
        result.nullable = null;
      }
      newTypeText = newTypeText.replace(/^[?!]/u, ``);

      // check record and union
      if (newTypeText[0] === `{`) {
        result.types = [newTypeText];
      } else if (newTypeText[0] === `(`) {
        newTypeText = newTypeText.replace(/^[(]/u, ``).replace(/[)]$/u, ``);
        result.types = newTypeText.split(`|`);
      } else if (newTypeText.includes(`|`)) {
        if (newTypeText.match(/<.*?\|.*?>/u)) {
          /*
           * union in generics. e.g. `Array<string|number>`
           * hack: in this case, process this type in DocBuilder#_buildTypeDocLinkHTML
           */
          result.types = [newTypeText];
        } else if (newTypeText.match(/^\.\.\.\(.*?\)/u)) {
          /*
           * union with spread. e.g. `...(string|number)`
           * hack: in this case, process this type in DocBuilder#_buildTypeDocLinkHTML
           */
          result.types = [newTypeText];
        } else {
          result.types = newTypeText.split(`|`);
        }
      } else {
        result.types = [newTypeText];
      }

      if (newTypeText.indexOf(`...`) === 0) {
        result.spread = true;
      } else {
        result.spread = false;
      }
    } else {
      result.types = [``];
    }

    if (result.types.some(t => !t)) {
      throw new Error(`Empty Type found name=${paramName} desc=${paramDesc}`);
    }

    if (paramName) {
      let newParamName = paramName;
      // check optional
      if (newParamName[0] === `[`) {
        result.optional = true;
        newParamName = newParamName.replace(/^[[]/u, ``).replace(/[\]]$/u, ``);
      } else {
        result.optional = false;
      }

      // check default value
      const pair = newParamName.split(`=`);
      if (pair.length === 2) {
        [, result.defaultValue] = pair;
        try {
          const raw = JSON.parse(pair[1]);
          result.defaultRaw = raw;
        } catch {
          [, result.defaultRaw] = pair;
        }
      }

      result.name = pair[0].trim();
    }

    result.description = paramDesc;

    return result;
  }
}
// exports.default = ParamParser;
