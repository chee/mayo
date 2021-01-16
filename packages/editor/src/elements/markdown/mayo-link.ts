import {target, targets} from "@github/catalyst"
import {render, html} from "@github/jtml"
export default class MayoLinkElement extends HTMLElement {
	@target root: HTMLAnchorElement
	connectedCallback() {}
}
