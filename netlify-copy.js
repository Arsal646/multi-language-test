const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const dist = 'dist/multi-language-test';
const en = path.join(dist, 'en');
const ar = path.join(dist, 'ar');
const final = path.join(dist, 'final');

fse.emptyDirSync(final);                         // Clean final/
fse.copySync(en, final);                         // Copy English to final/
fse.copySync(ar, path.join(final, 'ar'));        // Copy Arabic to final/ar/

console.log('✅ Netlify output is ready.');
