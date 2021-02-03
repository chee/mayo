import {LitElement, html, css, customElement, property} from "lit-element"
import {ChooseEvent} from "./mayo-sidebar"

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

	new(event: Event) {
		this.dispatchEvent(
			new CustomEvent("file", {
				detail: {},
			})
		)
		localStorage.setItem(
			"file",
			`  
`
		)
		event?.preventDefault()
		let s = document.getSelection()

		s?.removeAllRanges()
		let r = document.createRange()
		r.setStart(
			document.getElementsByTagName("mayo-paragraph")[0]
				.interestingChildren[0],
			0
		)
		s?.addRange(r)
	}

	choose(event: Event) {
		event.preventDefault()
		let chooseEvent: ChooseEvent = new CustomEvent("open", {
			detail: {
				name: this.path,
			},
		})
		this.dispatchEvent(chooseEvent)
	}

	render() {
		let [name, ext] = this.path!.split(".")

		return html`<a href="${this.path!}" @click=${this.choose} class="link">
			<span class="name">${name}</span>
			<span class="ext">${ext}</span>
		</a>`
	}
}
