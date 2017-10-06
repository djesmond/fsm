import { Node } from '../elements/node';

const fsm = function fsm() {
  return {
    state: {
      nodes: [],
      links: [],
      currentLink: null, // a link
      originalClick: undefined,
      caretVisible: false,
      caretPosition_: 0,
    },
    createNode(posX, posY) {
      const node = new Node(posX, posY);
      this.state.nodes.push(node);
      return node;
    },
    removeNode(node) {
      this.state.nodes = this.state.nodes.filter((elm) => {
        return elm !== node;
      });
    }
  };
};

export default fsm;
