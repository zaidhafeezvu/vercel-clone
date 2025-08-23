import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';

/**
 * Detect package manager based on lock files in project directory
 * @param {string} projectPath - Path to the project directory
 * @returns {Promise<{manager: string, command: string, installArgs: string[], buildArgs: string[]}>}
 */
export async function detectPackageManager(projectPath) {
  const lockFiles = {
    'bun.lockb': {
      manager: 'bun',
      command: 'bun',
      installArgs: ['install'],
      buildArgs: ['run', 'build']
    },
    'pnpm-lock.yaml': {
      manager: 'pnpm',
      command: 'pnpm',
      installArgs: ['install'],
      buildArgs: ['run', 'build']
    },
    'yarn.lock': {
      manager: 'yarn',
      command: 'yarn',
      installArgs: ['install'],
      buildArgs: ['build']
    },
    'package-lock.json': {
      manager: 'npm',
      command: 'npm',
      installArgs: ['install'],
      buildArgs: ['run', 'build']
    }
  };

  // Check for lock files in order of preference (fastest to slowest)
  for (const [lockFile, config] of Object.entries(lockFiles)) {
    try {
      await fs.access(path.join(projectPath, lockFile));
      console.log(`Detected ${config.manager} from ${lockFile}`);
      return config;
    } catch {
      // File doesn't exist, continue checking
    }
  }

  // Default to npm if no lock file found but package.json exists
  try {
    await fs.access(path.join(projectPath, 'package.json'));
    console.log('No lock file found, defaulting to npm');
    return lockFiles['package-lock.json'];
  } catch {
    throw new Error('No package.json found in project directory');
  }
}

/**
 * Check if a package manager is available on the system
 * @param {string} command - Package manager command
 * @returns {Promise<boolean>}
 */
export async function isPackageManagerAvailable(command) {
  return new Promise((resolve) => {
    const child = spawn(command, ['--version'], { stdio: 'ignore' });
    child.on('close', (code) => {
      resolve(code === 0);
    });
    child.on('error', () => {
      resolve(false);
    });
  });
}

/**
 * Install dependencies using the detected package manager
 * @param {string} projectPath - Path to the project directory
 * @param {object} packageManager - Package manager configuration
 * @returns {Promise<{success: boolean, output: string}>}
 */
export async function installDependencies(projectPath, packageManager) {
  console.log(`Installing dependencies with ${packageManager.manager}...`);
  
  // Check if package manager is available
  const isAvailable = await isPackageManagerAvailable(packageManager.command);
  if (!isAvailable) {
    throw new Error(`Package manager '${packageManager.command}' is not available on the system`);
  }

  return new Promise((resolve) => {
    let output = '';
    
    const child = spawn(packageManager.command, packageManager.installArgs, {
      cwd: projectPath,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    child.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      console.log(`[${packageManager.manager} stdout]`, text.trim());
    });

    child.stderr.on('data', (data) => {
      const text = data.toString();
      output += text;
      console.log(`[${packageManager.manager} stderr]`, text.trim());
    });

    child.on('close', (code) => {
      const success = code === 0;
      console.log(`Dependencies installation ${success ? 'completed' : 'failed'} (exit code: ${code})`);
      resolve({ success, output });
    });

    child.on('error', (error) => {
      console.error('Error installing dependencies:', error);
      resolve({ success: false, output: output + '\nError: ' + error.message });
    });
  });
}

/**
 * Build the project using the detected package manager
 * @param {string} projectPath - Path to the project directory
 * @param {object} packageManager - Package manager configuration
 * @returns {Promise<{success: boolean, output: string}>}
 */
export async function buildProject(projectPath, packageManager) {
  console.log(`Building project with ${packageManager.manager}...`);
  
  return new Promise((resolve) => {
    let output = '';
    
    const child = spawn(packageManager.command, packageManager.buildArgs, {
      cwd: projectPath,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    child.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      console.log(`[${packageManager.manager} build stdout]`, text.trim());
    });

    child.stderr.on('data', (data) => {
      const text = data.toString();
      output += text;
      console.log(`[${packageManager.manager} build stderr]`, text.trim());
    });

    child.on('close', (code) => {
      const success = code === 0;
      console.log(`Build ${success ? 'completed' : 'failed'} (exit code: ${code})`);
      resolve({ success, output });
    });

    child.on('error', (error) => {
      console.error('Error building project:', error);
      resolve({ success: false, output: output + '\nError: ' + error.message });
    });
  });
}

/**
 * Detect the build output directory based on common patterns
 * @param {string} projectPath - Path to the project directory
 * @returns {Promise<string>} - Path to build directory
 */
export async function detectBuildOutput(projectPath) {
  const commonOutputDirs = ['dist', 'build', 'out', '.next/out', 'public'];
  
  for (const dir of commonOutputDirs) {
    const fullPath = path.join(projectPath, dir);
    try {
      const stats = await fs.stat(fullPath);
      if (stats.isDirectory()) {
        console.log(`Detected build output directory: ${dir}`);
        return fullPath;
      }
    } catch {
      // Directory doesn't exist, continue checking
    }
  }
  
  // Default to dist if nothing found
  const defaultPath = path.join(projectPath, 'dist');
  console.log('No build output directory found, defaulting to dist');
  return defaultPath;
}

/**
 * Parse package.json to get project information
 * @param {string} projectPath - Path to the project directory
 * @returns {Promise<object>} - Package.json contents
 */
export async function parsePackageJson(projectPath) {
  try {
    const packageJsonPath = path.join(projectPath, 'package.json');
    const content = await fs.readFile(packageJsonPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error('Failed to parse package.json: ' + error.message);
  }
}