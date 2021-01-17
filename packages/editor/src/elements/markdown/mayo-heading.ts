import {target} from "@github/catalyst"
import {render, html, TemplateResult} from "lit-html"
import {templateContent} from "lit-html/directives/template-content"
import {CaretInstruction, MayoMdastContentElement} from ".."
import type * as md from "mdast"
import {MayoParentElement} from "./mayo-element"

export default class MayoHeadingElement extends MayoParentElement<md.Heading> {
	type = "block" as const

	selfInsertText(text: string, range: StaticRange): CaretInstruction {
		if (text == "#" && this.atBeginningOfBlock_(range)) {
			if (this.node.depth < 6) {
				this.node.depth += 1
			}
			return {
				type: "element",
				element: this,
				index: 0,
				startOffset: 0,
			}
		} else {
			return super.selfInsertText(text, range)
		}
	}

	/**
	 * @param selection the current selection
	 * @param event the event
	 * @returns whether or not the event caused a transformation
	 */
	handleKeydown(selection: Selection, event: KeyboardEvent): boolean {
		let change = super.handleKeydown(selection, event)
		if (this.atBeginningOfBlock(selection)) {
			switch (event.key.toLowerCase()) {
				case "#": {
					if (this.node.depth < 6) {
						this.node.depth += 1
						return true
					}
					return change
				}
				case "backspace": {
					if (this.node.depth > 1) {
						this.node.depth -= 1
						return true
					} else {
						delete this.node.depth
						this.node.type = "paragraph"
						return true
					}
				}
			}
		}
		return change
	}

	connectedCallback() {
		super.connectedCallback()
	}
}
