'use strict'

import { H } from "mdast-util-to-hast"
import all from "./util/all"
import type {Heading} from "mdast"

export default function heading(h: H, node: Heading) {
  return h(node, 'mayo-heading', {
    depth: node.
  }, all(h, node))
}
