// Object.defineProperty(exports, "__esModule", {value: true});

import colorLogger from 'color-logger';

import AssignmentDoc from '../Doc/AssignmentDoc.js';
import ASTUtil from '../Util/ASTUtil.js';
import ClassDoc from '../Doc/ClassDoc.js';
import ClassPropertyDoc from '../Doc/ClassPropertyDoc.js';
import CommentParser from '../Parser/CommentParser.js';
import ExternalDoc from '../Doc/ExternalDoc.js';
import FileDoc from '../Doc/FileDoc.js';
import FunctionDoc from '../Doc/FunctionDoc.js';
import MemberDoc from '../Doc/MemberDoc.js';
import MethodDoc from '../Doc/MethodDoc.js';
import TypedefDoc from '../Doc/TypedefDoc.js';
import VariableDoc from '../Doc/VariableDoc.js';

// function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : {def: obj}; }

// const _AssignmentDoc2 = _interopRequireDefault(_AssignmentDoc);
// const _ASTUtil2 = _interopRequireDefault(_ASTUtil);
// const _ClassDoc2 = _interopRequireDefault(_ClassDoc);
// const _ClassPropertyDoc2 = _interopRequireDefault(_ClassPropertyDoc);
// const _colorLogger2 = _interopRequireDefault(_colorLogger);
// const _CommentParser2 = _interopRequireDefault(_CommentParser);
// const _ExternalDoc2 = _interopRequireDefault(_ExternalDoc);
// const _FileDoc2 = _interopRequireDefault(_FileDoc);
// const _FunctionDoc2 = _interopRequireDefault(_FunctionDoc);
// const _MemberDoc2 = _interopRequireDefault(_MemberDoc);
// const _MethodDoc2 = _interopRequireDefault(_MethodDoc);
// const _TypedefDoc2 = _interopRequireDefault(_TypedefDoc);
// const _VariableDoc2 = _interopRequireDefault(_VariableDoc);

const already = Symbol(`already`);

/**
 * Doc factory class.
 *
 * @example
 * let factory = new DocFactory(ast, pathResolver);
 * factory.push(node, parentNode);
 * let results = factory.results;
 */
export default class DocFactory {
  #results;

  #ast;

  #pathResolver;

  #processedClassNodes;

  #decideType;

