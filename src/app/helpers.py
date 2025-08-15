import json

def read_json(file_path):
    """Read a JSON file and return its content."""
    with open(file_path, "r") as file:
        return json.load(file)
