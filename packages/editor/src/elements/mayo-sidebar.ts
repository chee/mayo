import {repeat} from "lit-html/directives/repeat"
import {target, targets} from "@github/catalyst"
import {render, html} from "lit-html"
import MayoSidebarFileElement from "./mayo-sidebar-file"

export default class MayoSidebarElement extends HTMLElement {
	@targets files: Array<typeof MayoSidebarFileElement>
	@target list: HTMLUListElement
	getFilePaths() {
		return ["fish.md", "monkey.md"]
	}

	update() {
		if (!this.list) {
			return
		}
		render(
			repeat(
				this.getFilePaths(),
				path => html`
					<li>
						<mayo-sidebar-file path="${path}">
							<template data-shadowroot></template>
						</mayo-sidebar-file>
					</li>
				`
			),
			this.list
		)
	}

	connectedCallback() {
		this.update()
	}
}
