#!/usr/bin/env node

/**
 * Build script for Boa Vida Fish Forecast
 * Optimizes assets, minifies code, and prepares for deployment
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  srcDir: 'src',
  distDir: 'dist',
  assetsDir: 'assets',
  docsDir: 'docs'
};

/**
 * Logs build steps with timestamps
 * @param {string} message - Log message
 * @param {string} level - Log level (info, warn, error)
 */
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : '✅';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

/**
 * Ensures directory exists, creates if not
 * @param {string} dir - Directory path
 */
async function ensureDir(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
    log(`Created directory: ${dir}`);
  }
}

/**
 * Copies file from source to destination
 * @param {string} src - Source file path
 * @param {string} dest - Destination file path
 */
async function copyFile(src, dest) {
  try {
    await fs.copyFile(src, dest);
    log(`Copied: ${src} → ${dest}`);
  } catch (error) {
    log(`Failed to copy ${src}: ${error.message}`, 'error');
    throw error;
  }
}

/**
 * Minifies HTML content
 * @param {string} html - HTML content
 * @returns {string} Minified HTML
 */
function minifyHTML(html) {
  return html
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .replace(/\s+>/g, '>')
    .replace(/<\s+/g, '<')
    .trim();
}

/**
 * Optimizes CSS by removing comments and unnecessary whitespace
 * @param {string} css - CSS content
 * @returns {string} Optimized CSS
 */
function optimizeCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/;\s*}/g, '}')
    .replace(/{\s*/g, '{')
    .replace(/;\s*/g, ';')
    .trim();
}

/**
 * Processes and optimizes the main HTML file
 */
async function processHTML() {
  log('Processing HTML file...');
  
  const htmlPath = path.join(CONFIG.srcDir, 'index.html');
  const distPath = path.join(CONFIG.distDir, 'index.html');
  
  try {
    let html = await fs.readFile(htmlPath, 'utf8');
    
    // Add build timestamp
    const buildTime = new Date().toISOString();
    html = html.replace(
      '<meta name="description"',
      `<meta name="build-time" content="${buildTime}">\n    <meta name="description"`
    );
    
    // Optimize CSS within style tags
    html = html.replace(/<style>([\s\S]*?)<\/style>/g, (match, css) => {
      return `<style>${optimizeCSS(css)}</style>`;
    });
    
    // Add performance optimizations
    html = html.replace(
      '<head>',
      `<head>
    <link rel="preconnect" href="https://unpkg.com">
    <link rel="preconnect" href="https://cdn.tailwindcss.com">
    <link rel="dns-prefetch" href="https://unpkg.com">
    <link rel="dns-prefetch" href="https://cdn.tailwindcss.com">`
    );
    
    // Minify if in production mode
    if (process.env.NODE_ENV === 'production') {
      html = minifyHTML(html);
    }
    
    await fs.writeFile(distPath, html);
    log('HTML processing complete');
  } catch (error) {
    log(`HTML processing failed: ${error.message}`, 'error');
    throw error;
  }
}

/**
 * Copies and validates data files
 */
async function processData() {
  log('Processing data files...');
  
  const dataDir = path.join(CONFIG.srcDir, 'data');
  const distDataDir = path.join(CONFIG.distDir, 'data');
  
  await ensureDir(distDataDir);
  
  try {
    const files = await fs.readdir(dataDir);
    
    for (const file of files) {
      if (file.endsWith('.csv')) {
        const srcPath = path.join(dataDir, file);
        const destPath = path.join(CONFIG.distDir, file); // CSV files go to root
        
        // Validate CSV structure
        const csvContent = await fs.readFile(srcPath, 'utf8');
        const lines = csvContent.split('\n');
        
        if (lines.length < 2) {
          throw new Error(`Invalid CSV file: ${file} - insufficient data`);
        }
        
        const headers = lines[0].split(',');
        if (!headers.includes('Species') || !headers.includes('Place')) {
          throw new Error(`Invalid CSV file: ${file} - missing required columns`);
        }
        
        await copyFile(srcPath, destPath);
        log(`Validated and copied CSV: ${file} (${lines.length - 1} records)`);
      }
    }
  } catch (error) {
    log(`Data processing failed: ${error.message}`, 'error');
    throw error;
  }
}

