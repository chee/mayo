import {H} from "mdast-util-to-hast"
import {Node, Parent} from "unist"
import u from "unist-builder"
import all from "./all"

// Return the content of a reference without definition as Markdown.
export default function revert(h: H, node: Node) {
	var subtype = node.referenceType
	var suffix = "]"
	var contents
	var head
	var tail

	if (subtype === "collapsed") {
		suffix += "[]"
	} else if (subtype === "full") {
		suffix += "[" + (node.label || node.identifier) + "]"
	}

	if (node.type === "imageReference") {
		return u("text", "![" + node.alt + suffix)
	}

	contents = all(h, node as Parent)
	head = contents[0]

	if (head && head.type === "text") {
		head.value = "[" + head.value
	} else {
		contents.unshift(u("text", "["))
	}

	tail = contents[contents.length - 1]

	if (tail && tail.type === "text") {
		tail.value += suffix
	} else {
		contents.push(u("text", suffix))
	}

	return contents
}
