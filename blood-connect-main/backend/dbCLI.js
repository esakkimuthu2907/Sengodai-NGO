#!/usr/bin/env node

/**
 * Database Management CLI Tool
 * Usage: node dbCLI.js [command] [options]
 *
 * Commands:
 *   stats              - Show database statistics
 *   collections        - List all collections and their document count
 *   backup             - Backup all collections to JSON files
 *   export <collection> - Export a specific collection
 *   clear <collection> - Clear all documents from a collection
 *   health             - Check database connection health
 *   report             - Generate comprehensive database report
 *   indexes            - Create or verify database indexes
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Import database utilities
const connectDB = require('./config/db');
const dbManagement = require('./config/dbManagement');

const args = process.argv.slice(2);
const command = args[0];

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function printTable(data) {
  if (!data || data.length === 0) {
    log('No data to display', 'yellow');
    return;
  }

  const keys = Object.keys(data[0]);
  const maxWidths = {};

  // Calculate column widths
  keys.forEach(key => {
    maxWidths[key] = Math.max(key.length, ...data.map(row => String(row[key]).length));
  });

  // Print header
  const header = keys.map(key => key.padEnd(maxWidths[key])).join(' │ ');
  log(header, 'bright');
  log('─'.repeat(header.length), 'cyan');

  // Print rows
  data.forEach(row => {
    const values = keys.map(key => String(row[key]).padEnd(maxWidths[key])).join(' │ ');
    log(values);
  });
}

async function handleCommand() {
  try {
    // Connect to database
    log('🔗 Connecting to database...', 'cyan');
    await connectDB();
    log('✅ Connected to database', 'green');

    switch (command) {
      case 'stats':
        await handleStats();
        break;

      case 'collections':
        await handleCollections();
        break;

      case 'backup':
        await handleBackup();
        break;

      case 'export':
        await handleExport();
        break;

      case 'clear':
        await handleClear();
        break;

      case 'health':
        await handleHealth();
        break;

      case 'report':
        await handleReport();
        break;

      case 'indexes':
        await handleIndexes();
        break;

      default:
        printHelp();
    }
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }

  // Close connection
  await mongoose.connection.close();
  process.exit(0);
}

async function handleStats() {
  log('📊 Retrieving database statistics...', 'cyan');
  const result = await dbManagement.getDBStats();

  if (result.success) {
    log('Database Statistics:', 'bright');
    Object.entries(result.data).forEach(([key, value]) => {
      log(`  ${key}: ${value}`);
    });
  } else {
    log(`Error: ${result.error}`, 'red');
  }
}

async function handleCollections() {
  log('📁 Retrieving collections...', 'cyan');
  const result = await dbManagement.getAllCollectionsInfo();

  if (result.success) {
    log('Collections:', 'bright');
    printTable(result.data);
  } else {
    log(`Error: ${result.error}`, 'red');
  }
}

async function handleBackup() {
  log('💾 Starting backup...', 'cyan');
  const result = await dbManagement.backupAllCollections();

  if (result.success) {
    log(`✅ ${result.message}`, 'green');
    log(`Backup location: ${result.backupDir}`, 'blue');
    log('Collections backed up:', 'bright');
    result.summary.forEach(item => {
      log(`  ${item.collection}: ${item.documents} documents`);
    });
  } else {
    log(`Error: ${result.error}`, 'red');
  }
}

async function handleExport() {
  const collection = args[1];

  if (!collection) {
    log('❌ Collection name required', 'red');
    log('Usage: node dbCLI.js export <collection_name>', 'yellow');
    process.exit(1);
  }

  log(`📤 Exporting collection: ${collection}...`, 'cyan');
  const result = await dbManagement.exportCollectionToJSON(collection);

  if (result.success) {
    log(`✅ ${result.message}`, 'green');
    log(`File: ${result.path}`, 'blue');
  } else {
    log(`Error: ${result.error}`, 'red');
  }
}

async function handleClear() {
  const collection = args[1];

  if (!collection) {
    log('❌ Collection name required', 'red');
    log('Usage: node dbCLI.js clear <collection_name>', 'yellow');
    process.exit(1);
  }

  // Safety check
  const protectedCollections = ['users', 'camps'];
  if (protectedCollections.includes(collection.toLowerCase())) {
    log(`❌ Cannot clear protected collection: ${collection}`, 'red');
    process.exit(1);
  }

  log(`⚠️  About to clear all documents from: ${collection}`, 'yellow');
  log('Press Ctrl+C to cancel...', 'yellow');

  // Wait 3 seconds before proceeding
  await new Promise(res => setTimeout(res, 3000));

  const result = await dbManagement.clearCollection(collection);

  if (result.success) {
    log(`✅ ${result.message}`, 'green');
  } else {
    log(`Error: ${result.error}`, 'red');
  }
}

async function handleHealth() {
  log('🏥 Checking database health...', 'cyan');

  const connectionInfo = dbManagement.getConnectionInfo();
  const dbStats = await dbManagement.getDBStats();

  log('Connection Status:', 'bright');
  log(`  State: ${connectionInfo.state}`);
  log(`  Host: ${connectionInfo.host}`);
  log(`  Port: ${connectionInfo.port}`);
  log(`  Database: ${connectionInfo.database}`);

  if (connectionInfo.connected) {
    log('✅ Database is healthy', 'green');
    if (dbStats.success) {
      log('Statistics:', 'bright');
      Object.entries(dbStats.data).forEach(([key, value]) => {
        log(`  ${key}: ${value}`);
      });
    }
  } else {
    log('❌ Database connection unhealthy', 'red');
  }
}

async function handleReport() {
  log('📋 Generating database report...', 'cyan');
  const report = await dbManagement.generateDatabaseReport();

  if (report.error) {
    log(`Error: ${report.error}`, 'red');
    return;
  }

  log(`Report Generated: ${report.timestamp}`, 'green');
  log('');
  log('Connection Info:', 'bright');
  Object.entries(report.connection).forEach(([key, value]) => {
    log(`  ${key}: ${JSON.stringify(value)}`);
  });

  log('');
  log('Database Info:', 'bright');
  Object.entries(report.database).forEach(([key, value]) => {
    log(`  ${key}: ${value}`);
  });

  log('');
  log('Collections:', 'bright');
  printTable(report.collections);
}

async function handleIndexes() {
  log('🔑 Creating/verifying indexes...', 'cyan');
  const result = await dbManagement.createIndexes();

  if (result.success) {
    log(`✅ ${result.message}`, 'green');
  } else {
    log(`Error: ${result.error}`, 'red');
  }
}

function printHelp() {
  log('Blood Connect - Database Management CLI', 'bright');
  log('');
  log('Usage: node dbCLI.js [command] [options]', 'cyan');
  log('');
  log('Commands:', 'bright');
  log('  stats              Show database statistics');
  log('  collections        List all collections');
  log('  backup             Backup all collections to JSON');
  log('  export <name>      Export a specific collection');
  log('  clear <name>       Clear collection documents');
  log('  health             Check database connection health');
  log('  report             Generate comprehensive report');
  log('  indexes            Create/verify database indexes');
  log('');
  log('Examples:', 'bright');
  log('  node dbCLI.js stats');
  log('  node dbCLI.js backup');
  log('  node dbCLI.js export users');
  log('  node dbCLI.js health');
  log('');
}

// Run if command provided
if (command) {
  handleCommand().catch(error => {
    log(`Fatal error: ${error.message}`, 'red');
    process.exit(1);
  });
} else {
  printHelp();
}
