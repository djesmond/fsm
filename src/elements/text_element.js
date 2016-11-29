
import { state } from "../main/state"

export class TextElement {
	constructor() {
		this.text = "";
	}

	onSelected() {
		state.caretPosition = this.text.length;
	}

	onUnselected() {
		state.caretPosition = undefined;
	}
}
