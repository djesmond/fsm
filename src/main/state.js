
// The evil itself: global mutable state
export var state = {
	canvas: undefined,
	nodes: [],
	links: [],
	cursorVisible: true,
	selectedObject: null, // either a Link or a Node
	currentLink: null, // a link
	movingObject: false,
	originalClick: undefined,
	caretVisible: false,
	caretPosition_: undefined
}

Object.defineProperty(state, "caretPosition", {
	get: () => state.selectedObject && state.caretPosition_,
	set: (v) => {
		if (!state.selectedObject) {
			return;
		}
		state.caretPosition_ = Math.max(0, Math.min(state.selectedObject.text.length || 0, v));
	}
})
