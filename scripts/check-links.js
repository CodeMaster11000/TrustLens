const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const pagesDir = path.join(repoRoot, 'frontend', 'pages');
const htmlFiles = fs.readdirSync(pagesDir).filter((file) => file.endsWith('.html'));
const failures = [];

const ignoredSchemes = ['http:', 'https:', 'mailto:', 'tel:', 'javascript:', 'data:'];

function collectIds(html) {
  const ids = new Set();
  const idPattern = /\sid\s*=\s*["']([^"']+)["']/gi;
  let match;

  while ((match = idPattern.exec(html))) {
    ids.add(match[1]);
  }

  return ids;
}

function isIgnoredLink(value) {
  return !value || ignoredSchemes.some((scheme) => value.startsWith(scheme));
}

function checkTarget(sourceFile, attr, value, sourceIds) {
  if (isIgnoredLink(value) || value === '#') {
    return;
  }

  if (value.startsWith('#')) {
    const anchor = value.slice(1);
    if (!sourceIds.has(anchor)) {
      failures.push(`${path.relative(repoRoot, sourceFile)}: ${attr}="${value}" points to a missing id`);
    }

    return;
  }

  const [targetPath, hash] = value.split('#');
  const resolvedTarget = path.resolve(path.dirname(sourceFile), targetPath);

  if (!fs.existsSync(resolvedTarget)) {
    failures.push(`${path.relative(repoRoot, sourceFile)}: ${attr}="${value}" resolves to a missing file`);
    return;
  }

  if (hash) {
    const targetHtml = fs.readFileSync(resolvedTarget, 'utf8');
    const targetIds = collectIds(targetHtml);
    if (!targetIds.has(hash)) {
      failures.push(`${path.relative(repoRoot, sourceFile)}: ${attr}="${value}" points to a missing section id`);
    }
  }
}

for (const fileName of htmlFiles) {
  const htmlPath = path.join(pagesDir, fileName);
  const html = fs.readFileSync(htmlPath, 'utf8');
  const sourceIds = collectIds(html);
  const linkPattern = /\b(href|src)\s*=\s*["']([^"']+)["']/gi;
  let match;

  while ((match = linkPattern.exec(html))) {
    checkTarget(htmlPath, match[1], match[2], sourceIds);
  }
}

if (failures.length) {
  console.error('Broken links found:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Checked ${htmlFiles.length} HTML files: no broken internal links or assets found.`);
