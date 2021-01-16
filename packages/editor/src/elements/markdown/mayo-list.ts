import {target, targets} from "@github/catalyst"
import {render, html} from "@github/jtml"
export default class MayoListElement extends HTMLElement {
	@target root: HTMLElement
	connectedCallback() {
		let style = document.createElement("style")
		style.innerHTML = `
			mayo-list-item {
				display: list-item;
			}
		`
		// this.shadowRoot!.appendChild(style)
	}
}
