import {H} from "mdast-util-to-hast"

export default function text(h: H, node) {
	return h(node, "mayo-text", {
		value: String(node.value).replace(/[ \t]*(\r?\n|\r)[ \t]*/g, "$1"),
	})
}
