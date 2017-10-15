<template>
<div>
  <div id="canvasContainer">
    <canvas 
      id="canvas" 
      class="canvas" 
      :width="canvasWidth" 
      :height="canvasHeight"
      @dblclick="onDoubleClick"
      @mousemove="onDrag"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
      v-on:keyup.8="onDelete">
    </canvas>
  </div>
  <LabelInput 
    v-show="showLabel = this.selectedObject && !this.movingObject"
    :style="labelInputPosition"
    :text="getlabelText"
    :showing="showLabel"
    v-on:labelUpdate="labelUpdate" />
</div>
</template>
<script>
import LabelInput from './LabelInput';
import fsm from '../util/fsm';
import mouse from '../util/mouse';
import node from '../elements/node';
import temporaryLink from '../elements/temporaryLink';
import link from "../elements/link";
import selfLink from "../elements/selfLink";
import startLink from "../elements/startLink";

export default {
  props: [
    'triggerClear',
  ],
  data() {
    return {
      // The state machine we are creating
      fsm: fsm(),
      // Reference to the HTML 5 canvas
      // Created during the mouting
      canvas: null,
      // Reference to the 2d context of the canvas
      // Created during the mouting
      context: null,
      // The selected object of the FSM
      selectedObject: null,
      // Control if we are moving (dragging) 
      // objects on the canvas
      movingObject: false,
      // While creating a new link we keep it here
      currentLink: null,
      // Record the location of mouse clicks on canvas
      // Used for creating links
      originalClick: null,
      // Control if the label input is showing
      showLabel: false,
    }
  },
  components: {
    LabelInput
  },
  watch: {
    triggerClear(shouldClear) {
      if (shouldClear) {
        this.fsm.clear();
        this.selectedObject = null;
        this.movingObject = false;
        this.render();
        this.$emit('hasCleared', true);
      }
    }
  },
  methods: {
    onMouseDown(e) {
      const position = mouse.crossBrowserRelativeMousePos(e);
      // Record where the click was made
      // Used for placing start links
      this.originalClick = position;
      const target = this.selectObject(position.x, position.y);
      // If we hit a node or a link
      if (target) {
        this.selectedObject = target;
        this.movingObject = true;
      } else if (this.selectedObject) { // We hit the canvas
        this.selectedObject = null;
      }
      if (e.shiftKey) {
        // Start drawing a link
        this.currentLink = temporaryLink({ from:position, to: position});
      }

      this.render();
    },

    onMouseUp(e) {
      this.movingObject = false;
      // If we are placing a link
      if (this.currentLink) {
        // Make sure that the link is valid:
        // It needs a target node
        if (!(this.currentLink.type === 'temporaryLink')) {
          this.selectedObject = this.currentLink;
          this.fsm.state.links.push(this.currentLink);
        }
        this.currentLink = null;
        this.render();
      }
    },

    onDoubleClick(e) {
      const position = mouse.crossBrowserRelativeMousePos(e);
      const target = this.selectObject(position.x, position.y);
      if (target) {
        // If we double clicked on the current node
        if (target === this.selectedObject && target.type === 'node') {
          // Toggle the accept state
          this.selectedObject.isAcceptState = !this.selectedObject.isAcceptState;
        }
      } else {
        // Nothing was hit, create a new node at that position
        const newNode = this.fsm.createNode(position.x, position.y);
        this.selectedObject = newNode;
      }
      this.render();
    },

    onDrag(e) {
      const position = mouse.crossBrowserRelativeMousePos(e);

      // If we are drawing a new link
      if (this.currentLink) {
        // Get the current target
        let targetNode = this.selectObject(position.x, position.y);
        // If the target is not a Node
        if (!(targetNode && targetNode.type === 'node')) {
          // Set it to null as we can only have links to nodes
          targetNode = null;
        }
        if (this.selectedObject === null) {
          // If we have a target Node we create a Link
          if (targetNode) {
            this.currentLink = startLink({node: targetNode, start: this.originalClick});
          } else {
            this.currentLink = temporaryLink({from: this.originalClick, to: position});
          }
        } else {
          // if the target is itself, create a loop
          if (targetNode === this.selectedObject) {
            this.currentLink = selfLink({node: this.selectedObject, mouse: position});
          } else if (targetNode) {
            // Otherwise we create a normal link
            this.currentLink = link({nodeA: this.selectedObject, nodeB: targetNode});
          } else {
            // Link still hasn't been connected
            // So we create a new Temp Link with new position
            // to make it "follow" the mouse
            this.currentLink = temporaryLink({from: this.selectedObject.closestPointOnCircle(position.x, position.y), to: position});
          }
        }
        this.render();
      } else {
        // Otherwise we check for moving Nodes
        if (this.movingObject) {
          // Update the position to the mouse position
          this.selectedObject.setAnchorPoint(position.x, position.y);
          if (this.selectedObject.type === 'node') {
            // Snap nodes to align with others
            this.snapNode(this.selectedObject);
          }
          this.render();
        }
      }
    },

    onDelete() {
      if (this.selectedObject) {
        if (this.selectedObject.type ===  'node') {
          this.fsm.removeNode(this.selectedObject);
        } else {
          this.fsm.removeLink(this.selectedObject);
        }
        this.selectedObject = null;
        this.render();
      }
    },

    selectObject(x, y) {
      const { nodes, links } = this.fsm.state;
      // Check the nodes positions and see if any matches
      let target = nodes.find((node) => node.containsPoint(x,y));

      // If we didnt hit a node then check for links
      if (!target) {
        target = links.find((link) => link.containsPoint(x,y));
      }
      // Returns undefined if canvas was hit
      return target;
    },

    snapNode(node) {
      // Snap a nodes position to other nodes
      // By adjusting the position
      this.fsm.state.nodes.forEach((elm) => {
        if (elm !== node) {
          // If the x position is within 5 pixels
          if (Math.abs(node.x - elm.x) < 5) {
            node.x = elm.x;
          }
          // If the xyposition is within 5 pixels
          if (Math.abs(node.y - elm.y) < 5) {
            node.y = elm.y;
          }
        }
      });
    },

    labelUpdate(label) {
      // Update the label on the selected object as we type
      if (this.selectedObject) {
        this.selectedObject.text = label;
        this.render();
      }
    },

    render() {
      const { nodes, links } = this.fsm.state;
      // Clear the canvas
      this.context.clearRect(0, 0, canvas.width, canvas.height);
      this.context.save();
      this.context.translate(0.5, 0.5);

      // Draw each node
      nodes.map(node => {
        this.context.lineWidth = 1;
        // Draw the selected node as blue (if it exist)
        this.context.fillStyle =  this.context.strokeStyle = (node === this.selectedObject) ? 'blue' : 'black';
        node.draw(this.context);
      });

      links.map((link) => {
        this.context.lineWidth = 1;
        this.context.fillStyle = this.context.strokeStyle = (link === this.selectedObject) ? 'blue' : 'black';
        link.draw(this.context);
      });

      // If we are currently drawing a link
      if (this.currentLink) {
        this.context.lineWidth = 1;
        this.context.fillStyle = this.context.strokeStyle = 'black';
        this.currentLink.draw(this.context);
      }
      this.context.restore();
    },

  },
  computed: {
    canvasWidth() {
      // Dynmically set the width of the canvas
      return window.innerWidth;
    },
    canvasHeight() {
      // Dynmically set the height of the canvas
      return window.innerHeight - 105;
    },
    // Calculate the aboslute position of the input based on the selected object
    labelInputPosition() {
      if (this.selectedObject) {
        const position = this.selectedObject.getLabelPosition();
        return `top:${position.y}px; left:${position.x - 20}px`;
      } else {
        return '';
      }
    },
    getlabelText() {
      if (this.selectedObject) {
        return this.selectedObject.text;
      } else {
        return '';
      }
    },
  },
  mounted() {
    // This needs to be refactored as we progress with moving control to Vue
    const el = document.getElementById('canvas');
    this.canvas = el;
    this.context = el.getContext('2d');
    document.addEventListener('keyup', (e) => {
      // Delete key
      if (e.keyCode === 46) {
        this.onDelete();
      }
    });
    document.addEventListener('mousedown', function (event) {
      // If we double click on canvas
      if (event.detail > 1 && event.target.id === 'canvas') {
        // disable default
        // We dont' want the browser to hightlight text etc
        event.preventDefault();
      }
    }, false);
  }
}
</script>
<style lang="scss" scoped>

</style>
