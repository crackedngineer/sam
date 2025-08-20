import os
import json

def export_apps_list() -> None:
    """Export the list of apps in the specified directory to a JSON file."""
    APP_DIR = os.path.join(os.path.dirname(__file__), '..', 'apps')
    output_file = os.path.join(APP_DIR, 'apps_list.json')
    apps = []
    for app_name in os.listdir(APP_DIR):
        app_path = os.path.join(APP_DIR, app_name)
        if os.path.isdir(app_path):
            metadata_file = os.path.join(app_path, 'metadata.json')
            if os.path.isfile(metadata_file):
                with open(metadata_file, 'r') as f:
                    metadata = json.load(f)
                apps.append(metadata)
            else:
                print(f"Metadata file not found for app: {app_name}")
    with open(output_file, 'w') as f:
        json.dump(apps, f, indent=4)

if __name__ == "__main__":
    export_apps_list()
    print("Apps list exported successfully.")