import streamlit as st
import subprocess
import sys
import os
import importlib.util


def is_package_installed(pkg_name: str) -> bool:
    """Check if a package is already installed"""
    return importlib.util.find_spec(pkg_name) is not None


def parse_requirements(file_path):
    """Parse package names from requirements.txt (ignores versions)"""
    with open(file_path, "r") as f:
        lines = f.readlines()
    packages = []
    for line in lines:
        line = line.strip()
        if line and not line.startswith("#"):
            pkg = line.split("==")[0].split(">=")[0].split("<=")[0].strip()
            if pkg:
                packages.append(pkg)
    return packages


def install_requirements(requirements_file: str) -> None:
    """Install packages from requirements.txt if not already installed"""
    if not os.path.exists(requirements_file):
        st.warning("⚠️ requirements.txt not found.")
        return

    missing_packages = []
    for pkg in parse_requirements(requirements_file):
        if not is_package_installed(pkg):
            missing_packages.append(pkg)

    if missing_packages:
        st.info(f"📦 Installing missing packages: {', '.join(missing_packages)}")
        try:
            subprocess.check_call(
                [sys.executable, "-m", "pip", "install", "-r", requirements_file]
            )
            st.success("✅ All required packages installed.")
            st.rerun()  # soft reload
        except subprocess.CalledProcessError as e:
            st.error(f"❌ Failed to install packages: {e}")
    else:
        st.success("✅ All packages already installed.")
