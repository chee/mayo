import wrap from "./util/wrap"
import all from "./util/all"
import {H} from "mdast-util-to-hast"
import type {Blockquote} from "mdast"

export default function blockquote(h: H, node: Blockquote) {
	return h(node, "mayo-blockquote", wrap(all(h, node), true))
}
