import type {H} from "mdast-util-to-hast"
import type {Node} from "unist"
import type {Content} from "mdast"
import {getMayoName} from "../utils"
let u = require("unist-builder")

let randy = () => Math.random().toString(32).slice(2)

function getProps(mdNode: Content): {[key: string]: string} {
	switch (mdNode.type) {
		case "code": {
			return {
				meta: mdNode.meta || "",
				lang: mdNode.lang || "",
			}
		}
	}
	return {}
}

export default function makeMayonnaise(h: H, mdNode: Content, hastNode: Node) {
	let camelName = mdNode.type
	let mayoName = getMayoName(camelName)
	let mayoNodeProperties = getProps(mdNode)
	let hastNodeProperties = (hastNode.properties as {[s: string]: string}) || {}
	hastNodeProperties!["data-target"] = `${mayoName}.root`
	hastNodeProperties!["contenteditable"] = "true"
	if (!mdNode.data) {
		mdNode.data = {
			id: randy(),
		}
	}
	return h(
		mdNode,
		mayoName,
		{
			...mayoNodeProperties,
			id: mdNode.data.id,
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
