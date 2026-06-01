const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Database Management Utility Functions

/**
 * Get database statistics
 */
const getDBStats = async () => {
  try {
    const stats = await mongoose.connection.db.stats();
    return {
      success: true,
      data: {
        databaseName: stats.db,
        collections: stats.collections,
        dataSize: `${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`,
        indexSize: `${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`,
        totalSize: `${(stats.totalSize / 1024 / 1024).toFixed(2)} MB`,
        avgObjectSize: `${(stats.avgObjSize / 1024).toFixed(2)} KB`,
        storageSize: `${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get collection statistics
 */
const getCollectionStats = async (collectionName) => {
  try {
    const collection = mongoose.connection.db.collection(collectionName);
    const stats = await collection.stats();
    const count = await collection.countDocuments();

    return {
      success: true,
      data: {
        collection: collectionName,
        documentCount: count,
        size: `${(stats.size / 1024 / 1024).toFixed(2)} MB`,
        avgDocSize: `${(stats.avgObjSize / 1024).toFixed(2)} KB`,
        indexCount: stats.nindexes
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get all collections info
 */
const getAllCollectionsInfo = async () => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const info = [];

    for (const col of collections) {
      const collection = mongoose.connection.db.collection(col.name);
      const count = await collection.countDocuments();
      const stats = await collection.stats().catch(() => ({}));

      info.push({
        name: col.name,
        documents: count,
        size: stats.size ? `${(stats.size / 1024).toFixed(2)} KB` : 'N/A',
        indexes: stats.nindexes || 0
      });
    }

    return { success: true, data: info };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Clear collection (delete all documents)
 */
const clearCollection = async (collectionName) => {
  try {
    const collection = mongoose.connection.db.collection(collectionName);
    const result = await collection.deleteMany({});

    return {
      success: true,
      message: `Deleted ${result.deletedCount} documents from ${collectionName}`
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Export collection to JSON
 */
const exportCollectionToJSON = async (collectionName, outputPath = null) => {
  try {
    const collection = mongoose.connection.db.collection(collectionName);
    const documents = await collection.find({}).toArray();

    if (!outputPath) {
      outputPath = path.join(
        __dirname,
        `../backups/${collectionName}_${new Date().toISOString().slice(0, 10)}.json`
      );
    }

    // Ensure backup directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(documents, null, 2));

    return {
      success: true,
      message: `Exported ${documents.length} documents`,
      path: outputPath,
      count: documents.length
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Import collection from JSON
 */
const importCollectionFromJSON = async (filePath, collectionName, clearFirst = false) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    if (!Array.isArray(data)) {
      throw new Error('JSON file must contain an array of documents');
    }

    const collection = mongoose.connection.db.collection(collectionName);

    if (clearFirst) {
      await collection.deleteMany({});
    }

    const result = await collection.insertMany(data);

    return {
      success: true,
      message: `Imported ${result.insertedCount} documents`,
      count: result.insertedCount
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Create or verify indexes
 */
const createIndexes = async () => {
  try {
    const User = require('../models/User');
    const BloodRequest = require('../models/BloodRequest');
    const Camp = require('../models/Camp');
    const Donation = require('../models/Donation');

    // User indexes
    await User.collection.createIndex({ email: 1 });
    await User.collection.createIndex({ bloodGroup: 1 });
    await User.collection.createIndex({ isAvailableForDonation: 1 });

    // BloodRequest indexes
    await BloodRequest.collection.createIndex({ bloodGroup: 1 });
    await BloodRequest.collection.createIndex({ status: 1 });
    await BloodRequest.collection.createIndex({ urgency: 1 });
    await BloodRequest.collection.createIndex({ location: 1 });
    await BloodRequest.collection.createIndex({ createdAt: -1 });

    // Camp indexes
    await Camp.collection.createIndex({ date: -1 });
    await Camp.collection.createIndex({ location: 1 });
    await Camp.collection.createIndex({ status: 1 });

    // Donation indexes
    await Donation.collection.createIndex({ donorId: 1 });
    await Donation.collection.createIndex({ status: 1 });
    await Donation.collection.createIndex({ date: -1 });

    return { success: true, message: 'All indexes created/verified' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Backup all collections
 */
const backupAllCollections = async (backupDir = null) => {
  try {
    if (!backupDir) {
      backupDir = path.join(__dirname, `../backups/backup_${new Date().toISOString().slice(0, 10)}`);
    }

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const collections = await mongoose.connection.db.listCollections().toArray();
    const backupSummary = [];

    for (const col of collections) {
      const collection = mongoose.connection.db.collection(col.name);
      const documents = await collection.find({}).toArray();
      const filePath = path.join(backupDir, `${col.name}.json`);

      fs.writeFileSync(filePath, JSON.stringify(documents, null, 2));

      backupSummary.push({
        collection: col.name,
        documents: documents.length,
        file: filePath
      });
    }

    return {
      success: true,
      message: 'Backup completed',
      backupDir,
      summary: backupSummary
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get database connection info
 */
const getConnectionInfo = () => {
  const conn = mongoose.connection;
  return {
    connected: conn.readyState === 1,
    state: ['disconnected', 'connected', 'connecting', 'disconnecting'][conn.readyState],
    host: conn.host,
    port: conn.port,
    database: conn.db?.databaseName || conn.name,
    models: Object.keys(conn.models)
  };
};

/**
 * Count documents in collection
 */
const countCollection = async (collectionName) => {
  try {
    const collection = mongoose.connection.db.collection(collectionName);
    const count = await collection.countDocuments();
    return { success: true, collection: collectionName, count };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Generate database report
 */
const generateDatabaseReport = async () => {
  try {
    const dbStats = await getDBStats();
    const collectionsInfo = await getAllCollectionsInfo();
    const connectionInfo = getConnectionInfo();

    return {
      timestamp: new Date().toISOString(),
      connection: connectionInfo,
      database: dbStats.data,
      collections: collectionsInfo.data
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = {
  getDBStats,
  getCollectionStats,
  getAllCollectionsInfo,
  clearCollection,
  exportCollectionToJSON,
  importCollectionFromJSON,
  createIndexes,
  backupAllCollections,
  getConnectionInfo,
  countCollection,
  generateDatabaseReport
};