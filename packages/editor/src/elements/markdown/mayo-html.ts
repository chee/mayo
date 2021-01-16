import {target, targets} from "@github/catalyst"
import {render, html} from "@github/jtml"
export default class MayoHtmlElement extends HTMLElement {
	@target root: HTMLElement
	connectedCallback() {}
}
