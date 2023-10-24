# Mapperplus - An advanced source map extractor based on headless browser.

![cover](https://github.com/midoxnet/mapperplus/assets/27289397/b8fabf60-6737-4739-865e-663693ed6960)

**This tool is based on an already existing tool called SourceMapper which helps you extract the source code from a single .map file.**

This tool helps you extract source codes from a list of targets that have .js.map files exposed.

# Logic behind the script:

# Requirements:

This script requires :
1. Google Chrome : **You can install it using the following command :** ```apt install google-chrome-stable```
2. Node.Js : **You can install it using the following command:** ```apt install nodejs``` 
3. Npm : **You can install it using the following command:** ```apt install npm```
4. Go
5. Python
6. SourceMapper : **You can download it from here:** https://github.com/denandz/sourcemapper 

# Installation:

1. Run the requirements.sh script in order to download the latest version of required node modules.
2. Make sure Chrome is installed in your machine: **Run this command to verify** ```google-chrome --version```
3. Make sure you have npm, Node and sourcemapper installed.

# How to use: 

The script have some features and accepts some arguments: 
 1. In order to download all .map files for a single website, use -u with the URL of your target and -t with the output directory where the JS files will be written. ( -u and -t are required.)
    ``` python3 mapperplus.py -u https://www.example.com/ -t  ```
    
The script also accepts cookies and custom headers with -c to include a cookie file and -h to include a custom header.

**Example :** ```python3 mapperplus.py -u https://www.example.com/ -t example_output_directory -c cookiefile.txt -h "Authorization: Basic YWRtaW46YWRtaW4="```

 2. In order to download and extract source codes of multiple targets at once, you can use the -r with the list of your targets.

**Example :** ```python3 mapperplus.py -r targets.txt -t example_output_directory -c cookiefile.txt -h "Authorization: Basic YWRtaW46YWRtaW4="```

# Some under construction features:
1. Download Lazy loaded .js files/chunks and look for their .map files too.
2. Handle some edge cases,  When extracting multiple .js files from various sources, certain websites may necessitate custom cookies to prevent encountering 4xx errors.
**You can add more ideas or contact me on my X profile to share your ideas or needs:** https://twitter.com/silentgh00st 
