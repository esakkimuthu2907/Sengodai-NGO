const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'data');
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

(async () => {
  try {
    const mongoServer = await MongoMemoryServer.create({
      instance: {
        dbPath,
        storageEngine: 'wiredTiger'
      }
    });
    console.log('Mongo URI:', mongoServer.getUri());
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
