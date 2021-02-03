import {controller, target, targets} from "@github/catalyst"
import {VFile} from "vfile"
import {MayoDocumentElement, MayoSidebarElement} from "."
console.log(window.require)

@controller
export default class MayoAppElement extends HTMLElement {
	@target sidebar: MayoSidebarElement
	@target document: MayoDocumentElement
	file?: File
	filehandle?: FileSystemFileHandle
	async open(event: CustomEvent) {
		let filehandle: FileSystemFileHandle = event.detail.filehandle
		this.filehandle = filehandle

		let file = (this.file = (await filehandle.getFile()) as File)
		let contents = await file.text()
		this.document.setAttribute("contents", contents)
		this.document.setAttribute("path", file.name)
	}

	async new(event: CustomEvent) {
		delete this.filehandle
		delete this.file
		this.document.setAttribute("contents", "")
		this.document.setAttribute("path", "")
	}

	async save(event: CustomEvent) {
		console.log("yo")
		if (this.filehandle) {
			let contents = this.document.contents
			let permission = await this.filehandle.requestPermission({
				mode: "readwrite",
			})
			console.log({permission})
			let w = await this.filehandle.createWritable()
			w.write(contents)
			w.close()
			this.document.removeAttribute("dirty")
		} else {
			// TODO save as!
		}
	}

	connectedCallback() {
		this.document.contents = `# hello \`this\` and _that_ (and \`others\`)

this is an _ordinary **\`document\` about** ordinary_ things, there's **nothing _going_ on**
here of _interest to you_, or me, or anybody else.


## a list

- one
- two
- three

1. first thing
2. second
3. the aeroplane

## the other thing

- one

images like ![dog in hat](https://i.pinimg.com/originals/c1/40/6f/c1406f93f49e896ff7c54c26bbfda047.jpg) and so on

> help
> this is why i need help

\`\`\`cpp filename="hello"
auto sum(std::vector<int> nums) {
	auto result = 0;
	for (auto num : nums) {
		result += num;
	}
	return result;
}
\`\`\`
`
	}
}
