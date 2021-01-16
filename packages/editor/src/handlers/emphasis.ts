import all from "./util/all"

export default function emphasis(h, node) {
	return h(node, "em", all(h, node))
}
