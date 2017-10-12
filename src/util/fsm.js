import { Node } from '../elements/node';

const fsm = function fsm() {
  return {
    state: {
      nodes: [],
      links: [],
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
    },
    removeLink(link) {
      this.state.links = this.state.links.filter((elm) => {
        return elm !== link;
      });
    }
  };
};

export default fsm;
