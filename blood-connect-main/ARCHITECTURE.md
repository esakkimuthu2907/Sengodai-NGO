# Blood Connect - Architecture & System Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     BLOOD CONNECT SYSTEM                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React/Vite)                       │
│  - User Interface                                               │
│  - Dashboard                                                    │
│  - Forms for requests, donations, camps                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓ (HTTP/WebSocket)
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express.js + Node.js)               │
│                          PORT 5000                              │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    API ROUTES                            │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ /api/auth          → Authentication                      │  │
│  │ /api/users         → User Management                     │  │
│  │ /api/requests      → Blood Requests                      │  │
│  │ /api/camps         → Donation Camps                      │  │
│  │ /api/donations     → Donation Records                    │  │
│  │ /api/messages      → Messaging                           │  │
│  │ /api/admin/db      → Database Management (NEW!)          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            CONFIGURATION & MANAGEMENT                    │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ config/db.js           → Connection Management          │  │
│  │ config/dbManagement.js → Utilities & Tools              │  │
│  │ routes/admin.js        → Admin API Endpoints            │  │
│  │ initDB.js              → Database Initialization        │  │
│  │ dbCLI.js               → Command Line Interface         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓ (MongoDB Connection)
┌─────────────────────────────────────────────────────────────────┐
│                    MONGODB DATABASE LAYER                        │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │              DATABASE: blood-connect                   │   │
│  ├────────────────────────────────────────────────────────┤   │
│  │ Collections:                                           │   │
│  │  • users ..................... (Donors & Admin)        │   │
│  │  • bloodrequests ............. (Blood Requests)        │   │
│  │  • camps ..................... (Donation Camps)        │   │
│  │  • donations ................. (Donation Records)      │   │
│  │  • messages .................. (User Messages)         │   │
│  │  • contactmessages ........... (Contact Inquiries)     │   │
│  │  • galleries ................. (Camp Photos)           │   │
│  │  • announcements ............. (News & Alerts)         │   │
│  │  • notifications ............. (User Notifications)    │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Connection Options:                                            │
│  ├── MongoDB Atlas (Cloud) ........... [Recommended]          │
│  ├── Local MongoDB Server ............ [Development]          │
│  └── In-Memory MongoDB .............. [Fallback]             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Connection Flow

```
Application Startup
        ↓
┌─────────────────────┐
│ Load .env file      │
└─────────────────────┘
        ↓
┌──────────────────────────┐
│ Attempt MongoDB Atlas    │
│ (if MONGO_URI provided)  │
└──────────────────────────┘
        ↓ (Success?)
    ↙      ↖
  Yes        No
   ↓         ↓
  ✓      Try Local
  ✓      MongoDB
  ✓          ↓
  ✓     (Success?)
  ✓      ↙      ↖
  ✓    Yes      No
  ✓     ↓       ↓
  ✓    ✓    Use In-Memory
  ✓    ✓    MongoDB
  ✓    ✓        ↓
  ✓    ✓       ✓
  └────┴───────┴──→
        ↓
  ✅ Connected!
        ↓
  Create Indexes
  Create Admin User
  Start Server
```

---

## Database Management Tools Architecture

