import { drawText, drawArrow } from "../main/draw";
import { snapToPadding, hitTargetPadding } from "../constants";

const defaultState = {
  node: null,
  start: null,
  deltaX: 0,
  deltaY: 0,
  text: '',
};

function startLink(state = defaultState) {
  let link = {
    ...defaultState,
    ...state,
    type: 'startLink',

    getLabelPosition() {
      // Place it off screen
      return {x: -200, y: -100};
    },
  
    setAnchorPoint(x, y) {
      this.deltaX = x - this.node.x;
      this.deltaY = y - this.node.y;
  
      if(Math.abs(this.deltaX) < snapToPadding) {
        this.deltaX = 0;
      }
  
      if(Math.abs(this.deltaY) < snapToPadding) {
        this.deltaY = 0;
      }
    },
  
    getEndPoints() {
      var startX = this.node.x + this.deltaX;
      var startY = this.node.y + this.deltaY;
      var end = this.node.closestPointOnCircle(startX, startY);
      return {
        'startX': startX,
        'startY': startY,
        'endX': end.x,
        'endY': end.y,
      }
    },
  
    draw(c) {
      var stuff = this.getEndPoints();
  
      // draw the line
      c.beginPath();
      c.moveTo(stuff.startX, stuff.startY);
      c.lineTo(stuff.endX, stuff.endY);
      c.stroke();
  
      // draw the text at the end without the arrow
      var textAngle = Math.atan2(stuff.startY - stuff.endY, stuff.startX - stuff.endX);
      drawText(c, this.text, stuff.startX, stuff.startY, textAngle);
  
      // draw the head of the arrow
      drawArrow(c, stuff.endX, stuff.endY, Math.atan2(-this.deltaY, -this.deltaX));
    },
  
    containsPoint(x, y) {
      var stuff = this.getEndPoints();
      var dx = stuff.endX - stuff.startX;
      var dy = stuff.endY - stuff.startY;
      var length = Math.sqrt(dx*dx + dy*dy);
      var percent = (dx * (x - stuff.startX) + dy * (y - stuff.startY)) / (length * length);
      var distance = (dx * (y - stuff.startY) - dy * (x - stuff.startX)) / length;
      return (percent > 0 && percent < 1 && Math.abs(distance) < hitTargetPadding);
    },

  };

  if (link.start) {
    link.setAnchorPoint(link.start.x, link.start.y);
  }
  return link;
}
export default startLink;
