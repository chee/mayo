import {target} from "@github/catalyst"
import * as md from "mdast"
import {CaretInstruction} from ".."
import {MayoParentElement} from "./mayo-element"
export default class MayoBlockquoteElement extends MayoParentElement<md.Blockquote> {
	handleKeydown() {
		return false
	}
	selfInsertText() {
		console.error("tried to operate inside a break")
		return {
			type: "element" as const,
			element: this,
			index: 0,
			startOffset: 0,
		}
	}
	connectedCallback() {}
}
