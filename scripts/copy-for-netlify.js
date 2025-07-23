const fs = require('fs-extra');
const path = require('path');

async function copyForNetlify() {
  try {
    console.log('Preparing files for Netlify deployment...');
    
    // Check what was actually built
    const distContents = await fs.readdir('dist');
    console.log('Contents of dist directory:', distContents);
    
    // Find the main build directory (could be my-localized-app or multi-language-test)
    let mainBuildDir = null;
    for (const item of distContents) {
      const itemPath = path.join('dist', item);
      const stats = await fs.stat(itemPath);
      if (stats.isDirectory() && item !== 'ar') {
        mainBuildDir = item;
        break;
      }
    }
    
    if (mainBuildDir) {
      console.log(`Found main build directory: ${mainBuildDir}`);
      
      // Copy English version to root of dist, but preserve ar directory
      const tempArDir = await fs.pathExists('dist/ar');
      let arBackup = null;
      
      if (tempArDir) {
        // Backup ar directory
        arBackup = await fs.readdir('dist/ar');
        await fs.move('dist/ar', 'temp-ar');
      }
      
      // Copy main build to root
      await fs.copy(`dist/${mainBuildDir}`, 'dist', { overwrite: true });
      
      // Restore ar directory
      if (arBackup) {
        await fs.move('temp-ar', 'dist/ar');
        console.log('Arabic version preserved at dist/ar');
      }
      
      // Remove the now-empty main build directory
      await fs.remove(`dist/${mainBuildDir}`);
      
    } else {
      console.log('Main build directory not found, assuming files are already in correct location');
    }
    
    // Ensure Arabic version exists
    if (await fs.pathExists('dist/ar')) {
      console.log('✓ Arabic version found at dist/ar');
    } else {
      console.log('⚠ Warning: Arabic version not found');
    }
    
    // Copy _redirects to dist root if it exists
    if (await fs.pathExists('src/_redirects')) {
      await fs.copy('src/_redirects', 'dist/_redirects');
      console.log('✓ _redirects file copied');
    }
    
    // Verify final structure
    const finalStructure = await fs.readdir('dist');
    console.log('Final dist structure:', finalStructure);
    
    console.log('✅ Files successfully prepared for Netlify deployment');
  } catch (error) {
    console.error('❌ Error preparing files for Netlify:', error);
    process.exit(1);
  }
}

copyForNetlify();