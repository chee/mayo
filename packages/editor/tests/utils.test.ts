import * as utils from "../src/utils"
import fromMarkdown from "mdast-util-from-markdown"
import toMarkdown from "mdast-util-to-markdown"
import {Node, select, visit, EXIT, selectAll} from "unist-utils-core"
import {Parent, Root, Text} from "mdast"
import * as is from "../src/is"
import cloneDeep from "clone-deep"
import removePosition from "unist-util-remove-position"

import u from "unist-builder"

function split(root: Parent, target: Text, offset: number) {
	let leftText = target.value.slice(0, offset)
	let rightText = target.value.slice(offset)

	let leftNode = u("text", leftText)
	let rightNode = u("text", rightText)
	let leftStack = []
	let rightStack = []

	// utils.remove(root, {}, target)
	visit(root, target, (node, index, parents) => {
		console.log(parents.map(p => p.type))
		let nextpc = []
		let nextac = []
		for (let i = parents.length - 1; i > 0; i--) {
			let highParent = parents[i - 1]
			let lowParent = parents[i]
			let idx = highParent.children.indexOf(lowParent)
			let pc = highParent.children.slice(0, idx)
			let ac = highParent.children.slice(idx + 1)
			if (is.inline(lowParent.type)) {
				leftNode = u(lowParent.type, [...nextpc, leftNode])
				rightNode = u(lowParent.type, [rightNode, ...nextac])
			}
			nextpc = pc
			nextac = ac
			if (is.block(lowParent.type)) {
				break
			}
		}

		return EXIT
	})

	return [leftNode, rightNode]
}

describe.only("split", () => {
	test("splits a node in half", () => {
		let tree = parse("_hellothere_")
		let expected = [
			parse(`_hello_`).children[0].children[0],
			parse(`_there_`).children[0].children[0],
		]
		let p = select("paragraph", tree)
		let text = select<Text>("text", p)
		let actual = split(tree, text, 5)
		expect(actual).toEqual(expected)
	})

	test("splits a complex node correct", () => {
		let tree = parse("_oh **hey** ok_")
		let expected = [
			parse(`_oh **he**_`).children[0].children[0],
			parse(`_**y** ok_`).children[0].children[0],
		]
		let p = select("paragraph", tree)
		let text = selectAll<Text>("text", p)[1]
		let actual = split(tree, text, 2)

		expect(toMarkdown(actual[0])).toEqual(toMarkdown(expected[0]))
		expect(toMarkdown(actual[1])).toEqual(toMarkdown(expected[1]))
		expect(actual).toEqual(expected)
	})

	test("splits a code node correct", () => {
		let tree = parse("_oh **hey** ok_")
		let expected = [
			parse(`_oh **he**_`).children[0].children[0],
			parse(`_**y** ok_`).children[0].children[0],
		]
		let p = select("paragraph", tree)
		let text = selectAll<Text>("text", p)[1]
		let actual = split(tree, text, 2)

		expect(toMarkdown(actual[0])).toEqual(toMarkdown(expected[0]))
		expect(toMarkdown(actual[1])).toEqual(toMarkdown(expected[1]))
		expect(actual).toEqual(expected)
	})
})

function insertParagraph(root: Parent, target: Text, offset: number) {
	visit(root, target, (node, index, parents) => {
		parents = [...parents].reverse()
		let t = u("text", target.value.slice(offset))
		target.value = target.value.slice(0, offset)

		let p = u("paragraph", [u(node.type, t)])

		if (is.block(parents[0].type)) {
			// a normal direct text node
			let indexInParent = parents[0].children.indexOf(target)
			let rest = parents[0].children.slice(indexInParent)
		} else if (is.inline(parents[0].type)) {
		}

		for (let parent of parents.slice(1)) {
			if (is.block(parent.type)) {
				let rest = parent.children.slice(indexInParent)
				console.log({rest})
				parent.children.splice(indexInParent + 1, 0, p)
				break
			}
		}
		return EXIT
	})
}

function parse(string: string): Root {
	return removePosition(fromMarkdown(string), true) as Root
}

describe("insertParagraph", () => {
	test("inserts a new paragraph where the cursor is", () => {
		let tree = parse("hellothere")
		let expected = parse(`hello
 
there`)
		let p = select("paragraph", tree)
		let text = select<Text>("text", p)
		insertParagraph(tree, text, 5)
		expect(tree).toEqual(expected)
	})

	test("inserts a new paragraph, maintaining whole nodes", () => {
		let tree = parse("split _me in two_ please")
		let expected = parse(`split _me _
		
_in two_ please`)
		let p = select("paragraph", tree)
		let text = selectAll<Text>("text", p)[1]

		insertParagraph(tree, text, 3)
		expect(tree).toEqual(expected)
		console.log(p.children)
	})
})
