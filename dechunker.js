const axios = require('axios');
const process = require('process');

// Function to fetch JavaScript content from a URL - TBD: add custom header or cookies..
async function fetchJavaScript(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching JavaScript from URL: ${error.message}`);
        process.exit(1);
    }
}

// Function to extract functions containing '+ ".js"' from JavaScript content
function extractFunctions(content) {
    const pattern = /\+\s*['"](?:\.\w+)?\.js['"]/g;  //Regex to match anything .XXXXX.js and .js -- Looking to create a more generic way to extract chunks ..
	
    let match;
    const functions = [];

    while ((match = pattern.exec(content)) !== null) {
        // Starting positions for search
        let startIndex = match.index;
        let endIndex = match.index;
        let braceCount = 0;
        let foundStart = false, foundEnd = false;

        // Search backwards to find the start of the function
        while (startIndex > 0) {
            if (content[startIndex] === '}') braceCount++;
            if (content[startIndex] === '{') {
                braceCount--;
                if (braceCount === -1) {
                    foundStart = true;
                    break;
                }
            }
            startIndex--;
        }

        // Reset brace count and search forward to find the end of the function
        braceCount = 1;
        while (endIndex < content.length) {
            if (content[endIndex] === '{') braceCount++;
            if (content[endIndex] === '}') {
                braceCount--;
                if (braceCount === 0) {
                    foundEnd = true;
                    break;
                }
            }
            endIndex++;
        }

        // Extract and store the function if both start and end are found
        if (foundStart && foundEnd) {
            const fnContent = content.substring(startIndex, endIndex + 1);
            functions.push(fnContent);
        }
    }

    return functions;
}

// From this function we could add patterns to extract chunk names .. all we need now is to get as much as possible of patterns 
function extractChunkIdentifiers(fnString) {
    // Regex to find all whole numbers
    const numericPattern = /\b\d+\b/g;
    // Regex to find keys like 'chunk-01ab65ee'
    const chunkPattern = /chunk-\w+/g;
    // Regex for longer numeric identifiers
    const chunkIdRegex = /\b\d{4,}\b/g;
    // New regex to extract keys from an object pattern
    const objectKeyPattern = /\"([^\"]+)\":\"[^\"]+\"/g;

    let match;
    const identifiers = new Set();

    // Extract numeric identifiers
    while ((match = numericPattern.exec(fnString)) !== null) {
        identifiers.add(parseInt(match[0], 10));
    }

    // Extract 'chunk-' pattern identifiers
    while ((match = chunkPattern.exec(fnString)) !== null) {
        identifiers.add(match[0]);
    }

    // Extract longer numeric identifiers
    while ((match = chunkIdRegex.exec(fnString)) !== null) {
        identifiers.add(parseInt(match[0], 10));
    }

    // Extract keys from object pattern
    while ((match = objectKeyPattern.exec(fnString)) !== null) {
        identifiers.add(match[1]);
    }

    return Array.from(identifiers);
}



function modifyFunction(fnString) {
    // Regex to find one-letter variable.property patterns
    const varPatternRegex = /\b[a-zA-Z_$]\.[a-zA-Z_$]\b/g;
    const predefinedValue = '""'; // The value to replace matches with

    // Regex to capture the parameter name more reliably
    const paramUsageRegex = /\[(\w+)\]|\((\w+)\)/;

    // Extract the function body
    const functionBodyStartIndex = fnString.indexOf('{');
    const functionBodyEndIndex = fnString.lastIndexOf('}');
    let functionBody = fnString.substring(functionBodyStartIndex + 1, functionBodyEndIndex);

    // Replace variable patterns in the function body
    functionBody = functionBody.replace(varPatternRegex, predefinedValue);

    // Capture the parameter name
    let paramName = 'e'; // Default parameter name
    const paramMatch = functionBody.match(paramUsageRegex);
    if (paramMatch) {
        paramName = paramMatch[1] || paramMatch[2];
    }

    // Reconstruct the function string
    fnString = `function(${paramName}) {${functionBody}}`;

    return fnString;
}


async function processFile(url) {
    let getChunkPath = null;

    try {
        const jsContent = await fetchJavaScript(url);
        const extractedFunctions = extractFunctions(jsContent);
     //   console.log("Extracted Functions: ", extractedFunctions);

        extractedFunctions.forEach(fnString => {
            try {
                // Modify the function string
                const modifiedFnString = modifyFunction(fnString);

                // Wrap and evaluate the modified function string
                const wrappedFunctionString = `(${modifiedFnString})`;
                getChunkPath = eval(wrappedFunctionString);

                if (typeof getChunkPath !== 'function') {
                    throw new Error("Extracted code does not define a valid function.");
                }

                // Extract chunk identifiers from the modified function string
                const chunkIds = extractChunkIdentifiers(modifiedFnString);
             //   console.log("Chunk File Paths: ");
                chunkIds.forEach(id => {
                    try {
                        const path = getChunkPath(id);
                        console.log(`${path}`);
                    } catch (pathError) {
                        console.error("Error getting path for chunk ID", id, ":", pathError.message);
                    }
                });
            } catch (evalError) {
                console.error("Error evaluating extracted code:", evalError.message);
            }
        });
    } catch (fetchError) {
        console.error("Error fetching JavaScript content:", fetchError.message);
    }
}


// Read the URL from command line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
    console.error("Please provide a URL to a JavaScript file.");
    process.exit(1);
}

const jsFileUrl = args[0];
processFile(jsFileUrl);
