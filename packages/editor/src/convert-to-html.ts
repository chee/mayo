import type * as md from "mdast"
import {html, TemplateResult} from "lit-html"
import {spread} from "@open-wc/lit-helpers"
import {getMayoName} from "./utils"
import {templateContent} from "lit-html/directives/template-content"

type Handler = (node: md.Content | md.Root) => any

interface Handlers {
	[type: string]: Handler
}

function children(node: md.Parent) {
	let name = getMayoName(node.type)
	return html`${node.children.map(n => convertToHtml(n))}`
}

function value(node: md.Literal) {
	let name = getMayoName(node.type)
	return html`${node.value}`
}

function spreadable(node: md.Content) {
	let {data, position, children, ...spreadable} = node
	return spreadable
}

let handlers: Handlers = {
	blockquote(node) {
		node = node as md.Blockquote
		return html`<mayo-blockquote
			...="${spread(spreadable(node))}"
			.node=${node}
		>
			${children(node)}
		</mayo-blockquote>`
	},

	break(node) {
		node = node as md.Break
		return html`<mayo-break
			...="${spread(spreadable(node))}"
			.node=${node}
		></mayo-break>`
		// return html`<br />`
	},

	code(node) {
		node = node as md.Code
		return html`<mayo-code ...="${spread(spreadable(node))}" .node=${node}
			>${value(node)}</mayo-code
		>`
	},

	delete(node) {
		node = node as md.Delete
		return html`<mayo-delete ...="${spread(spreadable(node))}" .node=${node}
			>${children(node)}</mayo-delete
		>`
	},

	emphasis(node) {
		node = node as md.Emphasis
		return html`<mayo-emphasis ...="${spread(spreadable(node))}" .node=${node}
			>${children(node)}</mayo-emphasis
		>`
	},

	footnoteReference(node) {
		node = node as md.FootnoteReference
		return html`<mayo-footnote-reference
			...="${spread(spreadable(node))}"
			.node=${node}
		></mayo-footnote-reference>`
	},

	footnote(node) {
		node = node as md.Footnote
		return html`<mayo-footnote ...="${spread(spreadable(node))}" .node=${node}
			>${children(node)}</mayo-footnote
		>`
	},

	heading(node) {
		node = node as md.Heading
		let h
		switch (node.depth) {
			case 1:
				h = html`<h1>${children(node)}</h1>`
				break
			case 2:
				h = html`<h2>${children(node)}</h2>`
				break
			case 3:
				h = html`<h3>${children(node)}</h3>`
				break
			case 4:
				h = html`<h4>${children(node)}</h4>`
				break
			case 5:
				h = html`<h5>${children(node)}</h5>`
				break
			case 6:
				h = html`<h6>${children(node)}</h6>`
				break
		}
		return html`<mayo-heading .node=${node} ...=${spread(spreadable(node))}
			>${children(node)}</mayo-heading
		>`
	},

	html(node) {
		node = node as md.HTML
		return html`<mayo-html ...="${spread(spreadable(node))}" .node=${node}
			>${value(node)}</mayo-html
		>`
	},

	imageReference(node) {
		node = node as md.ImageReference
		return html`<mayo-image-reference
			...="${spread(spreadable(node))}"
			.node=${node}
		></mayo-image-reference>`
	},

	image(node) {
		node = node as md.Image
		return html`<mayo-image
			...="${spread(spreadable(node))}"
			.node=${node}
		></mayo-image>`
	},

	inlineCode(node) {
		node = node as md.InlineCode
		return html`<mayo-inline-code
			...="${spread(spreadable(node))}"
			.node=${node}
			>${value(node)}</mayo-inline-code
		>`
	},

	linkReference(node) {
		node = node as md.LinkReference
		return html`<mayo-link-reference
			...="${spread(spreadable(node))}"
			.node=${node}
			>${children(node)}</mayo-link-reference
		>`
	},

	link(node) {
		node = node as md.Link
		return html`<mayo-link ...="${spread(spreadable(node))}" .node=${node}
			>${children(node)}</mayo-link
		>`
	},

	listItem(node) {
		node = node as md.ListItem
		return html`<mayo-list-item ...="${spread(spreadable(node))}" .node=${node}
			>${children(node)}</mayo-list-item
		>`
	},

	list(node) {
		node = node as md.List
		return html`<mayo-list ...="${spread(spreadable(node))}" .node=${node}
			>${children(node)}</mayo-list
		>`
	},

	paragraph(node) {
		node = node as md.Paragraph
		return html`<mayo-paragraph ...="${spread(spreadable(node))}" .node=${node}
			>${children(node)}</mayo-paragraph
		>`
	},

	root(node) {
		node = node as md.Root
		/* 		return html`<mayo-root ...="${spread(spreadable(node))}" .node=${node}>
			${children(node)}
		</mayo-root>` */
		return children(node)
	},

	strong(node) {
		node = node as md.Strong
		return html`<mayo-strong ...="${spread(spreadable(node))}" .node=${node}
			>${children(node)}</mayo-strong
		>`
	},

	table(node) {
		node = node as md.Table
		return html`<mayo-table ...="${spread(spreadable(node))}" .node=${node}
			>${children(node)}</mayo-table
		>`
	},

	text(node) {
		// You probably don't want this.
		// remember: if you enable this, every text (including those inside an <em>)
		// becomes a mayo- element
		// node = node as md.Text
		// return html`<mayo-text ...="${spread(spreadable(node))}" .node=${node}>
		// 	${value(node)}
		// </mayo-text>`
		return node.value
	},

	thematicBreak(node) {
		node = node as md.ThematicBreak
		return html`<mayo-thematic-break
			...="${spread(spreadable(node))}"
			.node=${node}
		></mayo-thematic-break>`
	},

	toml(node) {
		node = node as md.FrontmatterContent
		return html`<mayo-toml ...="${spread(spreadable(node))}" .node=${node}
			>${value(node)}</mayo-toml
		>`
	},

	yaml(node) {
		node = node as md.FrontmatterContent
		return html`<mayo-yaml ...="${spread(spreadable(node))}" .node=${node}
			>${value(node)}</mayo-yaml
		>`
	},

	definition(node) {
		node = node as md.Definition
		return html`<mayo-definition
			...="${spread(spreadable(node))}"
			.node=${node}
		></mayo-definition>`
	},

	footnoteDefinition(node) {
		node = node as md.FootnoteDefinition
		return html`<mayo-footnote ...="${spread(spreadable(node))}" .node=${node}
			>${children(node)}</mayo-footnote
		>`
	},
}

export default function convertToHtml(
	node: md.Content | md.Root
): TemplateResult | string {
	let handler = handlers[node.type]
	if (handler) {
		return handler(node)
	} else {
		throw new Error(node.type)
	}
}
