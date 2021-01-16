import {H} from "mdast-util-to-hast"
import {Parent} from "unist"
import one from "./one"
import u from "unist-builder"

//TODO wrap the whole children in <template data-shadowroot>
export default function all(h: H, parent: Parent) {
	var nodes = parent.children || []
	var length = nodes.length
	var values = []
	var index = -1
	var result
	var head

	while (++index < length) {
		result = one(h, nodes[index], parent)

		if (result) {
			if (index && nodes[index - 1].type === "break") {
				if (result.value) {
					result.value = result.value.replace(/^\s+/, "")
				}

				head = result.children && result.children[0]

				if (head && head.value) {
					head.value = head.value.replace(/^\s+/, "")
				}
			}

			values = values.concat(result)
		}
	}

	return [u("template", {"data-shadowroot": true}, values)]
}
