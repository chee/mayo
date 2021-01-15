import {target, targets} from "@github/catalyst"
import {render, html} from "@github/jtml"
export default class MayoListElement extends HTMLElement {
	@target root: HTMLElement
	connectedCallback() {
		this.shadowRoot!.appendChild()
	}
}
