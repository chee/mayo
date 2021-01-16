import type * as md from "mdast"
import {DefaultTemplateProcessor, html, render, TemplateResult} from "lit-html"
import {ifDefined} from "lit-html/directives/if-defined"
import {spread} from "@open-wc/lit-helpers"
import {getMayoName} from "./utils"
type Handler = (node: md.Content | md.Root) => any

interface Handlers {
	[type: string]: Handler
}

function children(node: md.Parent) {
	return html`${node.children.map(n => convertToHtml(n))}`
}

function value(node: md.Literal) {
	return node.value
}

function props(node: md.Content) {
	let p: {[k: string]: string} = {}
	let mayoName = getMayoName(node.type)
	p["data-targets"] = `mayo-document.${node.type}s`
	p["data-action"] = `
			click:mayo-document#select
			keydown:mayo-document#transform
			input:mayo-document#transform`
	let {data, position, type, children, ...rest} = node
	return Object.assign(p, rest)
}

function rootProps(node: mdContent) {
	let p: {[k: string]: string} = {}
}

let handlers: Handlers = {
	text(node) {
		node = node as md.Text
		return node.value
	},
	root(node) {
		node = node as md.Root
		return node.children.map(n => convertToHtml(n))
	},
	heading(node) {
		node = node as md.Heading
		let h = new TemplateResult(
			[
				`<h${node.depth} data-target="mayo-heading.root">`,
				`</h${node.depth}>`,
			],
			[children(node)],
			"",
			html``.processor
		)
		return html`<mayo-heading ...=${spread(props(node))}
			><div data-target="mayo-heading.styleHole"></div>
			${h}
		</mayo-heading>`
	},
	inlineCode(node) {
		node = node as md.InlineCode
		return html`<mayo-inline-code ...=${spread(props(node))}>
			<code data-target="mayo-inline-code.root">${value(node)}</code>
		</mayo-inline-code>`
	},
	emphasis(node) {
		node = node as md.Emphasis
		return html`<mayo-emphasis ...=${spread(props(node))}>
			<em data-target="mayo-emphasis.root">${children(node)}</em>
		</mayo-emphasis>`
	},
	strong(node) {
		node = node as md.Strong
		return html`<mayo-strong ...=${spread(props(node))}>
			<strong data-target="mayo-strong.root">${children(node)}</strong>
		</mayo-strong>`
	},
	paragraph(node) {
		node = node as md.Paragraph
		return html`<mayo-paragraph ...=${spread(props(node))}>
			<p data-target="mayo-paragraph.root">${children(node)}</p>
		</mayo-paragraph>`
	},
	list(node) {
		node = node as md.List
		let l = node.ordered
			? html`<ol data-target="mayo-list.root">
					${children(node)}
			  </ol>`
			: html`<ul data-target="mayo-list.root">
					${children(node)}
			  </ul>`
		return html`<mayo-list ...=${spread(props(node))}> ${l} </mayo-list>`
	},
	listItem(node) {
		node = node as md.ListItem
		return html`<mayo-list-item ...=${spread(props(node))}>
			<li data-target="mayo-list-item.root">${children(node)}</li>
		</mayo-list-item>`
	},
	blockquote(node) {
		node = node as md.Blockquote
		return html`<mayo-blockquote>
			<blockquote data-target="mayo-blockquote.root">
				${children(node)}
			</blockquote>
		</mayo-blockquote>`
	},
	code(node) {
		node = node as md.Code
		return html`<mayo-code ...=${spread(props(node))}>
			<pre data-target="mayo-code.root"><code>${value(node)}</code></pre>
		</mayo-code>`
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
