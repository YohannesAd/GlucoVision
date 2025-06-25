#!/usr/bin/env node

/**
 * Backend Switcher for GlucoVision Frontend
 * Easily switch between local and Railway backends
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const localEnvPath = path.join(__dirname, '.env.local');
const railwayEnvPath = path.join(__dirname, '.env.railway');

function showUsage() {
  console.log(`
🔄 GlucoVision Backend Switcher

Usage:
  node switch-backend.js [local|railway|status]

Commands:
  local    - Switch to local backend (http://localhost:8000)
  railway  - Switch to Railway backend (https://glucovision-production.up.railway.app)
  status   - Show current backend configuration

Examples:
  node switch-backend.js railway
  node switch-backend.js local
  node switch-backend.js status
`);
}

function getCurrentBackend() {
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/EXPO_PUBLIC_API_URL=(.+)/);
    if (match) {
      return match[1].trim();
    }
  } catch (error) {
    console.log('❌ Could not read .env file');
  }
  return 'Unknown';
}

function switchToLocal() {
  try {
    if (fs.existsSync(localEnvPath)) {
      fs.copyFileSync(localEnvPath, envPath);
      console.log('✅ Switched to LOCAL backend (http://localhost:8000)');
      console.log('🔄 Please restart Expo: Ctrl+C then npm start');
    } else {
      console.log('❌ .env.local file not found');
    }
  } catch (error) {
    console.log('❌ Error switching to local backend:', error.message);
  }
}

function switchToRailway() {
  try {
    if (fs.existsSync(railwayEnvPath)) {
      fs.copyFileSync(railwayEnvPath, envPath);
      console.log('✅ Switched to RAILWAY backend (https://glucovision-production.up.railway.app)');
      console.log('🔄 Please restart Expo: Ctrl+C then npm start');
    } else {
      console.log('❌ .env.railway file not found');
    }
  } catch (error) {
    console.log('❌ Error switching to Railway backend:', error.message);
  }
}

function showStatus() {
  const currentBackend = getCurrentBackend();
  console.log(`
📊 Current Backend Configuration:
   ${currentBackend}

🔍 Backend Type:
   ${currentBackend.includes('railway.app') ? '🚀 Railway (Production)' : 
     currentBackend.includes('localhost') ? '🔧 Local Development' : 
     '❓ Custom/Unknown'}
`);
}

// Main execution
const command = process.argv[2];

switch (command) {
  case 'local':
    switchToLocal();
    break;
  case 'railway':
    switchToRailway();
    break;
  case 'status':
    showStatus();
    break;
  default:
    showUsage();
    break;
}
