import os
import importlib.util
from pathlib import Path
import streamlit as st

from constants import APP_DIR, DEFAULT_APP, APP_DIR_NAME
from helpers import read_json

def main():
    # Get page from query param
    page = st.query_params.get("page", DEFAULT_APP)

    app_path = os.path.join(APP_DIR, page)

    # Check if the app path is a directory
    if not os.path.isdir(Path(app_path)):
        st.error("404: Page not found.")
        return
    
    # Construct the path to the metadata file
    app_metadata_path = os.path.join(app_path, "metadata.json")

    # Check if metadata file exists
    if not os.path.isfile(app_metadata_path):
        st.error(f"Metadata file not found: {app_metadata_path}")
        return
    
    app_metadata = read_json(app_metadata_path)

    app_src = app_metadata.get("src", "main.py")
    page_path = os.path.join(app_path, app_src)
    if not os.path.isfile(page_path):
        raise FileNotFoundError(
            f"Expected Streamlit page file not found: {page_path}"
        )

    name = app_metadata.get("name", "untitled")

    # Initialize the app with metadata
    module_name = f"{APP_DIR_NAME}.{name}"
    spec = importlib.util.spec_from_file_location(
        module_name, page_path
    )
    if spec is not None and spec.loader is not None:
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
    else:
        st.error(f"Could not load module spec or loader for {page_path}")

    # Call the render function
    if hasattr(module, "render"):
        module.render()
    else:
        st.error(f"No `render()` found in {page_path}")

if __name__ == "__main__":
    main()
