import {target, targets} from "@github/catalyst"
import {MayoParentElement} from "./mayo-element"
import * as md from "mdast"
export default class MayoStrongElement extends MayoParentElement<md.Strong> {
	type = "inline" as const
	connectedCallback() {
		super.connectedCallback()
	}
}
