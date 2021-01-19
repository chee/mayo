import parse from "mdast-util-from-markdown"
import convertToHtml from "../convert-to-html"
import toMarkdown from "mdast-util-to-markdown"
import type * as md from "mdast"
import {target} from "@github/catalyst"
import shortId from "shortid"
import type {
	BeforeInputEvent,
	CaretInstruction,
	MayoContentElement,
} from "./index"
import {html, render} from "lit-html"
import u from "unist-builder"
import {MayoElement, MayoParentElement} from "./markdown/mayo-element"
// TODO learn how to declare types for this
// @ts-ignore
import compact from "mdast-util-compact"
import {visit} from "unist-utils-core"
import {insertParagraph} from "../utils"
import * as is from "../is"

export default class MayoDocumentElement extends HTMLElement {
	@target document: HTMLElement
	ast: md.Root
	content = ""

	get interestingChildren(): Node[] {
		return Array.from(this.document.childNodes).filter(
			n => "node" in n || n.nodeName == "#text"
		)
	}

	// straightUpWingTheSelection() {
	// 	let selection = document.getSelection()!
	// 	// TODO have the cases define a fixcaret fn
	// 	if (selection.focusNode == this.document) {
	// 		let block = this.document.children[
	// 			startBlockIndex
	// 		] as MayoContentElement
	// 		let node = block.interestingChildren[startElementIndex]
	// 		selection.getRangeAt(0).setStart(node, range.startOffset + 1)
	// 		selection.getRangeAt(0).setEnd(node, range.startOffset + 1)
	// 	} else if (selection.focusNode == range.startContainer) {
	// 		selection.getRangeAt(0).setStart(selection.focusNode, range.startOffset + 1)
	// 		selection.getRangeAt(0).setEnd(selection.focusNode, range.startOffset + 1)
	// 	} else {
	// 		console.log(
	// 			selection.focusNode,
	// 			"...is the focus node btw, compared to",
	// 			range.startContainer
	// 		)
	// 		selection
	// 			.getRangeAt(0)
	// 			.setStart(range.startContainer, range.startOffset + 1)
	// 		selection.getRangeAt(0).setEnd(selection.focusNode, range.startOffset + 1)
	// 	}
	// }

	updateSelection(caret: CaretInstruction | null) {
		let selection = document.getSelection()!
		if (caret) {
			let target: Text | null = null
			if (caret && caret.type == "id") {
				let parent = document.getElementById(
					caret.id
				) as MayoParentElement<any>
				target = parent.interestingChildren[caret.index] as Text
			} else if (caret && caret.type == "parent") {
				target = caret.parent.interestingChildren[caret.index] as Text
			} else if (caret && caret.type == "text") {
				target = caret.element
			}
			if (target) {
				selection.removeAllRanges()
				let range = document.createRange()
				range.setStart(target, caret ? caret.startOffset : 0)
				selection.addRange(range)
			}
		} else {
			// this.straightUpWingTheSelection()
		}
		console.log(selection)
	}

