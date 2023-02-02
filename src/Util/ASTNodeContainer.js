// Object.defineProperty(exports, "__esModule", {value: true});

class ASTNodeContainer {
  #docId;

  #nodes;

  constructor() {
    this.#docId = 0;
    this.#nodes = {};
  }

  addNode(node) {
    this.#nodes[this.#docId] = node;
    return this.#docId++;
  }

  getNode(id) {
    return this.#nodes[id];
  }
}

// exports.default = new ASTNodeContainer();
export default new ASTNodeContainer();
