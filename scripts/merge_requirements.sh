#!/usr/bin/env bash
set -e

BASE_DIR="$(pwd)"
FINAL_REQ_FILE="$BASE_DIR/apps/requirements.txt"
TEMP_REQ_FILE="$BASE_DIR/temp_requirements.txt"

# Ensure src directory exists
mkdir -p "$BASE_DIR/src"

# Clean old files
rm -f "$FINAL_REQ_FILE" "$TEMP_REQ_FILE"

echo "🔍 Searching for requirements.txt files..."
find "$BASE_DIR" -type f -name "requirements.txt" ! -path "$FINAL_REQ_FILE" | while read -r req_file; do
    echo "📦 Installing from $req_file"
    pip install -r "$req_file"
done

echo "🔍 Installing from pyproject.toml (Poetry projects)..."
find "$BASE_DIR" -type f -name "pyproject.toml" \
    -not -path "*/venv/*" \
    -not -path "*/.venv/*" \
    -not -path "*/site-packages/*" \
    | while read -r proj_file; do
        proj_dir="$(dirname "$proj_file")"
        echo "📦 Installing Poetry project in $proj_dir"
        cd "$proj_dir"
        poetry install --no-root
        cd "$BASE_DIR"
    done


echo "📦 Freezing final dependencies..."
pip freeze > "$FINAL_REQ_FILE"

echo "✅ Merged requirements saved to $FINAL_REQ_FILE"
