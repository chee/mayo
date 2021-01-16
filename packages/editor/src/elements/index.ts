import MayoBreakElement from "./markdown/mayo-break"
import MayoCodeElement from "./markdown/mayo-code"
import MayoInlineCodeElement from "./markdown/mayo-inline-code"
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

export type MayoStaticPhrasingContentElement =
	| MayoBreakElement
	| MayoEmphasisElement
	| MayoHtmlElement
	| MayoImageElement
	| MayoImageReferenceElement
	| MayoInlineCodeElement
	| MayoStrongElement
	| MayoTextElement

export type MayoPhrasingContentElement =
	| MayoLinkElement
	| MayoLinkReferenceElement
	| MayoStaticPhrasingContentElement

export type MayoListContentElement = MayoListItemElement

export type MayoContentElement = MayoDefinitionElement | MayoParagraphElement

export type MayoFlowContentElement =
	| MayoBlockquoteElement
	| MayoCodeElement
	| MayoHeadingElement
	| MayoHtmlElement
	| MayoListElement
	| MayoThematicBreakElement
	| MayoContentElement

export type MayoMdastContentElement =
	| MayoFlowContentElement
	| MayoListContentElement
	| MayoPhrasingContentElement

export type {
	MayoDocumentElement,
	MayoSidebarElement,
	MayoSidebarFileElement,
	MayoBreakElement,
	MayoCodeElement,
	MayoDefinitionElement,
	MayoDeleteElement,
	MayoEmphasisElement,
	MayoFootnoteDefinitionElement,
	MayoFootnoteElement,
	MayoFootnoteReferenceElement,
	MayoHeadingElement,
	MayoInlineCodeElement,
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
}

export default [
	MayoDocumentElement,
	MayoSidebarElement,
	MayoSidebarFileElement,
	MayoBreakElement,
	MayoCodeElement,
	MayoInlineCodeElement,
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
