#!/usr/bin/env node
/**
 * Downloads the correct PocketBase binary for the current OS + architecture.
 * Run: node pb/download-pb.mjs
 */
import { createWriteStream, existsSync, chmodSync } from 'fs';
import { pipeline } from 'stream/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));

const VERSION = '0.25.9';

const PLATFORM_MAP = {
  'linux-x64':   'linux_amd64',
  'linux-arm64': 'linux_arm64',
  'linux-arm':   'linux_armv7',
  'darwin-x64':  'darwin_amd64',
  'darwin-arm64':'darwin_arm64',
  'win32-x64':   'windows_amd64',
};

const platform = `${process.platform}-${process.arch}`;
const pbPlatform = PLATFORM_MAP[platform];

if (!pbPlatform) {
  console.error(`❌  Unsupported platform: ${platform}`);
  console.error('    Supported:', Object.keys(PLATFORM_MAP).join(', '));
  process.exit(1);
}

const ext = process.platform === 'win32' ? '.zip' : '.zip';
const filename = `pocketbase_${VERSION}_${pbPlatform}${ext}`;
const url = `https://github.com/pocketbase/pocketbase/releases/download/v${VERSION}/${filename}`;
const zipPath = join(__dirname, 'pocketbase.zip');
const binaryPath = join(__dirname, process.platform === 'win32' ? 'pocketbase.exe' : 'pocketbase');

if (existsSync(binaryPath)) {
  console.log(`✅  PocketBase binary already exists at pb/pocketbase`);
  process.exit(0);
}

console.log(`📦  Downloading PocketBase v${VERSION} for ${pbPlatform}...`);
console.log(`    ${url}`);

// Use curl or wget depending on availability
const downloadCmd = `curl -fsSL "${url}" -o "${zipPath}" 2>&1 || wget -q "${url}" -O "${zipPath}"`;
const { stderr } = await execAsync(downloadCmd).catch(e => ({ stderr: e.message }));
if (stderr && !existsSync(zipPath)) {
  console.error('❌  Download failed:', stderr);
  process.exit(1);
}

console.log('📂  Extracting...');
await execAsync(`unzip -o "${zipPath}" pocketbase -d "${__dirname}" 2>&1`).catch(async () => {
  // Windows fallback
  await execAsync(`unzip -o "${zipPath}" -d "${__dirname}"`);
});

// Cleanup
await execAsync(`rm -f "${zipPath}" "${join(__dirname, 'CHANGELOG.md')}" "${join(__dirname, 'LICENSE.md')}"`)
  .catch(() => {});

if (process.platform !== 'win32') {
  chmodSync(binaryPath, 0o755);
}

console.log(`✅  PocketBase ready at pb/pocketbase`);
