
// The evil itself: global mutable state
export var state = {
	canvas: undefined,
	nodes: [],
	links: [],
	selectedObject: null, // either a Link or a Node
	currentLink: null, // a link
	movingObject: false,
	originalClick: undefined,
	caretVisible: false,
	caretPosition_: 0
}

Object.defineProperty(state, "caretPosition", {
	get: () => state.selectedObject && state.caretPosition_,
	set: (v) => {
		if (!state.selectedObject || v === undefined) {
			state.caretPosition_ = 0;
			return;
		}

		const labelLength = state.selectedObject.text.length;
		state.caretPosition_ = Math.max(0, Math.min(labelLength || 0, v));
	}
})