```
┌─────────────────────────────────────────────────────────┐
│         DATABASE MANAGEMENT SYSTEM                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Three Access Methods:                                  │
│                                                         │
│  1️⃣  COMMAND LINE                                       │
│     └─→ dbCLI.js                                       │
│        ├─ node dbCLI.js stats                         │
│        ├─ node dbCLI.js backup                        │
│        ├─ node dbCLI.js health                        │
│        └─ node dbCLI.js report                        │
│                                                         │
│  2️⃣  REST API                                          │
│     └─→ routes/admin.js                               │
│        ├─ GET /api/admin/db/stats                     │
│        ├─ GET /api/admin/db/health                    │
│        ├─ POST /api/admin/db/backup                   │
│        └─ GET /api/admin/db/report                    │
│                                                         │
│  3️⃣  COMPASS/ATLAS UI                                  │
│     └─→ MongoDB Compass                               │
│        ├─ View collections                            │
│        ├─ Edit documents                              │
│        ├─ Export/import data                          │
│        └─ Monitor performance                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────────────────────┐
│    CORE UTILITIES (config/dbManagement.js)              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  getDBStats() ................. Database statistics    │
│  getCollectionStats() ......... Collection stats      │
│  getAllCollectionsInfo() ...... Collections overview  │
│  backupAllCollections() ....... Backup everything    │
│  exportCollectionToJSON() ..... Export collection    │
│  importCollectionFromJSON() ... Import collection    │
│  createIndexes() ............. Create/verify index   │
│  clearCollection() ........... Delete documents      │
│  getConnectionInfo() ......... Connection details    │
│  countCollection() ........... Count documents       │
│  generateDatabaseReport() .... Full report          │
│                                                         │
└─────────────────────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────────────────────┐
│              MONGODB DATABASE                          │
├─────────────────────────────────────────────────────────┤
│  Executes queries, stores data, maintains indexes     │
└─────────────────────────────────────────────────────────┘
```

---

## Setup Decision Tree

```
START: Set up Blood Connect
        ↓
    Do you want to...?
    ↙                    ↖
Development          Production
   ↓                      ↓
Local MongoDB         MongoDB Atlas
   ↓                      ↓
Install MongoDB       Create Free Account
Server                   ↓
   ↓                   Create Cluster
Run initDB.js          ↓
   ↓                   Get Connection String
npm start              ↓
   ↓                   Update .env
✅ Running!            ↓
                       Run initDB.js
                       ↓
                       npm start
                       ↓
                       ✅ Running in Cloud!
```

---

## Collection Relationships

```
┌─────────────────────────────────────────┐
│           USER (Center)                 │
│  • name, email, password, role          │
│  • bloodGroup, phone, location          │
│  • lastDonationDate, profileImage       │
└─────────────────────────────────────────┘
        ↑         ↓         ↓         ↑
       /|\        |         |        /|\
      / | \       |         |       / | \
     /  |  \      |         |      /  |  \
    /   |   \     |         |     /   |   \
   /    |    \    |         |    /    |    \
  |     |     |   |         |   |     |     |
  |     |     |   |         |   |     |     |
Blood  Donation Camp   Message  Gallery  Notification
Request Record  Registration         |
  |      |       |          |        |
  |      |       |          |        |
Requester Donor  Volunteer  Sender   User
  |      |       |          |        |
  |      |       |          |        |
  └──────┴───────┴──────────┴────────┘
       References User
```

---

## Data Flow: Create Blood Request

```
1. User submits form
   ↓
2. Frontend sends POST /api/requests
   ↓
3. Backend validates data
   ↓
4. MongoDB stores in bloodrequests collection
   ↓
5. Create notification for donors
   ↓
6. Send email alerts (optional)
   ↓
7. Return success response
   ↓
8. Frontend updates UI
   ↓
9. Donors see request and can accept
   ↓
10. Donation recorded in donations collection
```

---

## Backup & Recovery Flow

```
BACKUP:
  npm run db:backup
        ↓
  Reads all collections
        ↓
  Creates backup folder
        ↓
  Exports each collection to JSON
        ↓
  Saves to /backend/backups/
        ↓
  ✅ Backup Complete

RESTORE:
  mongorestore --uri "..." --dir backup_folder
        ↓
  Reads JSON files
        ↓
  Imports to MongoDB
        ↓
  ✅ Restored!
```

---

## Performance Optimization Strategy

