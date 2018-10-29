
import { convertLatexShortcuts, convertSymbols } from "./util"

export function drawText(c, originalText, x, y, angleOrNull) {
    //const { caretVisible, caretPosition } = state;
	let text = convertLatexShortcuts(originalText);
	c.font = '20px sans-serif';
	var width = c.measureText(text).width;

	// center the text
	x -= width / 2;

	// position the text intelligently if given an angle
	if(angleOrNull != null) {
		var cos = Math.cos(angleOrNull);
		var sin = Math.sin(angleOrNull);
		var cornerPointX = (width / 2 + 5) * (cos > 0 ? 1 : -1);
		var cornerPointY = (10 + 5) * (sin > 0 ? 1 : -1);
		var slide = sin * Math.pow(Math.abs(sin), 40) * cornerPointX - cos * Math.pow(Math.abs(cos), 10) * cornerPointY;
		x += cornerPointX - sin * slide;
		y += cornerPointY + cos * slide;
	}

	// draw text and caret (round the coordinates so the caret falls on a pixel)
	if('advancedFillText' in c) {
		c.advancedFillText(text, originalText, x + width / 2, y, angleOrNull);
	} else {
		text = convertSymbols(text, "unicode");
		
		x = Math.round(x);
		y = Math.round(y);
		c.fillText(text, x, y + 6);
	}
}

export function drawArrow(c, x, y, angle) {
	//var dx = Math.cos(angle);
	//var dy = Math.sin(angle);
	//c.beginPath();
	//c.moveTo(x, y);
	//c.lineTo(x - 8 * dx + 5 * dy, y - 8 * dy - 5 * dx);
	//c.lineTo(x - 8 * dx - 5 * dy, y - 8 * dy + 5 * dx);
	//c.fill();
}
