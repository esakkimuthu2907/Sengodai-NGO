const express = require('express');
const router = express.Router();
const dbManagement = require('../config/dbManagement');

// Middleware to protect admin routes (you should implement proper auth)
const adminOnly = (req, res, next) => {
  // TODO: Implement proper JWT validation and admin role check
  // For now, we'll allow access but you should add:
  // if (req.user?.role !== 'admin') {
  //   return res.status(403).json({ success: false, message: 'Admin access required' });
  // }
  next();
};

/**
 * GET /api/admin/db/stats
 * Get overall database statistics
 */
router.get('/stats', adminOnly, async (req, res) => {
  try {
    const stats = await dbManagement.getDBStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/admin/db/collections
 * Get information about all collections
 */
router.get('/collections', adminOnly, async (req, res) => {
  try {
    const info = await dbManagement.getAllCollectionsInfo();
    res.status(200).json(info);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/admin/db/collection/:name/stats
 * Get statistics for a specific collection
 */
router.get('/collection/:name/stats', adminOnly, async (req, res) => {
  try {
    const stats = await dbManagement.getCollectionStats(req.params.name);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/admin/db/collection/:name/count
 * Count documents in a collection
 */
router.get('/collection/:name/count', adminOnly, async (req, res) => {
  try {
    const result = await dbManagement.countCollection(req.params.name);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/admin/db/connection
 * Get database connection information
 */
router.get('/connection', adminOnly, (req, res) => {
  try {
    const info = dbManagement.getConnectionInfo();
    res.status(200).json({ success: true, data: info });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/admin/db/report
 * Generate comprehensive database report
 */
router.get('/report', adminOnly, async (req, res) => {
  try {
    const report = await dbManagement.generateDatabaseReport();
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/admin/db/backup
 * Backup all collections to JSON files
 */
router.post('/backup', adminOnly, async (req, res) => {
  try {
    const result = await dbManagement.backupAllCollections();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/admin/db/export/:collection
 * Export a specific collection to JSON
 */
router.post('/export/:collection', adminOnly, async (req, res) => {
  try {
    const result = await dbManagement.exportCollectionToJSON(req.params.collection);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/admin/db/import/:collection
 * Import a collection from JSON file (requires file upload)
 * Note: This endpoint expects a file upload. Use multipart/form-data
 */
router.post('/import/:collection', adminOnly, async (req, res) => {
  try {
    // This is a placeholder. You would need to implement file upload handling
    // using multer middleware
    res.status(501).json({ 
      success: false, 
      message: 'Import endpoint requires multipart/form-data file upload' 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/admin/db/clear/:collection
 * Clear all documents from a collection (DANGEROUS!)
 */
router.post('/clear/:collection', adminOnly, async (req, res) => {
  try {
    // Safety check for critical collections
    const protectedCollections = ['users', 'camps'];
    if (protectedCollections.includes(req.params.collection.toLowerCase())) {
      return res.status(403).json({
        success: false,
        message: `Cannot clear protected collection: ${req.params.collection}`
      });
    }

    const result = await dbManagement.clearCollection(req.params.collection);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/admin/db/indexes
 * Create or verify all database indexes
 */
router.post('/indexes', adminOnly, async (req, res) => {
  try {
    const result = await dbManagement.createIndexes();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/admin/db/health
 * Check database health status
 */
router.get('/health', async (req, res) => {
  try {
    const connectionInfo = dbManagement.getConnectionInfo();
    const stats = await dbManagement.getDBStats();

    const health = {
      status: connectionInfo.connected ? 'healthy' : 'unhealthy',
      connected: connectionInfo.connected,
      database: connectionInfo.database,
      timestamp: new Date().toISOString(),
      ...stats
    };

    res.status(connectionInfo.connected ? 200 : 503).json(health);
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;