/**
 * Copies static assets
 */
async function processAssets() {
  log('Processing assets...');
  
  const assetsDir = CONFIG.assetsDir;
  const distAssetsDir = path.join(CONFIG.distDir, CONFIG.assetsDir);
  
  try {
    await fs.access(assetsDir);
    await ensureDir(distAssetsDir);
    
    // Copy all asset files
    const copyAssets = async (dir, destDir) => {
      const items = await fs.readdir(dir, { withFileTypes: true });
      
      for (const item of items) {
        const srcPath = path.join(dir, item.name);
        const destPath = path.join(destDir, item.name);
        
        if (item.isDirectory()) {
          await ensureDir(destPath);
          await copyAssets(srcPath, destPath);
        } else {
          await copyFile(srcPath, destPath);
        }
      }
    };
    
    await copyAssets(assetsDir, distAssetsDir);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      log(`Asset processing failed: ${error.message}`, 'error');
      throw error;
    }
    log('No assets directory found, skipping...');
  }
}

/**
 * Generates build manifest with metadata
 */
async function generateManifest() {
  log('Generating build manifest...');
  
  const manifest = {
    buildTime: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    commit: process.env.GITHUB_SHA || 'unknown',
    files: []
  };
  
  // Collect file information
  const collectFiles = async (dir, basePath = '') => {
    const items = await fs.readdir(dir, { withFileTypes: true });
    
    for (const item of items) {
      const itemPath = path.join(dir, item.name);
      const relativePath = path.join(basePath, item.name);
      
      if (item.isDirectory()) {
        await collectFiles(itemPath, relativePath);
      } else {
        const stats = await fs.stat(itemPath);
        manifest.files.push({
          path: relativePath,
          size: stats.size,
          modified: stats.mtime.toISOString()
        });
      }
    }
  };
  
  await collectFiles(CONFIG.distDir);
  
  const manifestPath = path.join(CONFIG.distDir, 'manifest.json');
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  log(`Build manifest generated: ${manifest.files.length} files`);
}

/**
 * Validates the build output
 */
async function validateBuild() {
  log('Validating build...');
  
  const requiredFiles = [
    'index.html',
    'Boa_Vida_Fish_Finder_data.csv',
    'manifest.json'
  ];
  
  for (const file of requiredFiles) {
    const filePath = path.join(CONFIG.distDir, file);
    try {
      await fs.access(filePath);
      log(`✓ Required file present: ${file}`);
    } catch {
      throw new Error(`Missing required file: ${file}`);
    }
  }
  
  // Validate HTML structure
  const htmlPath = path.join(CONFIG.distDir, 'index.html');
  const html = await fs.readFile(htmlPath, 'utf8');
  
  if (!html.includes('Boa Vida Fish Finder')) {
    throw new Error('HTML validation failed: missing title');
  }
  
  if (!html.includes('React.createElement')) {
    throw new Error('HTML validation failed: missing React code');
  }
  
  log('Build validation complete');
}

/**
 * Main build function
 */
async function build() {
  const startTime = Date.now();
  
  try {
    log('🚀 Starting build process...');
    
    // Clean and create dist directory
    await fs.rm(CONFIG.distDir, { recursive: true, force: true });
    await ensureDir(CONFIG.distDir);
    
    // Process files
    await processHTML();
    await processData();
    await processAssets();
    
    // Generate metadata
    await generateManifest();
    
    // Validate output
    await validateBuild();
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    log(`🎉 Build completed successfully in ${duration}s`);
    
  } catch (error) {
    log(`💥 Build failed: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Run build if called directly
if (require.main === module) {
  build();
}

module.exports = { build };
