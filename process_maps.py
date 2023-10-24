import os
import glob
import subprocess
import argparse

def execute_sourcemapper(directory, output_name):
    # Get the full path to all .js.map files in the given directory
#    map_files = glob.glob(os.path.join(directory, '*.js.map'))
    map_files = glob.glob(os.path.join(directory, '**', '*.js.map'), recursive=True)

    # For each .js.map file, execute the ./sourcemapper command
    for map_file in map_files:
        cmd = ['./sourcemapper', '-output', output_name, '-url', map_file]
        subprocess.run(cmd)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process .js.map files using sourcemapper.")
    parser.add_argument('directory', type=str, help="Path to the folder containing .js and .js.map files.")
    parser.add_argument('output_name', type=str, help="Output name for the sourcemapper command.")
    
    args = parser.parse_args()
    execute_sourcemapper(args.directory, args.output_name)
