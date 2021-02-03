import {LitElement, html, css, customElement, property} from "lit-element"
import vfile, {VFile} from "vfile"

export interface ChooseEvent extends CustomEvent {
	detail: {
		name: string
	}
}

@customElement("mayo-sidebar")
export default class MayoSidebarElement extends LitElement {
	@property({attribute: false})
	files: Array<FileSystemHandle> = []

	static get styles() {
		return css`
			* {
				box-sizing: border-box;
			}

			nav {
				overflow: hidden;
				width: 200px;
				background: #ffe9ed;
				color: #c36;
				height: 100%;
				padding: 1em;
				font-size: 0.9em;
				resize: horizontal;
			}

			ul {
				list-style: none;
				padding: 0;
			}
		`
	}

	directory: FileSystemDirectoryHandle

	async open() {
		let dir = await window.showDirectoryPicker()
		this.directory = dir
		let files = []
		for await (let file of dir.values()) {
			files.push(file)
		}
		this.files = files
	}

	file: File

	async choose(event: ChooseEvent) {
		let {name} = event.detail

		let filehandle = await this.files.find(f => f.name == name)

		this.dispatchEvent(new CustomEvent("open", {detail: {filehandle}}))
	}

	render() {
		return html`
			<nav>
				${this.files.length
					? html`
							<ul>
								${this.files.map(
									file => html`<li>
										${file.kind == "file"
											? html` <mayo-sidebar-file
													.file=${file}
													@open=${this.choose}
													path="${file.name}"
											  >
													<template data-shadowroot></template>
											  </mayo-sidebar-file>`
											: "TODO: directories"}
									</li>`
								)}
							</ul>
					  `
					: ""}
				<button @click=${this.open}>open a directory</button>
			</nav>
		`
	}
}
