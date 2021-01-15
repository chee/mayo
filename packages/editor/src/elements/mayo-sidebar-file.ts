import {targets} from "@github/catalyst"
import {render, html} from "@github/jtml"

export default class MayoSidebarFileElement extends HTMLElement {
	@targets links: Array<HTMLElement>
	get css() {
		return html`<style>
			.link {
				text-decoration: none;
				color: #006;
				font-family: ibm plex mono, monospace;
				display: flex;
			}
			.link:hover {
				text-decoration: underline;
			}
			.name {
				font-weight: bold;
			}
			.ext {
				font-weight: 300;
				display: flex;
			}
			.ext:before {
				content: ".";
				display: inline;
			}
		</style>`
	}
	get path() {
		return this.getAttribute("path")
	}
	get html() {
		let [name, ext] = this.path!.split(".")

		return html`${this.css}
			<a href="${this.path!}" class="link">
				<span class="name">${name}</span>
				<span class="ext">${ext}</span>
			</a> `
	}
	connectedCallback() {
		render(this.html, this.shadowRoot!)
	}
}
