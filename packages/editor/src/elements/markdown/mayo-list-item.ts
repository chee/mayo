import {target, targets} from "@github/catalyst"
import {render, html} from "@github/jtml"
export default class MayoListItemElement extends HTMLElement {
	@target root: HTMLElement
	connectedCallback() {
		// let style = document.createElement("style")
		// style.innerHTML = `
		// 	li {
		// 		display: block;
		// 	}
		// `
		// this.shadowRoot!.append(style)
	}
}
