
import { saveBackup, restoreBackup } from "./save"
import { Link } from "../elements/link"
import { Node } from "../elements/node"
import { SelfLink } from "../elements/self_link"
import { StartLink } from "../elements/start_link"
import { TemporaryLink } from "../elements/temporary_link"
import { state } from "./state"
import { nodeRadius, snapToPadding, hitTargetPadding } from "../constants"
import { canvasHasFocus } from "./util"

import { ExportAsLaTeX } from "../export_as/latex"
import { ExportAsSVG } from "../export_as/svg"

function textToXML(text) {
	text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	var result = '';
	for(var i = 0; i < text.length; i++) {
		var c = text.charCodeAt(i);
		if(c >= 0x20 && c <= 0x7E) {
			result += text[i];
		} else {
			result += '&#' + c + ';';
		}
	}
	return result;
}

var caretTimer;

function resetCaret() {
	clearInterval(caretTimer);
	caretTimer = setInterval(() => {
		state.caretVisible = !state.caretVisible;
		draw();
	}, 500);
	state.caretVisible = true;
}

function drawUsing(c) {
	const { nodes, links, selectedObject, currentLink } = state;
	c.clearRect(0, 0, canvas.width, canvas.height);
	c.save();
	c.translate(0.5, 0.5);

	for(var i = 0; i < nodes.length; i++) {
		c.lineWidth = 1;
		c.fillStyle = c.strokeStyle = (nodes[i] == selectedObject) ? 'blue' : 'black';
		nodes[i].draw(c);
	}
	for(var i = 0; i < links.length; i++) {
		c.lineWidth = 1;
		c.fillStyle = c.strokeStyle = (links[i] == selectedObject) ? 'blue' : 'black';
		links[i].draw(c);
	}
	if(currentLink != null) {
		c.lineWidth = 1;
		c.fillStyle = c.strokeStyle = 'black';
		currentLink.draw(c);
	}

	c.restore();
}

function draw() {
	drawUsing(canvas.getContext('2d'));
	saveBackup();
}

function selectObject(x, y) {
	const { nodes, links } = state;
	for(var i = 0; i < nodes.length; i++) {
		if(nodes[i].containsPoint(x, y)) {
			return nodes[i];
		}
	}
	for(var i = 0; i < links.length; i++) {
		if(links[i].containsPoint(x, y)) {
			return links[i];
		}
	}
	return null;
}

function snapNode(node) {
	const { nodes } = state;
	for(var i = 0; i < nodes.length; i++) {
		if(nodes[i] == node) continue;

		if(Math.abs(node.x - nodes[i].x) < snapToPadding) {
			node.x = nodes[i].x;
		}

		if(Math.abs(node.y - nodes[i].y) < snapToPadding) {
			node.y = nodes[i].y;
		}
	}
}

window.onload = function() {
	state.canvas = document.getElementById('canvas');
	restoreBackup();
	draw();

	window.saveAsPNG = saveAsPNG;
	window.saveAsLaTeX = saveAsLaTeX;
	window.saveAsSVG = saveAsSVG;

	canvas.onmousedown = function(e) {
		var mouse = crossBrowserRelativeMousePos(e);
		state.selectedObject = selectObject(mouse.x, mouse.y);
		state.movingObject = false;
		state.originalClick = mouse;

		if(state.selectedObject != null) {
			if(shift && state.selectedObject instanceof Node) {
				state.currentLink = new SelfLink(state.selectedObject, mouse);
			} else {
				state.movingObject = true;
				if(state.selectedObject.setMouseStart) {
					state.selectedObject.setMouseStart(mouse.x, mouse.y);
				}
			}
			resetCaret();
		} else if(shift) {
			state.currentLink = new TemporaryLink(mouse, mouse);
		}

		draw();

		if(canvasHasFocus()) {
			// disable drag-and-drop only if the canvas is already focused
			return false;
		} else {
			// otherwise, let the browser switch the focus away from wherever it was
			resetCaret();
			return true;
		}
	};

	canvas.ondblclick = function(e) {
		var mouse = crossBrowserRelativeMousePos(e);
		state.selectedObject = selectObject(mouse.x, mouse.y);

		if(state.selectedObject == null) {
			state.selectedObject = new Node(mouse.x, mouse.y);
			state.nodes.push(state.selectedObject);
			resetCaret();
			draw();
		} else if(state.selectedObject instanceof Node) {
			state.selectedObject.isAcceptState = !state.selectedObject.isAcceptState;
			draw();
		}
	};

	canvas.onmousemove = function(e) {
		var { currentLink, selectedObject, movingObject, originalClick } = state;
		var mouse = crossBrowserRelativeMousePos(e);

		if(currentLink != null) {
			var targetNode = selectObject(mouse.x, mouse.y);
			if(!(targetNode instanceof Node)) {
				targetNode = null;
			}

			if(selectedObject == null) {
				if(targetNode != null) {
					state.currentLink = new StartLink(targetNode, originalClick);
				} else {
					state.currentLink = new TemporaryLink(originalClick, mouse);
				}
			} else {
				if(targetNode == selectedObject) {
					state.currentLink = new SelfLink(selectedObject, mouse);
				} else if(targetNode != null) {
					state.currentLink = new Link(selectedObject, targetNode);
				} else {
					state.currentLink = new TemporaryLink(selectedObject.closestPointOnCircle(mouse.x, mouse.y), mouse);
				}
			}
			draw();
		}

		if(movingObject) {
			selectedObject.setAnchorPoint(mouse.x, mouse.y);
			if(selectedObject instanceof Node) {
				snapNode(selectedObject);
			}
			draw();
		}
	};

	canvas.onmouseup = function(e) {
		const { currentLink } = state
		state.movingObject = false;

		if(currentLink != null) {
			if(!(currentLink instanceof TemporaryLink)) {
				state.selectedObject = currentLink;
				state.links.push(currentLink);
				resetCaret();
			}
			state.currentLink = null;
			draw();
		}
	};
}

