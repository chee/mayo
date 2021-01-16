import { Node } from "unist"
import { H } from "mdast-util-to-hast"
import {Content} from "mdast"

import makeMayonnaise from "./make-mayonnaise"
@ts-ignore
import original from "mdast-util-to-hast/lib/handlers"
import u from "unist-builder"

// export default {
	// blockquote: require("./blockquote"),
	// break: require("./break"),
	// code: require("./code"),
	// delete: require("./delete"),
	// emphasis: require("./emphasis"),
	// footnoteReference: require("./footnote-reference"),
	// footnote: require("./footnote"),
	// heading: require("./heading"),
	// html: require("./html"),
	// imageReference: require("./image-reference"),
	// image: require("./image"),
	// inlineCode: require("./inline-code"),
	// linkReference: require("./link-reference"),
	// link: require("./link"),
	// listItem: require("./list-item"),
	// list: require("./list"),
	// paragraph: require("./paragraph"),
	// root: require("./root"),
	// strong: require("./strong"),
	// table: require("./table"),
	// text: require("./text"),
	// thematicBreak: require("./thematic-break"),
	// toml: ignore,
	// yaml: ignore,
	// definition: ignore,
	// footnoteDefinition: ignore,
// }

// Return nothing for nodes that are ignored.
function ignore() {
	return null
}

type Handler = (h: H, node: Content) => any
let handlers: {[s: string]: Handler} = {}

export default handlers

for (let key in original) {
	if (key == "text" || key == "root") {
		// TODO what should happen with text?
		continue
	}
	handlers[key] = (h, node) =>
		makeMayonnaise(h, node, u("element", {tagName: ""}))
}

handlers.text = (h, node) =>
	makeMayonnaise(
		h,
		node,
		u(
			"element",
			{
				tagName: "span",
				properties: {},
			},
			[u("text", node.value)]
		)
	)
