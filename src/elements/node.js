import { nodeRadius } from "../constants";
import { drawText } from "../main/draw";

const defaultState = {
  x: 0,
  y: 0,
  mouseOffsetX: 0,
  mouseOffsetY: 0,
  isAcceptState: false,
  text: '',
};

function node(state = {}) {
  return {
    ...defaultState,
    ...state,
    type: 'node',

    getLabelPosition() {
      return {x: this.x, y: this.y};
    },
  
    setMouseStart(x, y) {
      this.mouseOffsetX = this.x - x;
      this.mouseOffsetY = this.y - y;
    },
  
    setAnchorPoint(x, y) {
      this.x = x + this.mouseOffsetX;
      this.y = y + this.mouseOffsetY;
    },
  
    draw(c) {
      // draw the circle
      c.beginPath();
      c.arc(this.x, this.y, nodeRadius, 0, 2 * Math.PI, false);
      c.stroke();
      // draw the text
      drawText(c, this.text, this.x, this.y, null);
  
      // draw a double circle for an accept state
      if(this.isAcceptState) {
        c.beginPath();
        c.arc(this.x, this.y, nodeRadius - 6, 0, 2 * Math.PI, false);
        c.stroke();
      }
    },
  
    closestPointOnCircle(x, y) {
      var dx = x - this.x;
      var dy = y - this.y;
      var scale = Math.sqrt(dx * dx + dy * dy);
      return {
        'x': this.x + dx * nodeRadius / scale,
        'y': this.y + dy * nodeRadius / scale,
      }
    },
  
    containsPoint(x, y) {
      return (x - this.x)*(x - this.x) + (y - this.y)*(y - this.y) < nodeRadius*nodeRadius;
    },
  }
}
export default node;
