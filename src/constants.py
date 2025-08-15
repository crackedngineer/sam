from pathlib import Path

APP_DIR_NAME = "apps"
APP_DIR = (Path(__file__).parent.parent / APP_DIR_NAME).resolve()
DEFAULT_APP = "home"