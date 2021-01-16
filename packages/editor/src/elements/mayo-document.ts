import parse from "mdast-util-from-markdown"
// import convertToHast from "mdast-util-to-hast"
//import convertToHtml from "hast-util-to-html"
import convertToHtml from "../convert-to-html"
import type {
	Root as mdRoot,
	Heading as mdHeading,
	Paragraph as mdParagraph,
	Content as mdContent,
} from "mdast"
import {target, targets} from "@github/catalyst"
import handlers from "../handlers"
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
} from "./index"
import visit from "unist-util-visit"
import {Node as UnistNode} from "unist"
import {getMayoName, find} from "../utils"
import {html, render} from "lit-html"

function caretIsAtBeginningOf(root: Node) {
	let s = document.getSelection()
	let anchor = s!.anchorNode
	let children = Array.from(root.childNodes)
	let indexInParent = children.findIndex(n => n == anchor)
	return (
		(root == anchor || indexInParent === 0) &&
		s!.anchorOffset === 0 &&
		s!.focusOffset === 0
	)
}

function hasKeyboardModifiers(event: KeyboardEvent) {
	return event.ctrlKey || event.metaKey || event.altKey
}

interface TransformEvent extends CustomEvent {
	detail: {
		element: MayoMdastContentElement
		originalEvent: KeyboardEvent | InputEvent
	}
}

interface SelectEvent extends CustomEvent {
	detail: {
		element: MayoFlowContentElement
		originalEvent?: MouseEvent
	}
}

function isKeyboardEvent(event: Event): event is KeyboardEvent {
	return event.type == "keydown"
}

function isInputEvent(event: Event): event is InputEvent {
	return event.type == "input"
}

function getNameOf(element: MayoMdastContentElement) {
	return element.tagName
		.toLowerCase()
		.replace(/^mayo-/, "")
		.replace(/-([a-z])/g, $1 => $1[1].toUpperCase())
}

interface Caret {
	node?: mdContent
	element?: MayoMdastContentElement
	offset: number
}

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
	ast: mdRoot
	caret: Caret = {
		element: undefined,
		node: undefined,
		offset: 0,
	}
	content = ""

	select(event: MouseEvent) {
		if (this.activeBlock) {
			delete this.activeBlock.dataset.target
		}
		let element = event.currentTarget! as MayoMdastContentElement

		element.dataset.target = "mayo-document.activeBlock"

		let node = this.getNodeForElement(element)

		let sel = document.getSelection()
		let offset = sel?.focusOffset
		this.caret = {
			node,
			element: element,
			offset: offset || 0,
		}
	}

	getElementForNode(node: mdContent): MayoMdastContentElement {
		let index = 0
		let seen = false
		visit(this.ast, node.type, (n: mdContent) => {
			if (!seen) {
				if (n == node) {
					seen = true
				} else {
					index += 1
				}
			}
		})

		// @ts-ignore
		return this[node.type + "s"][index]
	}

	getNodeForElement(element: MayoMdastContentElement): mdContent {
		let name = getNameOf(element)

		// @ts-ignore
		let index: number = this[name + "s"].findIndex((n: Node) => n == element)

		let astNodes: mdContent[] = []

		visit(
			this.ast,
			// @ts-ignore
			name,
			(node: mdContent) => {
				astNodes.push(node)
				return node
			}
		)

		return astNodes[index]
	}

	handleBeginning(key: string, element: MayoMdastContentElement): boolean {
		let name = getNameOf(element)

		if (key == "#") {
			if (["paragraph"].includes(name)) {
				let node = this.getNodeForElement(element)
				node.type = "heading"
				node.depth = 1
				return true
			}
			if (["heading"].includes(name)) {
				let node = this.getNodeForElement(element) as mdHeading
				if (node.depth < 6) {
					node.depth += 1
				}
				return true
			}
		}
		if (key == "backspace") {
			if (["listItem", "blockquote"].includes(name)) {
				let node = this.getNodeForElement(element)
				node.type = "paragraph"
				return true
			}
			if (["heading"].includes(name)) {
				let node = this.getNodeForElement(element) as mdHeading
				if (node.depth > 1) {
					node.depth -= 1
				} else {
					delete node.depth
					node.type = "paragraph"
				}
				return true
			}
		}
		return false
	}

	transform(event: KeyboardEvent | InputEvent) {
		console.log({event})
		let selection = document.getSelection()
		let isCaret = selection!.anchorOffset == selection!.focusOffset
		let isRange = !isCaret

		let name = element.nodeName.toLowerCase().replace(/^mayo-/, "")
		if (isInputEvent(originalEvent)) {
			console.log(originalEvent)
			if (originalEvent.inputType == "insertText") {
				let inputText = originalEvent.data
				console.log(
					originalEvent.originalTarget.getRootNode().host,
					this.texts,
					this.inlineCodes
				)
				let node = this.getNodeForElement(
					originalEvent.originalTarget.getRootNode().host
				)
				console.log({node})
				console.log(node.children)
				let currentText = node.value
				console.log(node.children)
			}
		}
		if (isKeyboardEvent(originalEvent)) {
			let key = originalEvent.key.toLowerCase()
			let atBeginning = caretIsAtBeginningOf(element.root)
			let keyMightBeSpecialAtBeginning = key.match(/^(?:[>`#*~-]|backspace)$/)

			if (
				atBeginning &&
				!hasKeyboardModifiers(originalEvent) &&
				keyMightBeSpecialAtBeginning
			) {
				if (this.handleBeginning(key, element)) {
					originalEvent.preventDefault()
					this.update()
				}
			}
		}
	}

	update() {
		render(convertToHtml(this.ast), this.document)

		// render(html`${this.content}`, this.document)

		// if (this.caret.node) {
		// 	let range = document.createRange()
		// 	let selection = document.getSelection()

		// 	range.setStart(
		// 		this.getElementForNode(this.caret.node).root,
		// 		this.caret.offset
		// 	)
		// 	selection?.removeAllRanges()
		// 	selection?.addRange(range!)
		// }

		// let selection = document.getSelection()
		// let shadow = selection?.focusNode?.getRootNode() as ShadowRoot
		// let enclosure = shadow.host as MayoContentElement

		// if (enclosure) {
		// 	this.caret = {
		// 		node: this.getNodeForElement(enclosure),
		// 		element: enclosure,
		// 		offset: selection?.focusOffset || 0,
		// 	}
		// }
	}
	connectedCallback() {
		this.ast = parse(`# hello \`this\` and _that_

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
`)
		this.update()
	}
}
