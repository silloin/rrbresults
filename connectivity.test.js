const fs = require('fs');
const path = require('path');
const http = require('http');

// Function to extract hrefs from HTML content
function extractHrefs(content) {
  const hrefRegex = /href="([^"]*)"/g;
  const hrefs = [];
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    hrefs.push(match[1]);
  }
  return hrefs;
}

// Function to get all HTML files
function getHtmlFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory() && item !== 'node_modules') {
      files.push(...getHtmlFiles(fullPath));
    } else if (stat.isFile() && path.extname(item) === '.html') {
      files.push(fullPath);
    }
  }
  return files;
}

// Function to test a URL
function testUrl(url) {
  return new Promise((resolve) => {
    const req = http.request(url, { method: 'HEAD' }, (res) => {
      resolve({ url, status: res.statusCode });
    });
    req.on('error', () => {
      resolve({ url, status: 'ERROR' });
    });
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ url, status: 'TIMEOUT' });
    });
    req.end();
  });
}

// Main function
async function checkConnectivity() {
  const htmlFiles = getHtmlFiles('.');
  const allHrefs = new Set();

  // Extract all hrefs
  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const hrefs = extractHrefs(content);
    hrefs.forEach(href => allHrefs.add(href));
  }

  // Filter internal links (not starting with http or https)
  const internalHrefs = Array.from(allHrefs).filter(href =>
    !href.startsWith('http://') && !href.startsWith('https://') && href !== '#'
  );

  console.log(`Found ${internalHrefs.length} internal hrefs to test.\n`);

  // Test each href
  const results = [];
  for (const href of internalHrefs) {
    const fullUrl = `http://localhost:3000${href.startsWith('/') ? '' : '/'}${href}`;
    const result = await testUrl(fullUrl);
    results.push(result);
    console.log(`${result.status === 200 ? '✅' : '❌'} ${result.url} - ${result.status}`);
  }

  // Summary
  const working = results.filter(r => r.status === 200).length;
  const broken = results.length - working;

  console.log(`\nSummary: ${working} working, ${broken} broken links.`);
}

checkConnectivity().catch(console.error);
