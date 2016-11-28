
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
	caretVisible: false
}
