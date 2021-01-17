import {target, targets} from "@github/catalyst"
import {render, html} from "@github/jtml"
import {MayoLiteralElement} from "./mayo-element"
import * as md from "mdast"
export default class MayoInlineCodeElement extends MayoLiteralElement<md.InlineCode> {
	type = "inline" as const
	connectedCallback() {
		super.connectedCallback()
	}
}