	handleInput(event: BeforeInputEvent) {
		// TODO multiple ranges?

		let range: StaticRange = event.getTargetRanges()[0]
		let isCaret =
			range.endContainer == range.startContainer &&
			range.startOffset == range.endOffset
		let isRange = !isCaret

		let startElement = range.startContainer
			.parentElement! as MayoContentElement
		let endElement = range.endContainer.parentElement! as MayoContentElement

		let startNode: md.Content = startElement.node
		let endNode: md.Content = startElement.node

		let startBlockElement = startElement.block
			? startElement
			: (startElement.closest("[block]")! as MayoParentElement<any>)

		let endBlockElement = endElement.block
			? endElement
			: (endElement.closest("[block]")! as MayoParentElement<any>)

		// the index of the start block in the mayo-document (y)
		let startBlockIndex = Array.from(this.document.children).indexOf(
			startBlockElement
		)

		let endBlockIndex = Array.from(this.document.children).indexOf(
			endBlockElement
		)

		// the index of the start element in the start block (x)
		let startElementIndex = 0
		if (startElement.inline) {
			startElementIndex = startBlockElement.interestingChildren.indexOf(
				startElement
			)
		} else if (startElement.block) {
			startElementIndex = startBlockElement.interestingChildren.indexOf(
				range.startContainer
			)
		}

		let endElementIndex = 0
		if (endElement.inline) {
			endElementIndex = endBlockElement.interestingChildren.indexOf(endElement)
		} else if (endElement.block) {
			endElementIndex = endBlockElement.interestingChildren.indexOf(
				range.endContainer
			)
		}
		switch (event.inputType) {
			case "insertReplacementText":
				event.dataTransfer.items[0].getAsString(text => {
					startElement.selfInsertText(text, range)
					this.setAttribute("dirty", "true")
					this.update()
				})
				break
			case "insertText": {
				let caret: CaretInstruction | null = null
				if (range.startContainer == range.endContainer) {
					caret = startElement.selfInsertText(event.data || "", range)
					event.preventDefault()
				} else if (startBlockElement == endBlockElement) {
					caret = (startBlockElement as MayoParentElement<any>).insertTextAsCommonAncestor(
						startElement,
						endElement,
						event.data || "",
						range
					)
				} else {
					// TODO this is a textInsert across blocks, sounds hard
				}

				this.setAttribute("dirty", "true")
				this.update()
				this.updateSelection(caret)
				break
			}
			case "insertLineBreak": {
				let index = startBlockElement.interestingChildren.indexOf(startElement)
				startBlockElement.node.children.splice(index + 1, 0, u("break"))
				this.setAttribute("dirty", "true")
				this.update()
				event.preventDefault()
				break
			}
			case "insertParagraph": {
				let id = shortId()
				if ("value" in startElement.node) {
					// TODO isLiteralElement typeguard
					insertParagraph(this.ast, startElement.node, range.startOffset, id)
				} else if (startElement == startBlockElement) {
					insertParagraph(
						this.ast,
						startElement.node.children[startElementIndex],
						range.startOffset,
						id
					)
				} else {
					let idx = startElement.interestingChildren.indexOf(
						range.startContainer
					)
					insertParagraph(
						this.ast,
						startElement.node.children[idx],
						range.startOffset,
						id
					)
				}

				this.setAttribute("dirty", "true")
				this.update()
				this.updateSelection({
					type: "id" as const,
					id,
					index: 0,
					startOffset: 0,
				})
				break
			}
			case "deleteContentBackward": {
				let atStartOfSomeChild =
					range.startContainer == range.endContainer &&
					"node" in range.startContainer
				let child = range.startContainer as MayoElement<md.PhrasingContent>
				console.log(range)
				let index = startElement.interestingChildren.indexOf(child)

				if (atStartOfSomeChild) {
					switch (child.node.type) {
						case "strong":
						case "emphasis":
						case "delete":
							startElement.node.children.splice(
								index,
								1,
								...child.node.children
							)
							this.update()
							event.preventDefault()
							break
						case "inlineCode":
							child.node.type = "text"
							this.update()
							event.preventDefault()
							break
					}
					this.updateSelection({
						type: "parent",
						parent: startBlockElement,
						index: index,
						startOffset: 0,
					})
				} else if (range.startContainer == range.endContainer) {
					let caret = startElement.selfDeleteContentBackward(range)
					this.setAttribute("dirty", "true")
					this.update()
					this.updateSelection(caret)
				}
				break
			}
			case "deleteContentForward": {
				let atStartOfBlock =
					startElement == startBlockElement && range.collapsed
			}
			case "deleteByCut":
			case "insertOrderedList":
			case "insertUnorderedList":
			case "insertHorizontalRule":
			case "insertFromYank":
			case "insertFromDrop":
			case "insertFromPaste":
			case "insertFromPasteAsQuotation":
			case "insertTranspose":
			case "insertCompositionText":
			case "insertLink":
			case "deleteWordBackward":
			case "deleteWordForward":
			case "deleteSoftLineBackward":
			case "deleteSoftLineForward":
			case "deleteEntireSoftLine":
			case "deleteHardLineBackward":
			case "deleteHardLineForward":
			case "deleteByDrag":
			case "deleteContent":
			case "historyUndo":
			case "historyRedo":
			case "formatBold":
			case "formatItalic":
			case "formatUnderline":
			case "formatStrikeThrough":
			case "formatSuperscript":
			case "formatSubscript":
			case "formatJustifyFull":
			case "formatJustifyCenter":
			case "formatJustifyRight":
			case "formatJustifyLeft":
			case "formatIndent":
			case "formatOutdent":
			case "formatRemove":
			case "formatSetBlockTextDirection":
			case "formatSetInlineTextDirection":
			case "formatBackColor":
			case "formatFontColor":
			case "formatFontName":
				console.log(`unhandled input event: ${event.inputType}`)
		}

		event.preventDefault()
		//this.updateForTransform(event)
	}

	updateForTransform(caret: CaretInstruction) {
		this.setAttribute("dirty", "true")
		this.update()
		this.updateSelection(caret)
	}

	handleKeydown(event: KeyboardEvent) {
		if (event.key == "s" && (event.ctrlKey || event.metaKey)) {
			this.save()
			event.preventDefault()
		}
	}

	save() {
		localStorage.setItem("file", toMarkdown(this.ast))
		this.removeAttribute("dirty")
	}

	update() {
		this.ast = compact(this.ast)
		render(convertToHtml(this.ast, this.ast), this.document)
		// TODO show symbols for the node the caret is in
	}

	connectedCallback() {
		render(
			html`<article
				id="doc"
				contenteditable
				block
				container
				data-target="mayo-document.document"
				data-action="beforeinput:mayo-document#handleInput keydown:mayo-document#handleKeydown"
			></article>`,
			this
		)

		//this.document = document.getElementById("doc")

		let file = localStorage.getItem("file")
		if (!file) {
			file = `# hello \`this\` and _that_ (and \`others\`)

this is an _ordinary **\`document\` about** ordinary_ things, there's **nothing _going_ on**
here of _interest to you_, or me, or anybody else.


## a list

- one
- two
- three

1. first thing
2. second
3. the aeroplane

## the other thing

- one

images like ![dog in hat](https://i.pinimg.com/originals/c1/40/6f/c1406f93f49e896ff7c54c26bbfda047.jpg) and so on

> help
> this is why i need help

\`\`\`cpp filename="hello"
auto sum(std::vector<int> nums) {
	auto result = 0;
	for (auto num : nums) {
		result += num;
	}
	return result;
}
\`\`\`
`
		}
		this.ast = compact(parse(file))

		localStorage.setItem("file", toMarkdown(this.ast))
		this.update()
	}
}
