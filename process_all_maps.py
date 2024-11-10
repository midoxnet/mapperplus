import argparse
import subprocess
import os
from pathlib import Path

TOOLS_PATH=Path(__file__).resolve().parent

def get_map_dirs(target_directory):
    # Search for .map files only within the target_directory and its subdirectories
    cmd = f'find "{os.path.abspath(target_directory)}" -type f -name "*.map" -exec dirname {{}} \; | sort -u'
    result = subprocess.run(cmd, capture_output=True, text=True, shell=True)
    
    return result.stdout.splitlines()

def process_map_dirs(target_directory):
    dirs = get_map_dirs(target_directory)
    for dir in dirs:
        cmd = ['python3', TOOLS_PATH + 'process_maps.py', dir, dir]
        subprocess.run(cmd)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Process map directories.")
    parser.add_argument("--target-name", required=True, help="Directory containing subfolders which may have .map files.")
    args = parser.parse_args()

    process_map_dirs(args.target_name)
