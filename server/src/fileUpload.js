import fs from 'fs/promises';
import path from 'path';
import { createWriteStream, createReadStream } from 'fs';
import { pipeline } from 'stream/promises';
import AdmZip from 'adm-zip';

/**
 * Extract uploaded zip file to project directory
 * @param {string} zipFilePath - Path to the uploaded zip file
 * @param {string} extractToPath - Path where to extract the zip
 * @returns {Promise<string>} - Path to the extracted project directory
 */
export async function extractZipFile(zipFilePath, extractToPath) {
  console.log(`Extracting ${zipFilePath} to ${extractToPath}`);
  
  try {
    const zip = new AdmZip(zipFilePath);
    const zipEntries = zip.getEntries();
    
    // Create extraction directory
    await fs.mkdir(extractToPath, { recursive: true });
    
    // Find the root directory in the zip (often projects are wrapped in a folder)
    let rootDir = null;
    const topLevelEntries = zipEntries.filter(entry => !entry.entryName.includes('/') || entry.entryName.split('/').length === 2);
    
    if (topLevelEntries.length === 1 && topLevelEntries[0].isDirectory) {
      rootDir = topLevelEntries[0].entryName.replace('/', '');
      console.log(`Detected root directory in zip: ${rootDir}`);
    }
    
    // Extract all files
    zip.extractAllTo(extractToPath, true);
    
    // If there's a single root directory, return that path instead
    if (rootDir) {
      const rootPath = path.join(extractToPath, rootDir);
      // Check if package.json exists in the root directory
      try {
        await fs.access(path.join(rootPath, 'package.json'));
        console.log(`Using root directory: ${rootPath}`);
        return rootPath;
      } catch {
        // package.json not in root, use extraction path
        console.log(`package.json not found in root directory, using extraction path: ${extractToPath}`);
        return extractToPath;
      }
    }
    
    return extractToPath;
  } catch (error) {
    throw new Error(`Failed to extract zip file: ${error.message}`);
  }
}

/**
 * Validate that the uploaded project has the required structure
 * @param {string} projectPath - Path to the project directory
 * @returns {Promise<{valid: boolean, errors: string[]}>}
 */
export async function validateProject(projectPath) {
  const errors = [];
  
  try {
    // Check if package.json exists
    try {
      await fs.access(path.join(projectPath, 'package.json'));
    } catch {
      errors.push('package.json not found in project root');
    }
    
    // Parse package.json and check for build script
    try {
      const packageJsonPath = path.join(projectPath, 'package.json');
      const packageContent = await fs.readFile(packageJsonPath, 'utf8');
      const packageJson = JSON.parse(packageContent);
      
      if (!packageJson.scripts || !packageJson.scripts.build) {
        errors.push('No build script found in package.json');
      }
      
      if (!packageJson.name) {
        errors.push('No name field in package.json');
      }
      
    } catch (error) {
      if (!errors.some(e => e.includes('package.json not found'))) {
        errors.push(`Invalid package.json: ${error.message}`);
      }
    }
    
    // Check for common framework files
    const frameworkFiles = [
      'vite.config.js', 'vite.config.ts',
      'webpack.config.js', 'webpack.config.ts',
      'next.config.js', 'next.config.ts',
      'vue.config.js', 'vue.config.ts',
      'angular.json',
      'svelte.config.js'
    ];
    
    let frameworkDetected = false;
    for (const file of frameworkFiles) {
      try {
        await fs.access(path.join(projectPath, file));
        frameworkDetected = true;
        console.log(`Detected framework config: ${file}`);
        break;
      } catch {
        // File doesn't exist, continue
      }
    }
    
    if (!frameworkDetected) {
      console.log('No specific framework config detected, assuming generic Node.js project');
    }
    
  } catch (error) {
    errors.push(`Project validation error: ${error.message}`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Clean up temporary files
 * @param {string[]} filePaths - Array of file paths to delete
 */
export async function cleanupTempFiles(filePaths) {
  for (const filePath of filePaths) {
    try {
      await fs.unlink(filePath);
      console.log(`Cleaned up temporary file: ${filePath}`);
    } catch (error) {
      console.warn(`Failed to cleanup file ${filePath}:`, error.message);
    }
  }
}

/**
 * Copy build output to deployment directory
 * @param {string} buildOutputPath - Path to the build output directory
 * @param {string} deploymentPath - Path to the deployment directory
 * @returns {Promise<void>}
 */
export async function copyBuildOutput(buildOutputPath, deploymentPath) {
  console.log(`Copying build output from ${buildOutputPath} to ${deploymentPath}`);
  
  try {
    // Ensure deployment directory exists
    await fs.mkdir(deploymentPath, { recursive: true });
    
    // Copy all files from build output to deployment directory
    await copyDirectory(buildOutputPath, deploymentPath);
    
    console.log('Build output copied successfully');
  } catch (error) {
    throw new Error(`Failed to copy build output: ${error.message}`);
  }
}

/**
 * Recursively copy directory contents
 * @param {string} src - Source directory
 * @param {string} dest - Destination directory
 */
async function copyDirectory(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        await copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (error) {
    throw new Error(`Failed to copy directory: ${error.message}`);
  }
}