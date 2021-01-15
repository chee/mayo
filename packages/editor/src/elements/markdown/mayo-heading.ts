import {target} from "@github/catalyst"
import {render, html} from "@github/jtml"

function keymap(bindings: any) {
	// map[ctrlKey][shiftKey][altKey][metaKey][key]
	let map: any = {
		true: {
			true: {
				true: {
					true: {},
					false: {},
				},
				false: {
					true: {},
					false: {},
				},
			},
			false: {
				true: {
					true: {},
					false: {},
				},
				false: {
					true: {},
					false: {},
				},
			},
		},
		false: {
			true: {
				true: {
					true: {},
					false: {},
				},
				false: {
					true: {},
					false: {},
				},
			},
			false: {
				true: {
					true: {},
					false: {},
				},
				false: {
					true: {},
					false: {},
				},
			},
		},
	}
	let ctrlKey = "false"
	let metaKey = "false"
	let altKey = "false"
	let shiftKey = "false"
	for (let key in bindings) {
		let binding: any = bindings[key]
		let k = key.split("+")
		let keys = new Set(k)
		ctrlKey = keys.has("control").toString()
		keys.delete("control")
		metaKey = keys.has("super").toString()
		keys.delete("super")
		altKey = keys.has("option").toString()
		keys.delete("option")
		shiftKey = keys.has("shift").toString()
		keys.delete("shift")
		if (keys.size > 1) {
			throw new Error(
				"keybindings should only have modifiers and 1 other thing"
			)
		}
		let target: string = k[k.length - 1]
		for (let t of keys) {
			target = t
		}
		map[ctrlKey][shiftKey][altKey][metaKey][target] = binding
	}
	return map
}

function atBeginning(root: Node) {
	let s = document.getSelection()
	let anchor = s!.anchorNode
	let children = Array.from(root.childNodes)
	let indexInParent = children.findIndex(n => n == anchor)
	return indexInParent === 0 && s!.anchorOffset === 0 && s!.focusOffset === 0
}

function extract(
	map: any,
	{ctrlKey, shiftKey, altKey, metaKey, key}: KeyboardEvent
) {
	return map[ctrlKey.toString()][shiftKey.toString()][altKey.toString()][
		metaKey.toString()
	][key.toLowerCase()]
}

export default class MayoHeadingElement extends HTMLElement {
	@target root: HTMLHeadingElement
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
		let style = document.createElement("style")
		style.innerHTML = [1, 2, 3, 4, 5, 6]
			.map(n => {
				return `h${n}::before {
					content: "${"#".repeat(n)} ";
					font-family: ibm plex mono, monospace;
					font-style: italic
					display: inline-block;
					font-size: 0.8em;
					color: #77c;
				}`
			})
			.join("\n")
		this.shadowRoot!.appendChild(style)
	}
}