var shift = false;

document.onkeydown = function(e) {
	const { selectedObject, links, nodes } = state;
	var key = crossBrowserKey(e);

	if(key == 16) {
		shift = true;
	} else if(!canvasHasFocus()) {
		// don't read keystrokes when other things have focus
		return true;
	} else if(key == 8) { // backspace key
		if(selectedObject != null && 'text' in selectedObject) {
			selectedObject.text = selectedObject.text.substr(0, selectedObject.text.length - 1);
			resetCaret();
			draw();
		}

		// backspace is a shortcut for the back button, but do NOT want to change pages
		return false;
	} else if(key == 46) { // delete key
		if(selectedObject != null) {
			for(var i = 0; i < nodes.length; i++) {
				if(nodes[i] == selectedObject) {
					nodes.splice(i--, 1);
				}
			}
			for(var i = 0; i < links.length; i++) {
				if(links[i] == selectedObject || links[i].node == selectedObject || links[i].nodeA == selectedObject || links[i].nodeB == selectedObject) {
					links.splice(i--, 1);
				}
			}
			state.selectedObject = null;
			draw();
		}
	}
};

document.onkeyup = function(e) {
	var key = crossBrowserKey(e);

	if(key == 16) {
		shift = false;
	}
};

document.onkeypress = function(e) {
	const { selectedObject } = state;
	// don't read keystrokes when other things have focus
	var key = crossBrowserKey(e);
	if(!canvasHasFocus()) {
		// don't read keystrokes when other things have focus
		return true;
	} else if(key >= 0x20 && key <= 0x7E && !e.metaKey && !e.altKey && !e.ctrlKey && selectedObject != null && 'text' in selectedObject) {
		selectedObject.text += String.fromCharCode(key);
		resetCaret();
		draw();

		// don't let keys do their actions (like space scrolls down the page)
		return false;
	} else if(key == 8) {
		// backspace is a shortcut for the back button, but do NOT want to change pages
		return false;
	}
};

function crossBrowserKey(e) {
	e = e || window.event;
	return e.which || e.keyCode;
}

function crossBrowserElementPos(e) {
	e = e || window.event;
	var obj = e.target || e.srcElement;
	var x = 0, y = 0;
	while(obj.offsetParent) {
		x += obj.offsetLeft;
		y += obj.offsetTop;
		obj = obj.offsetParent;
	}
	return { 'x': x, 'y': y };
}

function crossBrowserMousePos(e) {
	e = e || window.event;
	return {
		'x': e.pageX || e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
		'y': e.pageY || e.clientY + document.body.scrollTop + document.documentElement.scrollTop,
	};
}

function crossBrowserRelativeMousePos(e) {
	var element = crossBrowserElementPos(e);
	var mouse = crossBrowserMousePos(e);
	return {
		'x': mouse.x - element.x,
		'y': mouse.y - element.y
	};
}

function output(text) {
	var element = document.getElementById('output');
	element.style.display = 'block';
	element.value = text;
}

function saveAsPNG() {
	var oldSelectedObject = state.selectedObject;
	state.selectedObject = null;
	drawUsing(canvas.getContext('2d'));
	state.selectedObject = oldSelectedObject;
	var pngData = canvas.toDataURL('image/png');
	document.location.href = pngData;
}

function saveAsSVG() {
	var exporter = new ExportAsSVG();
	var oldSelectedObject = state.selectedObject;
	state.selectedObject = null;
	drawUsing(exporter);
	state.selectedObject = oldSelectedObject;
	var svgData = exporter.toSVG();
	output(svgData);
	// Chrome isn't ready for this yet, the 'Save As' menu item is disabled
	// document.location.href = 'data:image/svg+xml;base64,' + btoa(svgData);
}

function saveAsLaTeX() {
	var exporter = new ExportAsLaTeX();
	var oldSelectedObject = state.selectedObject;
	state.selectedObject = null;
	drawUsing(exporter);
	state.selectedObject = oldSelectedObject;
	var texData = exporter.toLaTeX();
	output(texData);
}
