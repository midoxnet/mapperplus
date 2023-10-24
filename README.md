# Mapperplus - An advanced source map extractor based on headless browser.

![cover](https://github.com/midoxnet/mapperplus/assets/27289397/b8fabf60-6737-4739-865e-663693ed6960)

**MapperPlus is based on an already existing tool called SourceMapper which helps you extract the source code from a single .map file.**
- MapperPlus facilitates the validation and retrieval of all .js/.js.map files from a specified target or a list of targets. It subsequently employs SourceMapper to extract source code for all your designated targets.
- MapperPlus utilizes a Chrome Headless browser to intercept every request and response, ensuring the download of JavaScript files goes beyond heuristic scans or regular expressions, and includes the handling of all requested JS files.

# Some ideas to help you include MapperPlus in your recon automation pipeline:
MapperPlus could be used with httpx , jsluice or Trufflehog and more. 
(https://github.com/BishopFox/jsluice/ , https://github.com/projectdiscovery/httpx , https://github.com/trufflesecurity/trufflehog )
1. You can use httpx to retrieve live webservers and then use its output as an input of MapperPlus.
2. After downloading and extracting all JS files, use JSluice to extract endpoints from every target and then go beyond your recon process.
3. You can use Jsluice or trufflehog also to extract secrets from your source code JS files.
4. And more...!

   
# Requirements:

MapperPlus requires :
1. Google Chrome : **You can install it using the following command :** ```apt install google-chrome-stable```
2. Node.Js : **You can install it using the following command:** ```apt install nodejs``` 
3. Npm : **You can install it using the following command:** ```apt install npm```
4. Go
5. Python
6. SourceMapper : **You can download it from here:** https://github.com/denandz/sourcemapper 

# Installation:

1. Run the requirements.sh script in order to download the latest version of required node modules.
2. Make sure Chrome is installed in your machine: **Run this command to verify** ```google-chrome --version```
3. Make sure you have npm, Node.js and Sourcemapper installed.

# How to use: 

MapperPlus have some features and accepts some arguments: 
 1. In order to download all .map files for a single website, use -u with the URL of your target and -t with the output directory where the JS files will be written. ( -u and -t are required.)
    ``` python3 mapperplus.py -u https://www.example.com/ -t  ```
    
MapperPlus also accepts cookies and custom headers with -c to include a cookie file and -h to include a custom header.

**Example :** ```python3 mapperplus.py -u https://www.example.com/ -t example_output_directory -c cookiefile.txt -h "Authorization: Basic YWRtaW46YWRtaW4="```

 2. In order to download and extract source codes of multiple targets at once, you can use the -r with the list of your targets.

**Example :** ```python3 mapperplus.py -r targets.txt -t example_output_directory -c cookiefile.txt -h "Authorization: Basic YWRtaW46YWRtaW4="```

# Some under construction features:
1. Download Lazy loaded .js files/chunks and look for their .map files too. (This will uncover the hidden parts of a number of websites) - **Security By Obscurity**.
2. Address specific scenarios: When retrieving multiple .js files from multiple sources, some websites may require specific cookies to avoid encountering 4xx errors.


**You can add more ideas or contact me on my X profile to share your ideas or needs:** https://twitter.com/silentgh00st 


