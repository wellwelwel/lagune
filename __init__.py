import json
import os
import subprocess
from pathlib import Path

MODULE_FOLDER = Path(__file__).resolve().parent
# The plugin branch carries this module at its root, beside the skills, and the default branch one level down
LAGUNE_ROOT = MODULE_FOLDER if (MODULE_FOLDER / "skills").is_dir() else MODULE_FOLDER.parent
SKILLS_FOLDER = LAGUNE_ROOT / "skills"
ENGINE_ENTRY = LAGUNE_ROOT / "lib" / "bin" / "index.js"
ENGINE_TOOLS = LAGUNE_ROOT / "lib" / "mcp" / "tools.json"
NODE_BINARY = "node.exe" if os.name == "nt" else "node"
FRONTMATTER_FENCE = "---"
QUOTES = "\"'"
CALL_ID = 1
NO_PROJECT = "This session has no project folder for Lagune's engine to run from, so run the engine through npx instead."
NO_NODE = "Lagune's engine runs on Node.js, and none was found on this computer's search path. Install Node.js (LTS), then restart your agent."


def read_frontmatter(skill_file):
    lines = skill_file.read_text(encoding="utf-8").splitlines()

    if lines[:1] != [FRONTMATTER_FENCE] or FRONTMATTER_FENCE not in lines[1:]:
        return {}

    header = lines[1 : lines.index(FRONTMATTER_FENCE, 1)]
    fields = (line.partition(":") for line in header if not line[:1].isspace())

    return {key.strip(): value.strip().strip(QUOTES) for key, separator, value in fields if separator}


def list_skill_files():
    skill_files = sorted(SKILLS_FOLDER.glob("*/SKILL.md"))

    if not skill_files:
        raise FileNotFoundError(f"Lagune's skills are missing from {SKILLS_FOLDER}: reinstall the plugin")

    return skill_files


def is_package_bin_folder(folder):
    return folder.name == ".bin" and folder.parent.name == "node_modules"


def node_on_search_path():
    folders = (Path(entry) for entry in os.environ.get("PATH", "").split(os.pathsep))
    trusted = (folder / NODE_BINARY for folder in folders if folder.is_absolute() and not is_package_bin_folder(folder))

    return next((str(node) for node in trusted if node.is_file() and os.access(node, os.X_OK)), None)


def failure(message):
    return json.dumps({"error": message}, ensure_ascii=False)


def answer_to_call(output):
    replies = (json.loads(line) for line in output.splitlines() if line.strip())
    reply = next((reply for reply in replies if reply.get("id") == CALL_ID), None)

    if reply is None:
        return None
    if "error" in reply:
        return failure(reply["error"].get("message", ""))

    result = reply.get("result", {})
    text = "\n".join(block.get("text", "") for block in result.get("content", []))

    return failure(text) if result.get("isError") else text


def call_engine(tool_name, arguments, project):
    if not project:
        return failure(NO_PROJECT)

    node = node_on_search_path()

    if node is None:
        return failure(NO_NODE)

    request = {"jsonrpc": "2.0", "id": CALL_ID, "method": "tools/call", "params": {"name": tool_name, "arguments": arguments}}
    served = subprocess.run(
        [node, str(ENGINE_ENTRY), "mcp", project],
        input=f"{json.dumps(request)}\n",
        capture_output=True,
        encoding="utf-8",
    )

    answer = answer_to_call(served.stdout)

    return failure(served.stderr.strip()) if answer is None else answer


def engine_handler(ctx, tool_name):
    def handle(arguments, **_context):
        return call_engine(tool_name, arguments, ctx.session_cwd())

    return handle


def register_engine_tools(ctx):
    for tool in json.loads(ENGINE_TOOLS.read_text(encoding="utf-8")):
        ctx.register_tool(
            name=tool["name"],
            toolset="lagune",
            schema={"name": tool["name"], "description": tool["description"], "parameters": tool["inputSchema"]},
            handler=engine_handler(ctx, tool["name"]),
        )


def register(ctx):
    for skill_file in list_skill_files():
        frontmatter = read_frontmatter(skill_file)

        ctx.register_skill(
            frontmatter.get("name", skill_file.parent.name),
            skill_file,
            description=frontmatter.get("description", ""),
        )

    if ENGINE_TOOLS.is_file():
        register_engine_tools(ctx)
