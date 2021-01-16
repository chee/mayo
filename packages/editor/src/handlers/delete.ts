import all from "./util/all"

export default function strikethrough(h, node) {
	return h(node, "del", all(h, node))
}
