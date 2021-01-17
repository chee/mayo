import {MayoParentElement} from "./mayo-element"
import * as md from "mdast"
import u from "unist-builder"

export default class MayoParagraphElement extends MayoParentElement<md.Paragraph> {
	type = "block" as const

	handleKeydown(selection: Selection, event: KeyboardEvent): boolean {
		let change = super.handleKeydown(selection, event)
		let atBeginning =
			selection.focusOffset == 0 &&
			this.interestingChildren.indexOf(selection.focusNode! as ChildNode) == 0

		if (atBeginning) {
			switch (event.key.toLowerCase()) {
				case "#": {
					this.node.depth = 1
					this.node.type = "heading"
					return true
				}
				case ">": {
					this.node.children = [{...this.node}]
					this.node.type = "blockquote"
					return true
				}
				case "-": {
					this.node.children = [u("listItem", [{...this.node}])]
					this.node.type = "list"
					this.node.ordered = false
					return true
				}
				case "1": {
					this.node.children = [u("listItem", [{...this.node}])]
					this.node.type = "list"
					this.node.ordered = true
					return true
				}
			}
		} else {
			return change
		}
		return change
	}
	connectedCallback() {
		super.connectedCallback()
	}
}
