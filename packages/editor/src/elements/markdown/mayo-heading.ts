import {target} from "@github/catalyst"
import {render, html} from "lit-html"
import {templateContent} from "lit-html/directives/template-content"
import {MayoMdastContentElement} from ".."

export default class MayoHeadingElement extends HTMLElement {
	@target root: HTMLHeadingElement
	@target childrenTemplate: HTMLTemplateElement
	@target styleHole: HTMLElement
	select(event: MouseEvent) {
		this.dispatchEvent(
			new CustomEvent("select", {
				detail: {
					element: this,
					originalEvent: event,
				},
			})
		)
	}

	transform(event: KeyboardEvent) {
		this.dispatchEvent(
			new CustomEvent("transform", {
				detail: {
					element: this,
					originalEvent: event,
				},
			})
		)
	}

	connectedCallback() {
		let style = html`<style>
			${[1, 2, 3, 4, 5, 6].map(n => {
				return `h${n}::before {
					content: "${"#".repeat(n)} ";
					font-family: ibm plex mono, monospace;
					font-style: italic;
					display: inline-block;
					font-size: 0.8em;
					color: #77c;
				}`
			})}
		</style>`

		render(style, this.styleHole)
	}
}
