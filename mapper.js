const puppeteer = require('puppeteer-extra');
const https = require('https');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

https.globalAgent.options.rejectUnauthorized = false;
puppeteer.use(StealthPlugin());

function displayHelp() {
    console.log(`
Usage: node script-name.js [OPTIONS]
    
Options:
  --url           The URL to scrape.
  --cookie-file   Path to the cookie file.
  --target        The target directory to save downloaded files.
  --header        Additional headers (e.g., "User-Agent: Mozilla").

Examples:
  node script-name.js --url=https://example.com --cookie-file=./cookie.txt --target=./downloads
  node script-name.js --url=https://example.com --header="Authorization: Bearer token"
    `);
    process.exit(0);
}

let urlToScrape, cookieFile, targetDirectory, headers = {};
const args = process.argv.slice(2);

for (let i = 0; i < args.length; i++) {
    const [key, value] = args[i].split('=');
    switch (key) {
        case '--url':
            urlToScrape = value;
            break;
        case '--cookie-file':
            cookieFile = value;
            break;
        case '--target':
            targetDirectory = value;
            break;
        case '--header':
            const [headerKey, headerValue] = value.split(':').map(str => str.trim());
            headers[headerKey] = headerValue;
            break;
        case '--help':
            displayHelp();
            break;
    }
}

if (!urlToScrape || !targetDirectory) {
    console.error("The --url and --target arguments are required.");
    displayHelp();
}

async function downloadFileWithMap(url, outputPath, cookies = "") {
    try {
        // Ensure directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        await downloadFile(url, outputPath, cookies);
        console.log(`Downloaded ${url} to ${outputPath}`);
    } catch (err) {
        console.error(`Failed to download ${url}. Error: ${err.message}`);
        return;
    }

    const mapUrl = url + '.map';
    const mapOutputPath = outputPath + '.map';
    try {
        await downloadFile(mapUrl, mapOutputPath, cookies);
        console.log(`Downloaded ${mapUrl} to ${mapOutputPath}`);
    } catch (err) {
        if (err.response && err.response.status === 404) {
            console.warn(`Map file doesn't exist for ${url}`);
        } else {
            console.error(`Failed to download ${mapUrl}. Error: ${err.message}`);
        }
    }
}

const downloadFile = async (url, outputPath, cookies = "") => {
    const response = await axios.get(url, { 
        responseType: 'arraybuffer',
        headers: {
            ...headers,
            'Cookie': cookies
        }
    });
    fs.writeFileSync(outputPath, response.data);
};

const scrapeAndDownloadJSFiles = async (url, cookieFilePath = null) => {
    const browser = await puppeteer.launch({
        headless: true,
        ignoreHTTPSErrors: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    let cookies = "";
    if (cookieFilePath) {
        cookies = fs.readFileSync(cookieFilePath, 'utf-8').trim();
        await page.setExtraHTTPHeaders({
            ...headers,
            'Cookie': cookies
        });
    }

    const jsFiles = new Set();

    page.on('request', request => {
        if (request.url().endsWith('.js')) {
            jsFiles.add(request.url());
        }
    });

    await page.goto(url, { waitUntil: 'networkidle2' });

    if (!cookies) {
        const puppeteerCookies = await page.cookies();
        cookies = puppeteerCookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
    }

    for (let step = 0; step < 10; step++) {
        await page.evaluate('window.scrollBy(0, window.innerHeight)');
        await page.waitForTimeout(1000);
    }

    await browser.close();

    if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory);
    }

    for (const fileUrl of jsFiles) {
        // Calculate the relative path from the website's root
        const parsedBaseUrl = new URL(urlToScrape);
        const parsedFileUrl = new URL(fileUrl);
        const relativePath = parsedFileUrl.pathname.substring(parsedBaseUrl.pathname.length);
        
        const outputPath = path.join(targetDirectory, relativePath);
        await downloadFileWithMap(fileUrl, outputPath, cookies);
    }
};

scrapeAndDownloadJSFiles(urlToScrape, cookieFile).catch(err => {
    console.error("Error occurred:", err);
    process.exit(1);
});
