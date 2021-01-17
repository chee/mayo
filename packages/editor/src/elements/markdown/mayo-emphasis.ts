import {MayoParentElement} from "./mayo-element"
import type * as md from "mdast"

export default class MayoEmphasisElement extends MayoParentElement<md.Emphasis> {
	type = "inline" as const
	connectedCallback() {
		super.connectedCallback()
	}
}
