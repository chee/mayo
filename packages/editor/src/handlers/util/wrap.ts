import {Node} from "unist"
import u from "unist-builder"

// Wrap `nodes` with line feeds between each entry.
// Optionally adds line feeds at the start and end.
export default function wrap(nodes: Node[], loose: boolean) {
	var result = []
	var index = -1
	var length = nodes.length

	if (loose) {
		result.push(u("mayo-text", "\n"))
	}

	while (++index < length) {
		if (index) {
			result.push(u("mayo-text", "\n"))
		}

		result.push(nodes[index])
	}

	if (loose && nodes.length > 0) {
		result.push(u("mayo-text", "\n"))
	}

	return result
}
