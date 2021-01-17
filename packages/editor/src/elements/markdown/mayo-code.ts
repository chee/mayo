import {target, targets} from "@github/catalyst"
import {render, html} from "lit-html"
import * as md from "mdast"

// TODO shit in the garden
let css = html`<style>
	.hljs,
	.hljs-subst {
		color: #444;
	}

	.hljs-comment {
		color: #888888;
	}

	.hljs-keyword,
	.hljs-attribute,
	.hljs-selector-tag,
	.hljs-meta-keyword,
	.hljs-doctag,
	.hljs-name {
		font-weight: bold;
	}

	.hljs-type,
	.hljs-string,
	.hljs-number,
	.hljs-selector-id,
	.hljs-selector-class,
	.hljs-quote,
	.hljs-template-tag,
	.hljs-deletion {
		color: #880000;
	}

	.hljs-title,
	.hljs-section {
		color: #880000;
		font-weight: bold;
	}

	.hljs-regexp,
	.hljs-symbol,
	.hljs-variable,
	.hljs-template-variable,
	.hljs-link,
	.hljs-selector-attr,
	.hljs-selector-pseudo {
		color: #bc6060;
	}

	.hljs-literal {
		color: #78a960;
	}

	.hljs-built_in,
	.hljs-bullet,
	.hljs-code,
	.hljs-addition {
		color: #397300;
	}
	.hljs-meta {
		color: #1f7199;
	}

	.hljs-meta-string {
		color: #4d99bf;
	}

	/* Misc effects */

	.hljs-emphasis {
		font-style: italic;
	}

	.hljs-strong {
		font-weight: bold;
	}
	.lang,
	.meta {
		user-select: none;
	}
	.lang {
		background: white;
		position: absolute;
		top: 0;
	}
	mayo-code {
		position: relative;
	}
</style>`

export default class MayoCodeElement extends HTMLElement {
	@target root: HTMLElement
	node: md.Code

	// TODO highlight on blur and remove on focus
	connectedCallback() {
		// this.classList.add(`language-${this.node.lang}`)
		// document.createElement("extras")
		// let style = document.createElement("style")
		// this.appendChild(style)
		// render(css, style)
		// let lang = document.createElement("span")
		// lang.className = "lang"
		// lang.contentEditable = "false"
		// this.appendChild(lang)
		// lang.innerHTML = this.node.lang || ""
		// let meta = document.createElement("span")
		// meta.className = "meta"
		// meta.contentEditable = "false"
		// this.appendChild(meta)
		// hljs.highlightBlock(this)
	}
}
