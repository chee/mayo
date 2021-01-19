import {LitElement, html, css, customElement, property} from "lit-element"

@customElement("mayo-sidebar")
export default class MayoSidebarElement extends LitElement {
	@property({type: Array})
	paths = ["fish.md", "monkey.md"]

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

	render() {
		return html`
			<nav>
				<ul>
					${this.paths.map(
						path => html`<li>
							<mayo-sidebar-file path="${path}">
								<template data-shadowroot></template>
							</mayo-sidebar-file>
						</li>`
					)}
				</ul>
			</nav>
		`
	}
}
