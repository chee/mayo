import type * as md from "mdast"
import type * as unist from "unist"
import {find, pairSymbolFor, toString} from "../../utils"
import u from "unist-builder"
import {CaretInstruction, MayoMdastContentElement} from ".."
import shortId from "shortid"
export abstract class MayoElement<
	AstNodeType extends unist.Node
> extends HTMLElement {
	node: AstNodeType
	type: "inline" | "block"

	get interestingChildren(): Node[] {
		return Array.from(this.childNodes).filter(
			n => "node" in n || n.nodeName == "#text"
		)
	}

	abstract handleKeydown(selection: Selection, event: KeyboardEvent): boolean

	/**
	 * Insert text when the range start and end are both in a single element
	 * @param text the text to insert
	 * @param range the selected range, which may be of interest
	 */
	abstract selfInsertText(text: string, range: StaticRange): CaretInstruction

	connectedCallback() {
		this.setAttribute("mayo-type", this.type)
	}
}

export class MayoLiteralElement<
	AstNodeType extends md.Literal
> extends MayoElement<AstNodeType> {
	type = "inline" as const
	insertText(selection: Selection, event: InputEvent) {
		let special = event.data!.match(/[~`*_]/)
		if (special) {
			console.log(this.nodeValue, this.node.value)
		} else {
			this.node.value = selection.focusNode!.nodeValue || ""
			return true
		}
	}

	handleKeydown(selection: Selection, event: KeyboardEvent) {
		return false
	}

	selfInsertText(text: string, range: StaticRange): CaretInstruction {
		this.node.value =
			this.node.value.slice(0, range.startOffset) +
			text +
			this.node.value.slice(range.endOffset)
		return {
			type: "text",
			element: this.interestingChildren[0] as Text,
			startOffset: range.startOffset + 1,
		}
	}
}

export class MayoParentElement<
	AstNodeType extends md.Parent
> extends MayoElement<AstNodeType> {
	atBeginningOfTextNode(selection: Selection) {
		return selection.focusOffset == 0
	}

	indexOfTextNode(selection: Selection) {
		return this.interestingChildren.indexOf(selection.focusNode! as ChildNode)
	}

	atBeginningOfBlock(selection: Selection) {
		return (
			this.atBeginningOfTextNode(selection) &&
			this.indexOfTextNode(selection) == 0
		)
	}

	atBeginningOfBlock_(range: StaticRange): boolean {
		return (
			range.collapsed &&
			this.interestingChildren.indexOf(range.startContainer) == 0 &&
			range.startOffset == 0
		)
	}

	handleKeydown(selection: Selection, event: KeyboardEvent): boolean {
		// TODO go up until you find a block element for the Ctrl-a Ctrl-e bindings

		if (
			this.atBeginningOfTextNode(selection) &&
			!this.atBeginningOfBlock(selection)
		) {
			switch (event.key.toLowerCase()) {
				case "backspace": {
					let previousIndex = this.indexOfTextNode(selection) - 1
					let previousNode = this.node.children[previousIndex]
					if (previousNode.type == "inlineCode") {
						previousNode.value =
							pairSymbolFor(previousNode) + previousNode.value
						previousNode.type = "text"

						return true
					} else if (
						previousNode.type == "emphasis" ||
						previousNode.type == "strong" ||
						previousNode.type == "delete"
					) {
						this.node.children.splice(
							previousIndex,
							1,
							...previousNode.children
						)

						previousNode.value =
							pairSymbolFor(previousNode) + previousNode.value
						this.node
						return true
					}
				}
			}
		}
		return false
	}

	selfInsertText(text: string, range: StaticRange): CaretInstruction {
		// TODO if the character is special, and the range is !caret then wrap the selected area
		let targetTextNode = range.startContainer
		let targetIndex = this.interestingChildren.indexOf(targetTextNode)
		if (targetIndex == -1) {
			throw new Error(`${targetTextNode} is not a child of ${this}`)
		}

		let targetAstNode = this.node.children[targetIndex]
		if (targetAstNode.type != "text") {
			throw new Error(
				`expected the ast node to be of type text, got ${targetAstNode.type}`
			)
		}
		targetAstNode.value =
			targetAstNode.value.slice(0, range.startOffset) +
			text +
			targetAstNode.value.slice(range.endOffset)

		let caret = {
			type: "element" as const,
			element: this,
			index: targetIndex,
			startOffset: range.startOffset + 1,
		}

		return caret

		let ticks = targetAstNode.value.match(/(\s)`([^`]+)`(\s)/)

		if (ticks) {
			let tickIndex = targetAstNode.value.indexOf(ticks[0])
			let prespace = ticks[1]
			let tickContent = ticks[2]

			let aftspace = ticks[3]
			this.node.children.splice(
				targetIndex,
				1,
				u("text", targetAstNode.value.slice(0, tickIndex) + prespace),
				u("inlineCode", tickContent),
				u(
					"text",
					aftspace + targetAstNode.value.slice(tickIndex + ticks[0].length)
				)
			)
		}
	}

	insertTextAsCommonAncestor(
		startElement: MayoMdastContentElement,
		endElement: MayoMdastContentElement,
		text: event.data,
		range: StaticRange
	) {
		// This is tricky for me right now
		// but, what i want to to i think is
		// to move the startNode and endNode (which are both text nodes) up to being direct
		// children of `this`, removing the other nodes between start and end
		// and then merging them if they're the same type...
		// i think.
		//ithink
		let start
		let end
		if (startElement.no) {
		}
		this.node.children.splice()
		let startNode: md.Content
		let endNode: md.Content
		if (startElement == this) {
			let startIndex = this.interestingChildren.indexOf(range.startContainer)
			if (startIndex == -1) {
				throw new Error(`im not the ancestor of ${startElement}`)
			}
			startNode = this.node[startIndex]
		} else {
			for (let kid of this.interestingChildren) {
				if ("node" in kid) {
					if (find(kid.node, startElement.node)) {
						let x = startElement
						while (x.children) {}
					}
				}
			}
			// demote(this.node, startNode)
		}

		if (endElement == this) {
		}
	}

	insertParagraph(range: StaticRange) {
		if (range.collapsed) {
			if (range.startContainer.parentElement == this) {
				if (range.endOffset == range.endContainer.nodeValue.length) {
					console.log(this.parentElement.node)
				}
			}
		}
	}

	// TODO oh look a pattern
	deleteContentBackward(selection: Selection, event: InputEvent) {
		let index = this.interestingChildren.indexOf(
			selection.focusNode! as ChildNode
		)
		this.node.children[index].value = selection.focusNode!.nodeValue
		return true
	}

	deleteContentForward(selection: Selection, event: InputEvent) {
		let index = this.interestingChildren.indexOf(
			selection.focusNode! as ChildNode
		)
		this.node.children[index].value = selection.focusNode!.nodeValue
		return true
	}

	deleteByCut(selection: Selection, event: InputEvent) {
		// TODO figure out how to cut
		return event.preventDefault()
		let index = this.interestingChildren.indexOf(
			selection.focusNode! as ChildNode
		)
		this.node.children[index].value = selection.focusNode!.nodeValue
		return true
	}

	insertFromPaste(selection: Selection, event: InputEvent) {
		// TODO figure out how pasting works
		return event.preventDefault()
		let index = this.interestingChildren.indexOf(
			selection.focusNode! as ChildNode
		)
		this.node.children[index].value = selection.focusNode!.nodeValue
		return true
	}
}
