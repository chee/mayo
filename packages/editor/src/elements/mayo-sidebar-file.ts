import {LitElement, html, css, customElement, property} from "lit-element"

@customElement("mayo-sidebar-file")
export default class MayoSidebarFileElement extends LitElement {
	@property()
	path: string
	static get styles() {
		return css`
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
		`
	}

	new() {
		localStorage.setItem("file", " ")
	}

	render() {
		let [name, ext] = this.path!.split(".")

		return html`<a href="${this.path!}" @click=${this.new} class="link">
			<span class="name">${name}</span>
			<span class="ext">${ext}</span>
		</a>`
	}
}
