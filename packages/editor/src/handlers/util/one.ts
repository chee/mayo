import {H} from "mdast-util-to-hast"
import {Node, Parent} from "unist"
import u from "unist-builder"
import all from "./all"

var own = {}.hasOwnProperty

// Transform an unknown node.
function unknown(h: H, node: Node) {
	if (text(node)) {
		return h.augment(node, u("mayo-text", node.value))
	}

	return h(node, "div", all(h, node as Parent))
}

// Visit a node.
export default function one(h, node, parent) {
	var type = node && node.type
	var fn

	// Fail on non-nodes.
	if (!type) {
		throw new Error("Expected node, got `" + node + "`")
	}

	if (own.call(h.handlers, type)) {
		fn = h.handlers[type]
	} else if (h.passThrough && h.passThrough.indexOf(type) > -1) {
		fn = returnNode
	} else {
		fn = h.unknownHandler
	}

	return (typeof fn === "function" ? fn : unknown)(h, node, parent)
}

// Check if the node should be renderered as a text node.
function text(node: Node) {
	var data = node.data || {}

	if (
		own.call(data, "hName") ||
		own.call(data, "hProperties") ||
		own.call(data, "hChildren")
	) {
		return false
	}

	return "value" in node
}

function returnNode(h: H, node: Node) {
	var clone

	if (node.children) {
		clone = Object.assign({}, node)
		clone.children = all(h, node as Parent)
		return clone
	}

	return node
}
