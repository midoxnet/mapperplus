import argparse
import subprocess
import os
from pathlib import Path

TOOLS_PATH=Path(__file__).resolve().parent

def main():
    # Setting up argument parsing
    parser = argparse.ArgumentParser(description="Execute a node command for a list of URLs with a target name.")
    parser.add_argument("--file", required=True, help="Path to the file containing a list of URLs, one per line.")
    parser.add_argument("--targetname", required=True, help="Target name to be used in the node command")

    args = parser.parse_args()

    # Read URLs from the file
    with open(args.file, 'r') as f:
        urls = [line.strip() for line in f.readlines()]

    # Create a main directory with the given target name if it doesn't exist
    main_directory = args.targetname
    if not os.path.exists(main_directory):
        os.makedirs(main_directory)

    # Loop through each URL, create a subdirectory for each, and execute the node command
    total_urls = len(urls)
    for idx, url in enumerate(urls, start=1):
        print(f"Processing URL {idx}/{total_urls}: {url}")  # Display the URL being processed

        domain_name = url.split("//")[-1].split("/")[0]
        sub_directory = os.path.join(main_directory, domain_name)
        
        if not os.path.exists(sub_directory):
            os.makedirs(sub_directory)

        cmd = f"node {TOOLS_PATH}/mapper.js --url={url} --target={sub_directory}"
        subprocess.run(cmd, shell=True)

    print("All URLs processed!")

if __name__ == "__main__":
    main()
