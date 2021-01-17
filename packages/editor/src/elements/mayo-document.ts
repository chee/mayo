import parse from "mdast-util-from-markdown"
import convertToHtml from "../convert-to-html"
import toMarkdown from "mdast-util-to-markdown"
import type * as md from "mdast"
import {target, targets} from "@github/catalyst"
import cloneDeep from "clone-deep"
import shortId from "shortid"
import type {
	MayoBreakElement,
	MayoCodeElement,
	MayoInlineCodeElement,
	MayoDefinitionElement,
	MayoDeleteElement,
	MayoEmphasisElement,
	MayoFootnoteDefinitionElement,
	MayoFootnoteElement,
	MayoFootnoteReferenceElement,
	MayoHeadingElement,
	MayoThematicBreakElement,
	MayoHtmlElement,
	MayoImageElement,
	MayoImageReferenceElement,
	MayoListItemElement,
	MayoLinkElement,
	MayoLinkReferenceElement,
	MayoListElement,
	MayoParagraphElement,
	MayoBlockquoteElement,
	MayoFlowContentElement,
	MayoPhrasingContentElement,
	MayoRootElement,
	MayoStrongElement,
	MayoTableElement,
	MayoTextElement,
	MayoTomlElement,
	MayoYamlElement,
	MayoContentElement,
	MayoMdastContentElement,
	BeforeInputEvent,
	CaretInstruction,
} from "./index"
import {getMayoName, find, remove, pairSymbolFor} from "../utils"
import {html, render} from "lit-html"
import u from "unist-builder"
import {MayoParentElement} from "./markdown/mayo-element"

export default class MayoDocumentElement extends HTMLElement {
	@target document: HTMLElement
	@targets blockquotes: MayoBlockquoteElement[]
	@targets breaks: MayoBreakElement[]
	@targets codes: MayoCodeElement[]
	@targets deletes: MayoDeleteElement[]
	@targets emphasiss: MayoEmphasisElement[]
	@targets footnoteReferences: MayoFootnoteReferenceElement[]
	@targets footnotes: MayoFootnoteElement[]
	@targets headings: MayoHeadingElement[]
	@targets htmls: MayoHtmlElement[]
	@targets imageReferences: MayoImageReferenceElement[]
	@targets images: MayoImageElement[]
	@targets inlineCodes: MayoInlineCodeElement[]
	@targets linkReferences: MayoLinkReferenceElement[]
	@targets links: MayoLinkElement[]
	@targets listItems: MayoListItemElement[]
	@targets lists: MayoListElement[]
	@targets paragraphs: MayoParagraphElement[]
	@targets roots: MayoRootElement[]
	@targets strongs: MayoStrongElement[]
	@targets tables: MayoTableElement[]
	@targets texts: MayoTextElement[]
	@targets thematicBreaks: MayoThematicBreakElement[]
	@targets tomls: MayoTomlElement[]
	@targets yamls: MayoYamlElement[]
	@targets definitions: MayoDefinitionElement[]
	@targets footnoteDefinitions: MayoFootnoteDefinitionElement[]
	@target activeBlock: MayoFlowContentElement
	ast: md.Root
	content = ""

	select(event: MouseEvent) {
		if (this.activeBlock) {
			delete this.activeBlock.dataset.target
		}
		let element = event.currentTarget! as MayoMdastContentElement

		element.dataset.target = "mayo-document.activeBlock"

		let sel = document.getSelection()
		let offset = sel?.focusOffset
	}

	insertParagraph(event: CustomEvent) {
		let element = event.target
		let range = event.detail.range
		console.log({element, range})
	}

	updateSelection(caret: CaretInstruction | null) {
		let selection = document.getSelection()!
		if (caret) {
			let target: Text | null = null
			if (caret && caret.type == "id") {
				let parent = this.shadowRoot!.getElementById(
					caret.id
				) as MayoParentElement<any>
				target = parent.interestingChildren[caret.index] as Text
			} else if (caret && caret.type == "element") {
				target = caret.element.interestingChildren[caret.index] as Text
			} else if (caret && caret.type == "text") {
				target = caret.element
			}
			if (target) {
				console.log(target)
				selection.removeAllRanges()
				let r = document.createRange()
				r.setStart(target, caret ? caret.startOffset : 0)
				selection.addRange(r)
			}
		}
	}

