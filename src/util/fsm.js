import node from '../elements/node';

const fsm = function fsm() {
  return {
    state: {
      nodes: [],
      links: [],
    },
    createNode(posX, posY) {
      const newNode = node({ x: posX, y: posY});
      this.state.nodes.push(newNode);
      return newNode;
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
    },
    clear() {
      this.state.nodes = [];
      this.state.links = [];
    }
  };
};

export default fsm;
