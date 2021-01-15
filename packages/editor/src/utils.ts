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
