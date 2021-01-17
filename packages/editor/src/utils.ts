// @ts-ignore
import ufind from "unist-util-find"
// @ts-ignore
import uremove from "unist-util-remove"
import {Node} from "unist"
import * as md from "mdast"

export function toString(node: Node) {
	return (
		(node && node.value) ||
		("children" in node && toStringAll(node.children)) ||
		""
	)
}

function toStringAll(values: Node[]): string {
	var result = []
	var index = -1

	while (++index < values.length) {
		result[index] = toString(values[index])
	}

	return result.join("")
}

export function pairSymbolFor(
	node: md.Emphasis | md.Strong | md.InlineCode | md.Delete
) {
	switch (node.type) {
		case "emphasis":
			return "_"
		case "strong":
			return "*"
		case "inlineCode":
			return "`"
		case "delete":
			return "~"
	}
}

export function find(
	tree: Node,
	condition: string | object | ((node: Node) => boolean)
): Node | null | undefined {
	return ufind(tree, condition)
}

interface RemoveOptions {
	cascade?: boolean
}

export function remove(
	tree: Node,
	options: RemoveOptions,
	condition: string | object | ((node: Node) => boolean)
): Node | null | undefined {
	return uremove(tree, options, condition)
}

export function getMayoName(camelName: string) {
	let hyphenName = camelName.replace(/([A-Z]($|[a-z]))/g, "-$1").toLowerCase()
	let mayoName = `mayo-${hyphenName}`
	return mayoName
}
