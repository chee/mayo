import {target, targets} from "@github/catalyst"
import {render, html} from "@github/jtml"
export default class MayoParagraphElement extends HTMLElement {
	@target root: HTMLElement
	connectedCallback() {}
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
}
