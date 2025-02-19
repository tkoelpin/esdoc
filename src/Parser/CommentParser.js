// Object.defineProperty(exports, "__esModule", {value: true});

/**
 * Doc Comment Parser class.
 *
 * @example
 * for (let comment of node.leadingComments) {
 *   let tags = CommentParser.parse(comment);
 *   console.log(tags);
 * }
 */
export default class CommentParser {
  /**
   * parse comment to tags.
   * @param {ASTNode} commentNode - comment node.
   * @param {string} commentNode.value - comment body.
   * @param {string} commentNode.type - CommentBlock or CommentLine.
   * @returns {Tag[]} parsed comment.
   */
  static parse(commentNode) {
    if (!this.isESDoc(commentNode)) return [];

    let comment = commentNode.value;

    // TODO: refactor

    // for windows
    comment = comment.replace(/\r\n/gmu, `\n`);

    // remove line head space
    comment = comment.replace(/^[\t ]*/gmu, ``);

    // remove first `*`
    comment = comment.replace(/^\*[\t ]?/u, ``);

    // remove last space
    comment = comment.replace(/[\t ]$/u, ``);

    // remove line head `*`
    comment = comment.replace(/^\*[\t ]?/gmu, ``);

    // auto insert @desc
    if (comment.charAt(0) !== `@`) comment = `@desc ${comment}`;

    // remove tail space.
    comment = comment.replace(/[\t ]*$/u, ``);

    // escape code in descriptions
    comment = comment.replace(/```[\s\S]*?```/gu, match => match.replace(/@/gu, `\\ESCAPED_AT\\`));

    // auto insert tag text to non-text tag (e.g. @interface)
    comment = comment.replace(/^[\t ]*(@\w+)$/gmu, `$1 \\TRUE`);

    // insert separator (\\Z@tag\\Ztext)
    comment = comment.replace(/^[\t ]*(@\w+)[\t ](.*)/gmu, `\\Z$1\\Z$2`);
    const lines = comment.split(`\\Z`);

    let tagName = ``;
    let tagValue = ``;
    const tags = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.charAt(0) === `@`) {
        tagName = line;
        const nextLine = lines[i + 1];
        if (nextLine.charAt(0) === `@`) {
          tagValue = ``;
        } else {
          tagValue = nextLine;
          i++;
        }
        tagValue = tagValue.replace(`\\TRUE`, ``).replace(/\\ESCAPED_AT\\/gu, `@`)
          .replace(/^\n/u, ``)
          .replace(/\n*$/u, ``);
        tags.push({
          tagName,
          tagValue
        });
      }
    }
    return tags;
  }

  /**
   * parse node to tags.
   * @param {ASTNode} node - node.
   * @returns {{tags: Tag[], commentNode: CommentNode}} parsed comment.
   */
  static parseFromNode(node) {
    if (!node.leadingComments) {
      node.leadingComments = [{
        type:  `CommentBlock`,
        value: ``
      }];
    }
    const commentNode = node.leadingComments[node.leadingComments.length - 1];
    const tags = this.parse(commentNode);

    return {
      commentNode,
      tags
    };
  }

  /**
   * judge doc comment or not.
   * @param {ASTNode} commentNode - comment node.
   * @returns {boolean} if true, this comment node is doc comment.
   */
  static isESDoc(commentNode) {
    if (commentNode.type !== `CommentBlock`) return false;
    return commentNode.value.charAt(0) === `*`;
  }

  /**
   * build comment from tags
   * @param {Tag[]} tags
   * @returns {string} block comment value.
   */
  static buildComment(tags) {
    return tags.reduce((comment, tag) => {
      const line = tag.tagValue.replace(/\n/gu, `\n * `);
      return `${comment} * ${tag.tagName} \n * ${line} \n`;
    }, `*\n`);
  }
}
// exports.default = CommentParser;
