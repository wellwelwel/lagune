from pathlib import Path

SKILLS_FOLDER = Path(__file__).resolve().parent.parent / "skills"
FRONTMATTER_FENCE = "---"
QUOTES = "\"'"


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


def command_name(frontmatter, skill_file):
    return frontmatter.get("name", skill_file.parent.name).replace(".", "-")


def register(ctx):
    for skill_file in list_skill_files():
        frontmatter = read_frontmatter(skill_file)

        ctx.register_skill(
            command_name(frontmatter, skill_file),
            skill_file,
            description=frontmatter.get("description", ""),
        )
