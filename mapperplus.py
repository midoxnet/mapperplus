import os
import sys
import argparse
import subprocess
from termcolor import colored
from pathlib import Path

TOOLS_PATH=Path(__file__).resolve().parent

def main():
    parser = argparse.ArgumentParser(description="MapperPlus to download and extract all JS files from a given target or targets")
    
    # URL or file containing URLs argument
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('-u', '--url', help="Specify a single URL.")
    group.add_argument('-r', '--url-file', help="Specify a file containing a list of URLs, one per line.")
    
    # Target name argument
    parser.add_argument('-t', '--target', required=True, help="Specify the target name.")
    
    # Cookie file argument
    parser.add_argument('-c', '--cookie-file', help="Path to the file containing the cookie.")
    
    # Headers argument (changed from -h to -H)
    parser.add_argument('-H', '--headers', nargs='+', help="HTTP headers in the format key=value. Multiple headers can be specified.")

    # If no arguments are provided, display the help message and exit
    if len(sys.argv) == 1:
        parser.print_help(sys.stderr)
        sys.exit(1)

    args = parser.parse_args()
    # Print progress note
    print(colored(f"Processing for target: {args.target}", "yellow"))


    # Condition when -u (URL) is used
    if args.url:
        print(colored(f"Using URL: {args.url}", "cyan"))
        cmd = ['node', 'mapper.js', '--url=' + args.url, '--target=' + args.target]

        if args.cookie_file:
            cmd.append('--cookie-file=' + args.cookie_file)
            print(colored(f"Using cookies from: {args.cookie_file}", "green"))

        if args.headers:
            headers_arg = ','.join(args.headers)
            cmd.append('--headers=' + headers_arg)
            print(colored(f"Using headers: {headers_arg}", "green"))

        # Execute the command
        subprocess.run(cmd)

    # Condition when -r (URL file) is used
    elif args.url_file:
        print(colored(f"Using URLs from file: {args.url_file}", "cyan"))
        cmd = ['python3', TOOLS_PATH + 'processor.py', '--file=' + args.url_file, '--targetname=' + args.target]
        
        # Execute the command
        subprocess.run(cmd)

    # After either condition has been processed, run the additional command
    print(colored(f"Processing maps for target: {args.target}", "magenta"))
    cmd = ['python3', TOOLS_PATH + 'process_all_maps.py', '--target-name', args.target]
    subprocess.run(cmd)
    
    print(colored("All operations completed successfully!", "green"))

if __name__ == "__main__":
    main()
