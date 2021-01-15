import {Node} from "unist"
import {H, Handler} from "mdast-util-to-hast"

import makeMayonnaise from "./make-mayonnaise"
// @ts-ignore
import original from "mdast-util-to-hast/lib/handlers"

function ignore() {
	return null
}

let handlers: {[s: string]: Handler} = {}

export default handlers

for (let key in original) {
	if (key == "text" || key == "root") {
		// TODO what should happen with text?
		continue
	}
	handlers[key] = (h, node) => makeMayonnaise(h, node, original[key](h, node))
}
