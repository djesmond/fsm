
import { saveBackup, restoreBackup } from "./save"
import { Link } from "../elements/link"
import { Node } from "../elements/node"
import { SelfLink } from "../elements/self_link"
import { StartLink } from "../elements/start_link"
import { TemporaryLink } from "../elements/temporary_link"
import { state } from "./state"
import { nodeRadius, snapToPadding, hitTargetPadding } from "../constants"
import { canvasHasFocus, isCharAllowedInLabel } from "./util"

import { ExportAsLaTeX } from "../export_as/latex"
import { ExportAsSVG } from "../export_as/svg"

window.state = state;

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
	const ctx = canvas.getContext('2d');
	drawUsing(ctx);
	saveBackup();
}

function selectObject(x, y) {
	const { nodes, links } = state;
	for(var i = nodes.length - 1; i >= 0; i--) {
		if(nodes[i].containsPoint(x, y)) {
			return nodes[i];
		}
	}
	for(var i = links.length - 1; i >= 0; i--) {
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

function onSelectObject(obj, mouse) {
	state.selectedObject = obj;
	obj.onSelected();
	if(shift && state.selectedObject instanceof Node) {
		state.currentLink = new SelfLink(state.selectedObject, mouse);
	} else {
		state.movingObject = true;
		if(state.selectedObject.setMouseStart) {
			state.selectedObject.setMouseStart(mouse.x, mouse.y);
		}
	}
	resetCaret();
}

window.onload = function() {

	// Create and inject the canvas with js to get the correct dimensions
	var canvas = document.createElement('canvas');
	
	canvas.id = "canvas";
	canvas.classList.add('canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight - 100;
	
	document.getElementById('canvasContainer').appendChild(canvas);
	state.canvas = document.getElementById('canvas');

	restoreBackup();
	draw();

	window.clearCanvas = clearCanvas;
	window.saveAsPNG = saveAsPNG;
	window.saveAsLaTeX = saveAsLaTeX;
	window.saveAsSVG = saveAsSVG;
	window.saveAsJSON = saveAsJSON;
	window.toggleHelp = toggleHelp;
	window.toggleExport = toggleExport;

	canvas.onmousedown = function(e) {
		var mouse = crossBrowserRelativeMousePos(e);
		var newSelectedObject = selectObject(mouse.x, mouse.y);
		state.movingObject = false;
		state.originalClick = mouse;

		//if (state.selectedObject != newSelectedObject) {
			if (state.selectedObject != null) {
				state.selectedObject.onUnselected();
			}

			if (newSelectedObject == null) {
				state.selectedObject = null;
			} else {
				onSelectObject(newSelectedObject, mouse);
			}
		//}

		if (shift) {
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

let shift = false;

document.onkeydown = function(e) {
	const { selectedObject, links, nodes, caretPosition } = state;

	if(e.key === "Shift") {
		shift = true;
	} else if(!canvasHasFocus()) {
		// don't read keystrokes when other things have focus
		return true;
	} else if(e.key === "Backspace") {
		if(selectedObject != null && 'text' in selectedObject) {
			selectedObject.text = selectedObject.text.slice(0, Math.max(0, caretPosition - 1)) + selectedObject.text.slice(caretPosition);
			state.caretPosition--;
			resetCaret();
			draw();
		}

		// backspace is a shortcut for the back button, but do NOT want to change pages
		return false;
	} else if(e.key === "Delete") {
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
	} else if (selectedObject != null) {
		if (e.key === "ArrowLeft") {
			state.caretPosition--;
			resetCaret();
			draw();
			return false;
		}
		else if (e.key === "ArrowRight") {
			state.caretPosition++;
			resetCaret();
			draw();
			return false;
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
	const { selectedObject, caretPosition } = state;
	// don't read keystrokes when other things have focus
	var key = crossBrowserKey(e);
	if(!canvasHasFocus()) {
		// don't read keystrokes when other things have focus
		return true;
	} else if (e.key.startsWith('Arrow')) {
		return false;
	} else if(isCharAllowedInLabel(e.key) && selectedObject != null && 'text' in selectedObject) {
		const newChar = String.fromCharCode(key);
		selectedObject.text = selectedObject.text.slice(0, Math.max(0, caretPosition)) + newChar + selectedObject.text.slice(caretPosition);
		state.caretPosition++;
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

function clearCanvas(){
		window.state.nodes = [];
		window.state.links = [];
		localStorage.removeItem('fsm');			
		var context = canvas.getContext('2d')
		context.clearRect(0, 0, canvas.width, canvas.height);
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

function saveAsJSON() {
	const data = JSON.stringify(state);
	output(data);
}

function toggleVisibility(id) {
	var elm = document.getElementById(id);
	if (elm.classList.contains('hide')) {
		elm.classList.remove('hide');
	} else {
		elm.classList.add('hide');
	}
}

function toggleHelp() {
	toggleVisibility('helpContainer');
}

function toggleExport() {
	toggleVisibility('exportModal');
}


