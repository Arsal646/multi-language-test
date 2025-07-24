const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

async function prepareNetlifyDist() {
  try {
    console.log('Preparing Netlify distribution...');
    
    // Clean and create netlify-dist directory
    const netlifyDist = 'netlify-dist';
    fse.emptyDirSync(netlifyDist);
    
    // Check the actual build output structure
    const distPath = 'dist/multi-language-test';
    if (!fs.existsSync(distPath)) {
      throw new Error(`Build output not found at ${distPath}`);
    }
    
    const distContents = fs.readdirSync(distPath);
    console.log('Build output contents:', distContents);
    
    // Look for locale directories
    const enPath = path.join(distPath, 'en-US');
    const arPath = path.join(distPath, 'ar-AE');
    
    if (fs.existsSync(enPath)) {
      // Copy English version to root
      fse.copySync(enPath, netlifyDist);
      console.log('✓ English version copied to root');
    } else {
      throw new Error('English build not found at ' + enPath);
    }
    
    if (fs.existsSync(arPath)) {
      // Copy Arabic version to /ar-AE subdirectory
      fse.copySync(arPath, path.join(netlifyDist, 'ar-AE'));
      console.log('✓ Arabic version copied to /ar-AE');
    } else {
      console.log('⚠ Warning: Arabic build not found at ' + arPath);
    }
    
    // Create _redirects file for SPA routing
    const redirectsContent = `# Redirect root to English
/  /en-US/  301!

# Handle SPA routing for each locale
/en-US/*  /en-US/index.html  200
/ar-AE/*  /ar-AE/index.html  200`;
    
    fs.writeFileSync(path.join(netlifyDist, '_redirects'), redirectsContent);
    console.log('✓ _redirects file created');
    
    console.log('✅ Netlify distribution ready at netlify-dist/');
  } catch (error) {
    console.error('❌ Error preparing Netlify distribution:', error);
    process.exit(1);
  }
}

prepareNetlifyDist();
