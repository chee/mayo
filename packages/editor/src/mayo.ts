import {controller} from "@github/catalyst"
import elements, {MayoDocumentElement} from "./elements"

for (let element of elements) {
	controller(element)
}