```
┌──────────────────────┐
│  Query Optimization  │
├──────────────────────┤
│                      │
│  1. USE INDEXES      │
│  └→ Already created  │
│                      │
│  2. SELECT FIELDS    │
│  └→ Don't fetch all  │
│                      │
│  3. PAGINATION       │
│  └→ Limit results    │
│                      │
│  4. CONNECTION POOL  │
│  └→ Max 10 conns    │
│                      │
│  5. AGGREGATION      │
│  └→ For complex ops  │
│                      │
└──────────────────────┘
```

---

## Error Handling & Fallback

```
Connection Attempt 1: MongoDB Atlas
        ↓ (Failed?)
        No → Use Atlas
        Yes ↓
Connection Attempt 2: Local MongoDB
        ↓ (Failed?)
        No → Use Local
        Yes ↓
Connection Attempt 3: In-Memory MongoDB
        ↓ (Failed?)
        No → Use In-Memory (⚠️ Data lost on restart)
        Yes ↓
Error: Cannot start server
```

---

## File Structure with Enhancements

```
backend/
├── config/
│   ├── db.js ........................ ✨ ENHANCED
│   ├── dbManagement.js ............. ✨ NEW
│   └── upload.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── admin.js ................... ✨ NEW
│   └── ...
├── models/
│   ├── User.js
│   ├── BloodRequest.js
│   ├── Camp.js
│   ├── Donation.js
│   ├── Message.js
│   ├── ContactMessage.js
│   ├── Gallery.js
│   ├── Announcement.js
│   └── Notification.js
├── controllers/
├── middleware/
├── server.js ........................ ✨ UPDATED
├── package.json ..................... ✨ UPDATED
├── .env.example .................... ✨ NEW
├── initDB.js ....................... ✨ NEW
├── dbCLI.js ........................ ✨ NEW
└── seed.js
```

---

## Package Scripts

```
npm start           → Start server
npm run dev        → Start server (same)
npm run seed       → Seed initial data
npm run init-db    → Initialize database (NEW)
npm run db:backup  → Backup all collections (NEW)
npm run db:stats   → View statistics (NEW)
npm run db:health  → Check health (NEW)
npm run db:report  → Generate report (NEW)
```

---

## API Endpoint Structure

```
/api/admin/db/
├── GET  /stats
├── GET  /collections
├── GET  /collection/:name/stats
├── GET  /collection/:name/count
├── GET  /connection
├── GET  /health
├── GET  /report
├── POST /backup
├── POST /export/:collection
├── POST /import/:collection
├── POST /indexes
└── POST /clear/:collection
```

---

## Security Layers

```
1. Connection Security
   └─ MongoDB authentication
   └─ Connection pooling

2. API Security
   └─ Admin role check
   └─ Rate limiting
   └─ CORS protection

3. Data Security
   └─ Password hashing
   └─ JWT tokens
   └─ Protected collections

4. Transport Security
   └─ HTTPS (in production)
   └─ Helmet middleware
```

---

## Monitoring & Alerts

```
Continuous Monitoring:
├── Connection health
├── Query performance
├── Data consistency
├── Storage usage
└── Error rates

Alert Conditions:
├─ Connection failed
├─ Queries slow
├─ High error rate
├─ Storage warning
└─ Backup failed
```

---

## Success Path

```
✅ MongoDB installed/selected
        ↓
✅ .env configured
        ↓
✅ npm install
        ↓
✅ npm run init-db
        ↓
✅ npm start
        ↓
✅ npm run db:health (shows healthy)
        ↓
✅ npm run db:backup (creates backup)
        ↓
✅ npm run db:report (shows statistics)
        ↓
✅ Login with admin credentials
        ↓
✅ Data visible in MongoDB Compass
        ↓
🎉 READY TO LAUNCH!
```

---

## Next: Follow These Docs

1. **[QUICKSTART.md](./QUICKSTART.md)** - Start here! (5 minutes)
2. **[MONGODB_SETUP.md](./MONGODB_SETUP.md)** - Detailed setup
3. **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - Understand data structure
4. **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - What was built

---

**Ready? Start with [QUICKSTART.md](./QUICKSTART.md)! 🚀**
