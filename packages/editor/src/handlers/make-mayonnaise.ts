import type {H} from "mdast-util-to-hast"
import type {Node} from "unist"

let u = require("unist-builder")

export default function makeMayonnaise(h: H, mdNode: Node, hastNode: Node) {
	//let mysteria = (mdNode.position as unknown) as Node
	let camelName = mdNode.type
	let hyphenName = camelName.replace(/([A-Z]($|[a-z]))/g, "-$1").toLowerCase()
	let mayoName = `mayo-${hyphenName}`
	let properties = hastNode.properties as {[s: string]: string}
	properties!["data-target"] = `mayoName.root`
	properties!["contenteditable"] = "true"
	return h(
		mdNode,
		mayoName,
		{
			"data-targets": `mayo-document.${camelName}s`,
			"data-action": `
			click:${mayoName}#select
			keydown:${mayoName}#transform
			input:${mayoName}#transform
			select:mayo-document#select
			transform:mayo-document#transform
			`,
		},
		[
			u("element", {
				tagName: "template",
				properties: {
					"data-shadowroot": true,
				},
				content: u("root", {
					children: [hastNode],
				}),
			}),
		]
	)
}
