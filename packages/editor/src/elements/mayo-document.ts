import parse from "mdast-util-from-markdown"
import convertToHast from "mdast-util-to-hast"
import convertToHtml from "hast-util-to-html"
import type {Root as mdRoot, Heading as mdHeading} from "mdast"
import {target, targets} from "@github/catalyst"
import handlers from "../handlers"
import type {
	MayoBlockElement,
	MayoCodeblockElement,
	MayoFootnoteElement,
	MayoHeadingElement,
	MayoThematicBreakElement,
	MayoImageElement,
	MayoListItemElement,
	MayoListElement,
	MayoParagraphElement,
	MayoBlockquoteElement,
	MayoRootElement,
	MayoTableElement,
} from "./index"
import visit from "unist-util-visit"
import {Node as UnistNode} from "unist"

function atBeginning(root: Node) {
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

function isModified(event: KeyboardEvent) {
	return event.ctrlKey || event.metaKey || event.altKey
}

interface TransformEvent extends CustomEvent {
	detail: {
		element: MayoBlockElement
		originalEvent: KeyboardEvent | InputEvent
	}
}

interface SelectEvent extends CustomEvent {
	detail: {
		element: MayoBlockElement
		originalEvent?: MouseEvent
	}
}

function isKeyboardEvent(event: Event): event is KeyboardEvent {
	return event.type == "keydown"
}

function isInputEvent(event: Event): event is InputEvent {
	return event.type == "input"
}

let KEYS_THAT_ARE_EVER_SPECIAL = /^[`~_*-]$/

export default class MayoDocumentElement extends HTMLElement {
	@target document: HTMLElement
	@targets blocks: MayoBlockElement[]
	@targets codeblocks: MayoCodeblockElement[]
	@targets footnotes: MayoFootnoteElement[]
	@targets headings: MayoHeadingElement[]
	@targets hrs: MayoThematicBreakElement[]
	@targets images: MayoImageElement[]
	@targets items: MayoListItemElement[]
	@targets lists: MayoListElement[]
	@targets paragraphs: MayoParagraphElement[]
	@targets quotes: MayoBlockquoteElement[]
	@targets roots: MayoRootElement[]
	@targets tables: MayoTableElement[]
	@target activeBlock: MayoBlockElement

	select(event: SelectEvent) {
		if (this.activeBlock) {
			delete this.activeBlock.dataset.target
		}

		event.detail.element.dataset.target = "mayo-document.activeBlock"
	}

	transform({detail: {originalEvent, element}}: TransformEvent) {
		let selection = document.getSelection()
		let isCaret = selection!.anchorOffset == selection!.focusOffset
		let isRange = !isCaret

		let name = element.nodeName.toLowerCase().replace(/^mayo-/, "")
		if (isInputEvent(originalEvent)) {
			console.log(originalEvent)
		}
		if (isKeyboardEvent(originalEvent)) {
			let key = originalEvent.key.toLowerCase()
			if (
				name == "heading" &&
				!isModified(originalEvent) &&
				atBeginning(element.root) &&
				(key == "#" || key == "backspace")
			) {
				let index = this.headings.findIndex(n => n == element)

				let astHeadings: mdHeading[] = []
				// @ts-ignore
				visit(this.ast, "heading", (node: mdHeading) => {
					astHeadings.push(node)
					return node
				})
				let heading = astHeadings[index]

				if (key == "#") {
					heading.depth += 1
					if (heading.depth > 6) {
						heading.depth = 6
					}
				} else if (key == "backspace") {
					heading.depth -= 1
					if (heading.depth < 1) {
						heading.depth = 1
					}
				}

				this.update()
				let range = document.createRange()
				range.setStart(this.headings[index].root, 0)
				selection?.removeAllRanges()
				selection?.addRange(range!)

				originalEvent.preventDefault()
			}
		}
	}
	ast: mdRoot
	content = ""
	update() {
		this.content = convertToHtml(
			convertToHast(this.ast, {
				allowDangerousHtml: true,
				handlers: handlers,
			})
		)
		this.document.innerHTML = this.content
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