  /**
   * @type {DocObject[]}
   */
  get results() {
    return [...this.#results];
  }

  /**
   * create instance.
   * @param {AST} ast - AST of source code.
   * @param {PathResolver} pathResolver - path resolver of source code.
   */
  constructor(ast, pathResolver) {
    this.#ast = ast;
    this.#pathResolver = pathResolver;
    this.#results = [];
    this.#processedClassNodes = [];

    this.#inspectExportDefaultDeclaration();
    this.#inspectExportNamedDeclaration();

    // file doc
    const doc = new FileDoc(ast, ast, pathResolver, []);
    this.#results.push(doc.value);

    // ast does not child, so only comment.
    if (ast.program.body.length === 0 && ast.program.innerComments) {
      const results = this.#traverseComments(ast, null, ast.program.innerComments);
      this.#results.push(...results);
    }
  }

  /**
   * inspect ExportDefaultDeclaration.
   *
   * case1: separated export
   *
   * ```javascript
   * class Foo {}
   * export default Foo;
   * ```
   *
   * case2: export instance(directly).
   *
   * ```javascript
   * class Foo {}
   * export default new Foo();
   * ```
   *
   * case3: export instance(indirectly).
   *
   * ```javascript
   * class Foo {}
   * let foo = new Foo();
   * export default foo;
   * ```
   *
   * @private
   * @todo support function export.
   */
  #inspectExportDefaultDeclaration() {
    const pseudoExportNodes = [];

    for (const exportNode of this.#ast.program.body) {
      if (exportNode.type !== `ExportDefaultDeclaration`) continue;

      let targetClassName = null;
      let targetVariableName = null;
      let pseudoClassExport;

      switch (exportNode.declaration.type) {
        case `NewExpression`:
          if (exportNode.declaration.callee.type === `Identifier`) {
            targetClassName = exportNode.declaration.callee.name;
          } else if (exportNode.declaration.callee.type === `MemberExpression`) {
            targetClassName = exportNode.declaration.callee.property.name;
          } else {
            targetClassName = ``;
          }
          targetVariableName = targetClassName.replace(/^./u, c => c.toLowerCase());
          pseudoClassExport = true;
          break;
        case `Identifier`:
        {
          const varNode = ASTUtil.findVariableDeclarationAndNewExpressionNode(exportNode.declaration.name, this.#ast);
          if (varNode) {
            targetClassName = varNode.declarations[0].init.callee.name;
            targetVariableName = exportNode.declaration.name;
            pseudoClassExport = true;
            ASTUtil.sanitize(varNode);
          } else {
            targetClassName = exportNode.declaration.name;
            pseudoClassExport = false;
          }
          break;
        }
        default:
          colorLogger.w(`unknown export declaration type. type = "${exportNode.declaration.type}"`);
          break;
      }

      const {classNode, exported} = ASTUtil.findClassDeclarationNode(targetClassName, this.#ast);
      if (classNode) {
        if (!exported) {
          const pseudoExportNode1 = this.#copy(exportNode);
          pseudoExportNode1.declaration = this.#copy(classNode);
          pseudoExportNode1.leadingComments = null;
          pseudoExportNode1.declaration.__PseudoExport__ = pseudoClassExport;
          pseudoExportNodes.push(pseudoExportNode1);
          ASTUtil.sanitize(classNode);
        }

        if (targetVariableName) {
          const pseudoExportNode2 = this.#copy(exportNode);
          pseudoExportNode2.declaration = ASTUtil.createVariableDeclarationAndNewExpressionNode(targetVariableName, targetClassName, exportNode.loc);
          pseudoExportNodes.push(pseudoExportNode2);
        }

        ASTUtil.sanitize(exportNode);
      }

      const functionNode = ASTUtil.findFunctionDeclarationNode(exportNode.declaration.name, this.#ast);
      if (functionNode) {
        const pseudoExportNode = this.#copy(exportNode);
        pseudoExportNode.declaration = this.#copy(functionNode);
        ASTUtil.sanitize(exportNode);
        ASTUtil.sanitize(functionNode);
        pseudoExportNodes.push(pseudoExportNode);
      }

      const variableNode = ASTUtil.findVariableDeclarationNode(exportNode.declaration.name, this.#ast);
      if (variableNode) {
        const pseudoExportNode = this.#copy(exportNode);
        pseudoExportNode.declaration = this.#copy(variableNode);
        ASTUtil.sanitize(exportNode);
        ASTUtil.sanitize(variableNode);
        pseudoExportNodes.push(pseudoExportNode);
      }
    }

    this.#ast.program.body.push(...pseudoExportNodes);
  }

  /* eslint-disable max-statements */
  /**
   * inspect ExportNamedDeclaration.
   *
   * case1: separated export
   *
   * ```javascript
   * class Foo {}
   * export {Foo};
   * ```
   *
   * case2: export instance(indirectly).
   *
   * ```javascript
   * class Foo {}
   * let foo = new Foo();
   * export {foo};
   * ```
   *
   * @private
   * @todo support function export.
   */
  #inspectExportNamedDeclaration() {
    const pseudoExportNodes = [];

    for (const exportNode of this.#ast.program.body) {
      if (exportNode.type !== `ExportNamedDeclaration`) continue;

      if (exportNode.declaration && exportNode.declaration.type === `VariableDeclaration`) {
        for (const declaration of exportNode.declaration.declarations) {
          if (!declaration.init || declaration.init.type !== `NewExpression`) continue;

          const {classNode, exported} = ASTUtil.findClassDeclarationNode(declaration.init.callee.name, this.#ast);
          if (classNode && !exported) {
            const pseudoExportNode = this.#copy(exportNode);
            pseudoExportNode.declaration = this.#copy(classNode);
            pseudoExportNode.leadingComments = null;
            pseudoExportNodes.push(pseudoExportNode);
            pseudoExportNode.declaration.__PseudoExport__ = true;
            ASTUtil.sanitize(classNode);
          }
        }
        continue;
      }

      for (const specifier of exportNode.specifiers) {
        if (specifier.type !== `ExportSpecifier`) continue;

        let targetClassName = null;
        let pseudoClassExport;

        const varNode = ASTUtil.findVariableDeclarationAndNewExpressionNode(specifier.exported.name, this.#ast);
        if (varNode) {
          targetClassName = varNode.declarations[0].init.callee.name;
          pseudoClassExport = true;

          const pseudoExportNode = this.#copy(exportNode);
          pseudoExportNode.declaration = this.#copy(varNode);
          pseudoExportNode.specifiers = null;
          pseudoExportNodes.push(pseudoExportNode);

          ASTUtil.sanitize(varNode);
        } else {
          targetClassName = specifier.exported.name;
          pseudoClassExport = false;
        }

        const {classNode, exported} = ASTUtil.findClassDeclarationNode(targetClassName, this.#ast);
        if (classNode && !exported) {
          const pseudoExportNode = this.#copy(exportNode);
          pseudoExportNode.declaration = this.#copy(classNode);
          pseudoExportNode.leadingComments = null;
          pseudoExportNode.specifiers = null;
          pseudoExportNode.declaration.__PseudoExport__ = pseudoClassExport;
          pseudoExportNodes.push(pseudoExportNode);
          ASTUtil.sanitize(classNode);
        }

        const functionNode = ASTUtil.findFunctionDeclarationNode(specifier.exported.name, this.#ast);
        if (functionNode) {
          const pseudoExportNode = this.#copy(exportNode);
          pseudoExportNode.declaration = this.#copy(functionNode);
          pseudoExportNode.leadingComments = null;
          pseudoExportNode.specifiers = null;
          ASTUtil.sanitize(functionNode);
          pseudoExportNodes.push(pseudoExportNode);
        }

        const variableNode = ASTUtil.findVariableDeclarationNode(specifier.exported.name, this.#ast);
        if (variableNode) {
          const pseudoExportNode = this.#copy(exportNode);
          pseudoExportNode.declaration = this.#copy(variableNode);
          pseudoExportNode.leadingComments = null;
          pseudoExportNode.specifiers = null;
          ASTUtil.sanitize(variableNode);
          pseudoExportNodes.push(pseudoExportNode);
        }
      }
    }

    this.#ast.program.body.push(...pseudoExportNodes);
  }

  /**
   * push node, and factory processes node.
   * @param {ASTNode} node - target node.
   * @param {ASTNode} parentNode - parent node of target node.
   */
  push(node, parentNode) {
    let newNode = node;
    let newParentNode = parentNode;

    if (newNode === this.#ast) return;

    if (newNode[already]) return;

    const isLastNodeInParent = this.#isLastNodeInParent(newNode, newParentNode);

    newNode[already] = true;
    Reflect.defineProperty(newNode, `parent`, {value: newParentNode});

    // unwrap export declaration
    if ([`ExportDefaultDeclaration`, `ExportNamedDeclaration`].includes(newNode.type)) {
      newParentNode = newNode;
      newNode = this.#unwrapExportDeclaration(newNode);
      if (!newNode) return;
      newNode[already] = true;
      Reflect.defineProperty(newNode, `parent`, {value: newParentNode});
    }

    // if newNode has decorators, leading comments is attached to decorators.
    if (newNode.decorators && newNode.decorators[0].leadingComments) {
      if (!newNode.leadingComments || !newNode.leadingComments.length) {
        newNode.leadingComments = newNode.decorators[0].leadingComments;
      }
    }

    let results = this.#traverseComments(newParentNode, newNode, newNode.leadingComments);
    this.#results.push(...results);

    // for trailing comments.
    // traverse with only last newNode, because prevent duplication of trailing comments.
    if (newNode.trailingComments && isLastNodeInParent) {
      results = this.#traverseComments(newParentNode, null, newNode.trailingComments);
      this.#results.push(...results);
    }
  }

  /**
   * traverse comments of node, and create doc object.
   * @param {ASTNode|AST} parentNode - parent of target node.
   * @param {?ASTNode} node - target node.
   * @param {ASTNode[]} comments - comment nodes.
   * @returns {DocObject[]} created doc objects.
   * @private
   */
  #traverseComments(parentNode, node, comments) {
    let newNode = node;
    let newComments = comments;

    if (!newNode) {
      const virtualNode = {};
      Reflect.defineProperty(virtualNode, `parent`, {value: parentNode});
      newNode = virtualNode;
    }

    if (newComments && newComments.length) {
      const temp = [];
      for (const comment of newComments) {
        if (CommentParser.isESDoc(comment)) temp.push(comment);
      }
      newComments = temp;
    } else {
      newComments = [];
    }

    if (newComments.length === 0) {
      newComments = [{type: `CommentBlock`, value: `* @undocument`}];
    }

    const results = [];
    const lastComment = newComments[newComments.length - 1];
    for (const comment of newComments) {
      const tags = CommentParser.parse(comment);

      let doc;
      if (comment === lastComment) {
        doc = this.#createDoc(newNode, tags);
      } else {
        const virtualNode = {};
        Reflect.defineProperty(virtualNode, `parent`, {value: parentNode});
        doc = this.#createDoc(virtualNode, tags);
      }

      if (doc) results.push(doc.value);
    }

    return results;
  }

  /**
   * create Doc.
   * @param {ASTNode} node - target node.
   * @param {Tag[]} tags - tags of target node.
   * @returns {AbstractDoc} created Doc.
   * @private
   */
  #createDoc(node, tags) {
    const result = this.#decideType(tags, node);
    const {type} = result;

    const newNode = result.node;

    if (!type) return null;

    if (type === `Class`) {
      this.#processedClassNodes.push(newNode);
    }

    let Clazz;
    /* eslint-disable max-statements-per-line */
    switch (type) {
      case `Class`:
        Clazz = ClassDoc; break;
      case `Method`:
        Clazz = MethodDoc; break;
      case `ClassProperty`:
        Clazz = ClassPropertyDoc; break;
      case `Member`:
        Clazz = MemberDoc; break;
      case `Function`:
        Clazz = FunctionDoc; break;
      case `Variable`:
        Clazz = VariableDoc; break;
      case `Assignment`:
        Clazz = AssignmentDoc; break;
      case `Typedef`:
        Clazz = TypedefDoc; break;
      case `External`:
        Clazz = ExternalDoc; break;
      default:
        throw new Error(`unexpected type: ${type}`);
    }

    if (!Clazz) return null;
    if (!newNode.type) newNode.type = type;

    return new Clazz(this.#ast, newNode, this.#pathResolver, tags);
  }

  /**
   * decide Doc type by using tags and node.
   * @param {Tag[]} tags - tags of node.
   * @param {ASTNode} node - target node.
   * @returns {{type: ?string, node: ?ASTNode}} decided type.
   * @private
   */
  _decideType(tags, node) {
    let type = null;
    for (const tag of tags) {
      const tagName = tag.tagName;
      /* eslint-disable default-case */
      switch (tagName) {
        case `@typedef`:
          type = `Typedef`; break;
        case `@external`:
          type = `External`; break;
      }
    }

    if (type) {
      return {
        node,
        type
      };
    }

    if (!node) {
      return {
        node,
        type
      };
    }

    /* eslint-disable default-case */
    switch (node.type) {
      case `ClassDeclaration`:
        return this.#decideClassDeclarationType(node);
      case `ClassMethod`:
        return this.#decideMethodDefinitionType(node);
      case `ClassProperty`:
        return this.#decideClassPropertyType(node);
      case `ExpressionStatement`:
        return this.#decideExpressionStatementType(node);
      case `FunctionDeclaration`:
        return this.#decideFunctionDeclarationType(node);
      case `FunctionExpression`:
        return this.#decideFunctionExpressionType(node);
      case `VariableDeclaration`:
        return this.#decideVariableType(node);
      case `AssignmentExpression`:
        return this.#decideAssignmentType(node);
      case `ArrowFunctionExpression`:
        return this.#decideArrowFunctionExpressionType(node);
    }

    return {
      node: null,
      type: null
    };
  }

  /**
   * decide Doc type from class declaration node.
   * @param {ASTNode} node - target node that is class declaration node.
   * @returns {{type: string, node: ASTNode}} decided type.
   * @private
   */
  #decideClassDeclarationType(node) {
    if (!this.#isTopDepthInBody(node, this.#ast.program.body)) {
      return {
        node: null,
        type: null
      };
    }

    return {
      node,
      type: `Class`
    };
  }

  /**
   * decide Doc type from method definition node.
   * @param {ASTNode} node - target node that is method definition node.
   * @returns {{type: ?string, node: ?ASTNode}} decided type.
   * @private
   */
  #decideMethodDefinitionType(node) {
    const classNode = this.#findUp(node, [`ClassDeclaration`, `ClassExpression`]);
    let resultNode, resultType;

    if (this.#processedClassNodes.includes(classNode)) {
      resultNode = node;
      resultType = `Method`;
    } else {
      colorLogger.w(`this method is not in class`, node);
      resultNode = null;
      resultType = null;
    }

    return {
      node: resultNode,
      type: resultType
    };
  }

  /**
   * decide Doc type from class property node.
   * @param {ASTNode} node - target node that is classs property node.
   * @returns {{type: ?string, node: ?ASTNode}} decided type.
   * @private
   */
  #decideClassPropertyType(node) {
    const classNode = this.#findUp(node, [`ClassDeclaration`, `ClassExpression`]);
    const isClassNodeProcessed = this.#processedClassNodes.includes(classNode);

    const resultNode = isClassNodeProcessed ? node : null;
    const resultType = isClassNodeProcessed ? `ClassProperty` : null;

    if (!isClassNodeProcessed) colorLogger.w(`this class property is not in class`, node);

    return {node: resultNode, type: resultType};
  }

  /**
   * decide Doc type from function declaration node.
   * @param {ASTNode} node - target node that is function declaration node.
   * @returns {{type: string, node: ASTNode}} decided type.
   * @private
   */
  #decideFunctionDeclarationType(node) {
    if (!this.#isTopDepthInBody(node, this.#ast.program.body)) {
      return {
        node: null,
        type: null
      };
    }

    return {
      node,
      type: `Function`
    };
  }

  /**
   * decide Doc type from function expression node.
   * babylon 6.11.2 judges`export default async function foo(){}` to be `FunctionExpression`.
   * I expect `FunctionDeclaration`. this behavior may be bug of babylon.
   * for now, workaround for it with this method.
   * @param {ASTNode} node - target node that is function expression node.
   * @returns {{type: string, node: ASTNode}} decided type.
   * @private
   * @todo inspect with newer babylon.
   */
  #decideFunctionExpressionType(node) {
    if (!node.async) {
      return {
        node: null,
        type: null
      };
    }
    if (!this.#isTopDepthInBody(node, this.#ast.program.body)) {
      return {
        node: null,
        type: null
      };
    }

    return {
      node,
      type: `Function`
    };
  }

  /**
   * decide Doc type from arrow function expression node.
   * @param {ASTNode} node - target node that is arrow function expression node.
   * @returns {{type: string, node: ASTNode}} decided type.
   * @private
   */
  #decideArrowFunctionExpressionType(node) {
    if (!this.#isTopDepthInBody(node, this.#ast.program.body)) {
      return {
        node: null,
        type: null
      };
    }

    return {
      node,
      type: `Function`
    };
  }

  /**
   * decide Doc type from expression statement node.
   * @param {ASTNode} node - target node that is expression statement node.
   * @returns {{type: ?string, node: ?ASTNode}} decided type.
   * @private
   */
  #decideExpressionStatementType(node) {
    let newNode = node;

    const isTop = this.#isTopDepthInBody(newNode, this.#ast.program.body);
    Reflect.defineProperty(newNode.expression, `parent`, {value: newNode});
    newNode = newNode.expression;
    newNode[already] = true;

    let innerNode, innerType;

    if (!newNode.right) {
      return {
        newNode: null,
        type:    null
      };
    }

    let resultNode = null;
    let resultType = null;

    switch (newNode.right.type) {
      case `FunctionExpression`:
        innerType = `Function`;
        break;
      case `ClassExpression`:
        innerType = `Class`;
        break;
      default:
        if (newNode.left.type === `MemberExpression` && newNode.left.object.type === `ThisExpression`) {
          const classNode = this.#findUp(newNode, [`ClassExpression`, `ClassDeclaration`]);

          resultNode = newNode;
          resultType = `Member`;

          if (!this.#processedClassNodes.includes(classNode)) {
            colorLogger.w(`this member is not in class.`, this.#pathResolver.filePath, newNode);

            resultNode = null;
            resultType = null;
          }
        }

        return {
          newNode: resultNode,
          type:    resultType
        };
    }

    if (!isTop) {
      return {
        newNode: null,
        type:    null
      };
    }

    /* eslint-disable prefer-const */
    innerNode = newNode.right;
    innerNode.id = this.#copy(newNode.left.id || newNode.left.property);
    Reflect.defineProperty(innerNode, `parent`, {value: newNode});
    innerNode[already] = true;

    return {
      newNode: innerNode,
      type:    innerType
    };
  }

  /**
   * decide Doc type from variable node.
   * @param {ASTNode} node - target node that is variable node.
   * @returns {{type: string, node: ASTNode}} decided type.
   * @private
   */
  #decideVariableType(node) {
    if (!this.#isTopDepthInBody(node, this.#ast.program.body)) {
      return {
        node: null,
        type: null
      };
    }

    let innerType = null;
    let innerNode = null;

    if (!node.declarations[0].init) {
      return {
        node: innerNode,
        type: innerType
      };
    }

    switch (node.declarations[0].init.type) {
      case `FunctionExpression`:
        innerType = `Function`;
        break;
      case `ClassExpression`:
        innerType = `Class`;
        break;
      case `ArrowFunctionExpression`:
        innerType = `Function`;
        break;
      default:
        return {
          node,
          type: `Variable`
        };
    }

    innerNode = node.declarations[0].init;
    innerNode.id = this.#copy(node.declarations[0].id);
    Reflect.defineProperty(innerNode, `parent`, {value: node});
    innerNode[already] = true;

    return {
      node: innerNode,
      type: innerType
    };
  }

  /**
   * decide Doc type from assignment node.
   * @param {ASTNode} node - target node that is assignment node.
   * @returns {{type: string, node: ASTNode}} decided type.
   * @private
   */
  #decideAssignmentType(node) {
    if (!this.#isTopDepthInBody(node, this.#ast.program.body)) {
      return {
        node: null,
        type: null
      };
    }

    let innerNode, innerType;

    switch (node.right.type) {
      case `FunctionExpression`:
        innerType = `Function`;
        break;
      case `ClassExpression`:
        innerType = `Class`;
        break;
      default:
        return {
          node,
          type: `Assignment`
        };
    }

    /* eslint-disable prefer-const */
    innerNode = node.right;
    innerNode.id = this.#copy(node.left.id || node.left.property);
    Reflect.defineProperty(innerNode, `parent`, {value: node});
    innerNode[already] = true;

    return {
      node: innerNode,
      type: innerType
    };
  }

