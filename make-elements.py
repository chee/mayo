def classname(filename):
    return filename.title().replace("-", "") + "Element"


for filename in [
    "mayo-quote",
    "mayo-break",
    "mayo-codeblock",
    "mayo-delete",
    "mayo-emphasis",
    "mayo-footref",
    "mayo-footnote",
    "mayo-heading",
    "mayo-html",
    "mayo-imageref",
    "mayo-image",
    "mayo-code",
    "mayo-linkref",
    "mayo-link",
    "mayo-item",
    "mayo-list",
    "mayo-paragraph",
    "mayo-root",
    "mayo-strong",
    "mayo-table",
    "mayo-text",
    "mayo-hr",
    "mayo-toml",
    "mayo-yaml",
    "mayo-definition",
    "mayo-footdef"
]:
    print(f"\t{classname(filename)},")

    #print(f"import {classname(filename)} from \"./{filename}\"")


#     with open(f + ".ts", "w+") as file:
#         file.write(f"""import {{target, targets}} from "@github/catalyst"
# import {{render, html}} from "@github/jtml"
# export default class {classname(f)} extends htmlelement {{
#    connectedcallback() {{

#    }}
# }}
# """)
