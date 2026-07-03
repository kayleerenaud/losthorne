// Losthorne build: bundles prototype/src/ into the single-file prototype/index.html
// that the session preview panel can serve. Source of truth = prototype/src/**.
// Usage: node build.js
const { buildSync } = require('esbuild');
const fs = require('fs');
const out = buildSync({
  entryPoints: ['prototype/src/js/main.js'],
  bundle: true, format: 'iife', write: false,
  target: ['es2018'], charset: 'utf8',
});
const js = out.outputFiles[0].text;
let html = fs.readFileSync('prototype/src/index.html', 'utf8');
const tag = '<script type="module" src="js/main.js"></script>';
if (!html.includes(tag)) { console.error('build: module tag not found in src/index.html'); process.exit(1); }
html = html.replace(tag, '<script>\n' + js + '</script>');
html = '<!-- GENERATED FILE — edit prototype/src/** and run `npm run build`. -->\n' + html;
fs.writeFileSync('prototype/index.html', html);
console.log('built prototype/index.html (' + (html.length/1024).toFixed(1) + ' KB)');
