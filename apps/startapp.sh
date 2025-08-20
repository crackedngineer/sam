#!/bin/bash

# Check if app name is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <app_name>"
  exit 1
fi

APP_NAME=$1

# Create app directory
mkdir -p $APP_NAME

# Create __init__.py files
touch $APP_NAME/__init__.py
touch $APP_NAME/requirements.txt

# Create basic Python files
cat <<EOF > $APP_NAME/metadata.json
{
    "name": "$APP_NAME",
    "title": "$APP_NAME App",
    "version": "0.0.1",
    "src": "main.py",
    "author": "Your Name"
}
EOF

cat <<EOF > $APP_NAME/main.py
import streamlit as st

# Create your app here.
def render():
    st.title("$APP_NAME")
EOF

cat <<EOF > $APP_NAME/tests.py
# Create your tests here.
EOF

cat <<EOF > $APP_NAME/README.md
# $APP_NAME
EOF

echo "App '$APP_NAME' created."
