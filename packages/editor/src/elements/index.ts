import MayoBreakElement from "./markdown/mayo-break"
import MayoCodeblockElement from "./markdown/mayo-code"
import MayoCodeElement from "./markdown/mayo-inline-code"
import MayoDefinitionElement from "./markdown/mayo-definition"
import MayoDeleteElement from "./markdown/mayo-delete"
import MayoEmphasisElement from "./markdown/mayo-emphasis"
import MayoFootnoteDefinitionElement from "./markdown/mayo-footnote-definition"
import MayoFootnoteElement from "./markdown/mayo-footnote"
import MayoFootnoteReferenceElement from "./markdown/mayo-footnote-reference"
import MayoHeadingElement from "./markdown/mayo-heading"
import MayoThematicBreakElement from "./markdown/mayo-thematic-break"
import MayoHtmlElement from "./markdown/mayo-html"
import MayoImageElement from "./markdown/mayo-image"
import MayoImageReferenceElement from "./markdown/mayo-image-reference"
import MayoListItemElement from "./markdown/mayo-list-item"
import MayoLinkElement from "./markdown/mayo-link"
import MayoLinkReferenceElement from "./markdown/mayo-link-reference"
import MayoListElement from "./markdown/mayo-list"
import MayoParagraphElement from "./markdown/mayo-paragraph"
import MayoBlockquoteElement from "./markdown/mayo-blockquote"
import MayoRootElement from "./markdown/mayo-root"
import MayoStrongElement from "./markdown/mayo-strong"
import MayoTableElement from "./markdown/mayo-table"
import MayoTextElement from "./markdown/mayo-text"
import MayoTomlElement from "./markdown/mayo-toml"
import MayoYamlElement from "./markdown/mayo-yaml"

import MayoSidebarElement from "./mayo-sidebar"
import MayoSidebarFileElement from "./mayo-sidebar-file"
import MayoDocumentElement from "./mayo-document"

export type MayoBlockElement =
	| MayoCodeblockElement
	| MayoFootnoteElement
	| MayoHeadingElement
	| MayoThematicBreakElement
	| MayoImageElement
	| MayoListItemElement
	| MayoListElement
	| MayoParagraphElement
	| MayoBlockquoteElement
	| MayoRootElement
	| MayoTableElement

export type {
	MayoDocumentElement,
	MayoSidebarElement,
	MayoSidebarFileElement,
	MayoBreakElement,
	MayoCodeblockElement,
	MayoCodeElement,
	MayoDefinitionElement,
	MayoDeleteElement,
	MayoEmphasisElement,
	MayoFootnoteDefinitionElement as MayoFootdefElement,
	MayoFootnoteElement,
	MayoFootnoteReferenceElement as MayoFootrefElement,
	MayoHeadingElement,
	MayoThematicBreakElement as MayoHrElement,
	MayoHtmlElement,
	MayoImageElement,
	MayoImageReferenceElement as MayoImagerefElement,
	MayoListItemElement as MayoItemElement,
	MayoLinkElement,
	MayoLinkReferenceElement as MayoLinkrefElement,
	MayoListElement,
	MayoParagraphElement,
	MayoBlockquoteElement as MayoQuoteElement,
	MayoRootElement,
	MayoStrongElement,
	MayoTableElement,
	MayoTextElement,
	MayoTomlElement,
	MayoYamlElement,
}

export default [
	MayoDocumentElement,
	MayoSidebarElement,
	MayoSidebarFileElement,
	MayoBreakElement,
	MayoCodeblockElement,
	MayoCodeElement,
	MayoDefinitionElement,
	MayoDeleteElement,
	MayoEmphasisElement,
	MayoFootnoteDefinitionElement,
	MayoFootnoteElement,
	MayoFootnoteReferenceElement,
	MayoHeadingElement,
	MayoThematicBreakElement,
	MayoHtmlElement,
	MayoImageElement,
	MayoImageReferenceElement,
	MayoListItemElement,
	MayoLinkElement,
	MayoLinkReferenceElement,
	MayoListElement,
	MayoParagraphElement,
	MayoBlockquoteElement,
	MayoRootElement,
	MayoStrongElement,
	MayoTableElement,
	MayoTextElement,
	MayoTomlElement,
	MayoYamlElement,
]
