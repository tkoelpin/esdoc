import babelParser from '@babel/parser';
import fs from 'node:fs';

import Plugin from '../Plugin/Plugin.js';

// function _interopRequireWildcard(obj) {
//   let result;

//   if (obj && obj.__esModule) {
//     result = obj;
//   } else {
//     const newObj = {};

//     if (obj !== null) {
//       for (const key in obj) {
//         if (Object.hasOwn(obj, key)) newObj[key] = obj[key];
//       }
//     }

//     newObj.def = obj;
//     result = newObj;
//   }

//   return result;
// }

/**
 * ECMAScript Parser class.
 *
 * @example
 * let ast = ESParser.parse('./src/foo.js');
 */
export default class ESParser {
  /**
   * parse ECMAScript source code.
   * @param {string} filePath - source code file path.
   * @returns {AST} AST of source code.
   */
  static parse(filePath) {
    let code = fs.readFileSync(filePath, {encode: `utf8`}).toString();
    code = Plugin.onHandleCode(code, filePath);
    if (code.charAt(0) === `#`) code = code.replace(/^#!/u, `//`);

    let parserOption = {
      plugins:    [],
      sourceType: `module`
    };
    let parser = code => babelParser.parse(code, parserOption);

    ({parser, parserOption} = Plugin.onHandleCodeParser(parser, parserOption, filePath, code));

    let ast = parser(code);

    ast = Plugin.onHandleAST(ast, filePath, code);

    return ast;
  }
}
