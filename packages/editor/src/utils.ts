// @ts-ignore
import ufind from "unist-util-find"
// @ts-ignore
import uremove from "unist-util-remove"
import {Node} from "unist"

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
