import {H} from "mdast-util-to-hast"

export default function thematicBreak(h: H, node) {
	return h(node, "mayo-thematic-break")
}