	handleInput(event: BeforeInputEvent) {
		// TODO multiple ranges?
		let range: StaticRange = event.getTargetRanges()[0]
		let isCaret =
			range.endContainer == range.startContainer &&
			range.startOffset == range.endOffset
		let isRange = !isCaret

		let startElement = range.startContainer
			.parentElement! as MayoMdastContentElement
		let endElement = range.endContainer
			.parentElement! as MayoMdastContentElement

		let startNode: md.Content = startElement.node
		let endNode: md.Content = startElement.node

		let startBlockElement =
			startElement.type == "block"
				? startElement
				: (startElement.closest(
						'[mayo-type="block"]'
				  )! as MayoMdastContentElement)

		let endBlockElement =
			endElement.type == "block"
				? endElement
				: (endElement.closest(
						'[mayo-type="block"]'
				  )! as MayoMdastContentElement)

		// the index of the start block in the mayo-document (y)
		let startBlockIndex = Array.from(this.document.children).indexOf(
			startBlockElement
		)

		let endBlockIndex = Array.from(this.document.children).indexOf(
			endBlockElement
		)

		// the index of the start element in the start block (x)
		let startElementIndex = 0
		if (startElement.type == "inline") {
			startElementIndex = startBlockElement.interestingChildren.indexOf(
				startElement
			)
		} else if (startElement.type == "block") {
			startElementIndex = startBlockElement.interestingChildren.indexOf(
				range.startContainer
			)
		}

		let endElementIndex = 0
		if (endElement.type == "inline") {
			endElementIndex = endBlockElement.interestingChildren.indexOf(endElement)
		} else if (endElement.type == "block") {
			endElementIndex = endBlockElement.interestingChildren.indexOf(
				range.endContainer
			)
		}
		switch (event.inputType) {
			case "insertText": {
				let caret: CaretInstruction | null = null
				if (range.startContainer == range.endContainer) {
					// TODO expect caret instructions as a return value
					caret = startElement.selfInsertText(event.data, range)
					event.preventDefault()
				} else if (startBlockElement == endBlockElement) {
					caret = startBlockElement.insertTextAsCommonAncestor(
						startElement,
						endElement,
						event.data,
						range
					)
				}

				this.setAttribute("dirty", "true")
				this.update()
				this.updateSelection(caret)

				// let sel = document.getSelection()!
				// // TODO have the cases define a fixcaret fn
				// if (sel.focusNode == this.document) {
				// 	let block = this.document.children[
				// 		startBlockIndex
				// 	] as MayoMdastContentElement
				// 	let node = block.interestingChildren[startElementIndex]
				// 	sel.getRangeAt(0).setStart(node, range.startOffset + 1)
				// 	sel.getRangeAt(0).setEnd(node, range.startOffset + 1)
				// } else if (sel.focusNode == range.startContainer) {
				// 	sel.getRangeAt(0).setStart(sel.focusNode, range.startOffset + 1)
				// 	sel.getRangeAt(0).setEnd(sel.focusNode, range.startOffset + 1)
				// } else {
				// 	console.log(
				// 		sel.focusNode,
				// 		"...is the focus node btw, compared to",
				// 		range.startContainer
				// 	)
				// 	sel
				// 		.getRangeAt(0)
				// 		.setStart(range.startContainer, range.startOffset + 1)
				// 	sel.getRangeAt(0).setEnd(sel.focusNode, range.startOffset + 1)
				// }
				break
			}
			case "insertReplacementText":
			case "insertLineBreak": {
				let index = startBlockElement.interestingChildren.indexOf(startElement)
				startBlockElement.node.children.splice(index + 1, 0, u("break"))
				this.update()
				event.preventDefault()
				break
			}
			case "insertParagraph": {
				let index = this.ast.children.indexOf(startBlockElement.node)
				let id = shortId()
				this.ast.children.splice(
					index + 1,
					0,
					u("paragraph", {id}, [u("text", " ")])
				)
				this.update()
				event.preventDefault()
				let sel = document.getSelection()!
				sel
					.getRangeAt(0)
					.setStart(
						this.shadowRoot!.getElementById(id).interestingChildren[0],
						0
					)
				break
			}
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
			case "deleteByCut":
			case "deleteContent":
			case "deleteContentBackward":
			case "deleteContentForward":
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

	getCaretCoördinate() {
		let sel = document.getSelection()
		let focusNode = sel?.focusNode!
		let offset = sel?.focusOffset!
		let mayoNode = focusNode.parentElement! as MayoMdastContentElement
		let type = mayoNode?.getAttribute("mayo-type")
		let closestBlock = mayoNode
		if (type == "inline") {
			let closest = mayoNode.closest('[mayo-type="block"]')
			if (!closest) {
				throw new Error("couldn't find an enclosing block :(")
			}
			closestBlock = closest as MayoMdastContentElement
		}
		let blockIndex = Array.from(this.document.children).indexOf(closestBlock)
		let nodeIndex = 0
		if (type == "inline") {
			nodeIndex = closestBlock.interestingChildren.indexOf(mayoNode)
		} else if (type == "block") {
			nodeIndex = closestBlock.interestingChildren.indexOf(focusNode)
		} else {
			console.error(
				`don't know what to do with a block that isn't inline or block re: ${mayoNode.tagName}`
			)
		}
		return {blockIndex, nodeIndex, offset}
	}

	updateForTransform(event: Event) {
		event.preventDefault()
		// let coördinate = this.getCaretCoördinate()
		// let sel = document.getSelection()
		// let preUpdateNode = sel?.focusNode!
		// let preUpdateOffset = sel?.focusOffset!
		this.setAttribute("dirty", "true")
		this.update()
		// if (sel?.focusNode == this.document) {
		// 	let block = this.document.children[coördinate.blockIndex]
		// 	let node = block.interestingChildren[coördinate.nodeIndex]
		// 	sel?.getRangeAt(0)?.setStart(node, coördinate.offset)
		// } else if (sel?.focusNode == preUpdateNode) {
		// 	sel?.getRangeAt(0)?.setStart(preUpdateNode, preUpdateOffset)
		// }
	}

	handleKeydown(event: KeyboardEvent) {
		let selection = document.getSelection()!
		let isCaret = selection!.anchorOffset == selection!.focusOffset
		let isRange = !isCaret
		let element = selection.focusNode
			?.parentElement! as MayoMdastContentElement
		// if ("handleKeydown" in element) {
		// 	let change = element.handleKeydown(selection, event)
		// 	if (change) {
		// 		this.updateForTransform(event)
		// 	}
		// }
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
		render(convertToHtml(this.ast), this.document)
		// TODO show symbols for the node the caret is in
	}

	connectedCallback() {
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
		this.ast = parse(file)

		localStorage.setItem("file", toMarkdown(this.ast))
		this.update()

		// setInterval(() => {
		// 	this.ast.children[0].depth = Math.floor(Math.random() * 5) + 1
		// 	this.update()
		// }, 3000)
	}
}
