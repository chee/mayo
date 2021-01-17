from typing import List

names = [["blockquote"],
         ["break"],
         ["code"],
         ["delete"],
         ["emphasis"],
         ["footnote", "reference"],
         ["footnote"],
         ["heading"],
         ["html"],
         ["image", "reference"],
         ["image"],
         ["inline", "code"],
         ["link", "reference"],
         ["link"],
         ["list", "item"],
         ["list"],
         ["paragraph"],
         ["root"],
         ["strong"],
         ["table"],
         ["text"],
         ["thematic", "break"],
         ["toml"],
         ["yaml"],
         ["definition"],
         ["footnote", "definition"]]


def pascal(name: List[str]):
    return ''.join(map(lambda n: n.capitalize(), name))


def camel(name: List[str]):
    return name[0] + pascal(name[1:])


def kebab(name: List[str]):
    return '-'.join(name)


def mayo(name: List[str]):
    return "mayo-" + kebab(name)


print("let handlers: Handlers = {")
for name in names:
    print(f"""
	{camel(name)}(node) {{
		node = node as md.{pascal(name)}
		return html`<{mayo(name)} .node=${{node}}> ${{value(node)}} </{mayo(name)}>`
	}},""")
print("}")
