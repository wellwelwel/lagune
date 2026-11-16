import yaml


def load_settings(path):
    with open(path, encoding="utf-8") as handle:
        return yaml.safe_load(handle) or {}