  /**
   * unwrap exported node.
   * @param {ASTNode} node - target node that is export declaration node.
   * @returns {ASTNode|null} unwrapped child node of exported node.
   * @private
   */
  #unwrapExportDeclaration(node) {
    // e.g. `export A from `./A.js`` has not declaration
    if (!node.declaration) return null;

    const exportedASTNode = node.declaration;
    if (!exportedASTNode.leadingComments) exportedASTNode.leadingComments = [];
    exportedASTNode.leadingComments.push(...(node.leadingComments || []));

    if (!exportedASTNode.trailingComments) exportedASTNode.trailingComments = [];
    exportedASTNode.trailingComments.push(...(node.trailingComments || []));

    return exportedASTNode;
  }

  /**
   * judge node is last in parent.
   * @param {ASTNode} node - target node.
   * @param {ASTNode} parentNode - target parent node.
   * @returns {boolean} if true, the node is last in parent.
   * @private
   */
  #isLastNodeInParent(node, parentNode) {
    if (parentNode && parentNode.body) {
      const lastNode = parentNode.body[parentNode.body.length - 1];
      return node === lastNode;
    }

    return false;
  }

  /**
   * judge node is top in body.
   * @param {ASTNode} node - target node.
   * @param {ASTNode[]} body - target body node.
   * @returns {boolean} if true, the node is top in body.
   * @private
   */
  #isTopDepthInBody(node, body) {
    let newNode = node;

    if (!body) return false;
    if (!Array.isArray(body)) return false;

    const parentNode = newNode.parent;
    if ([`ExportDefaultDeclaration`, `ExportNamedDeclaration`].includes(parentNode.type)) {
      newNode = parentNode;
    }

    for (const _node of body) {
      if (newNode === _node) return true;
    }
    return false;
  }

  /**
   * deep copy object.
   * @param {Object} obj - target object.
   * @return {Object} copied object.
   * @private
   */
  #copy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * find node while goes up.
   * @param {ASTNode} node - start node.
   * @param {string[]} types - ASTNode types.
   * @returns {ASTNode|null} found first node.
   * @private
   */
  #findUp(node, types) {
    let {parent} = node;
    while (parent) {
      if (types.includes(parent.type)) return parent;
      parent = parent.parent;
    }

    return null;
  }
}
// exports.default = DocFactory;
