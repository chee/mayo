import {find, visit, SKIP, EXIT} from "unist-utils-core"
// @ts-ignore
import uremove from "unist-util-remove"
import {Node} from "unist"
import * as md from "mdast"
import u from "unist-builder"

export function split(
	root: md.Content | md.Parent,
	target: md.Content,
	offset: number
) {
	visit<md.Content | md.Parent, md.Parent>(
		root,
		target,
		(n, index, parents) => {
			if (n.type == "text" || n.type == "inlineCode") {
				let orig = n.value as string
				n.value = orig.slice(0, offset)
				console.log("length", parents.length)
				let text = u("text", {}, orig.slice(offset))
				let idx = index
				for (let i = parents.length - 2; i > -1; i--) {
					idx = parents[i].children.indexOf(parents[i + 1])
				}
				console.log({idx})
				console.log(parents[0].children.indexOf(parents[1]))
				parents[0].children.splice(idx - 1 + 1, 0, text)
			}
			return EXIT
		}
	)
}

export function demoteFully(
	root: md.Content,
	target: md.Content,
	symbolLocation: "prefix" | "suffix"
) {
	visit<md.Content, md.Parent>(root, target, (n, index, parents) => {
		if (n.value) {
			let symbol = pairSymbolFor(n)
			n.type = "text"
			if (symbol) {
				if (symbolLocation == "prefix") {
					n.value = symbol + n.value
				} else if (symbolLocation == "suffix") {
					n.value = n.value + symbol + ""
				}
			}
		} else if (Array.isArray(n.children)) {
			let symbol = pairSymbolFor(n)
			let kids = [...n.children]
			if (symbol) {
				let s = u("text", symbol)
				if (symbolLocation == "prefix") {
					kids.unshift(s)
				} else if (symbolLocation == "suffix") {
					kids.push(s)
				}
			}
			parents[parents.length - 1].children.splice(index, 1, ...kids)
		}

		if (parents.length > 1) {
			demoteFully(root, parents[parents.length - 1])
		} else {
		}
	})
}

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
			return "**"
		case "inlineCode":
			return "`"
		case "delete":
			return "~"
	}
}

export {find}

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
