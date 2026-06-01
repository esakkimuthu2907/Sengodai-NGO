# Blood Connect - Database Schema & Collection Documentation

## Overview

Blood Connect uses MongoDB as its NoSQL database. This document describes all collections, their schemas, indexes, and relationships.

---

## Collections

### 1. **Users Collection**

Stores all user information including donors, volunteers, and admins.

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  role: String (enum: ['user', 'volunteer', 'admin'], default: 'user'),
  bloodGroup: String (enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  phone: String (required),
  location: String (required),
  isAvailableForDonation: Boolean (default: true),
  lastDonationDate: Date,
  profileImage: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email` (unique)
- `bloodGroup`
- `isAvailableForDonation`

**Relationships:**
- Referenced in BloodRequest as `requesterId`
- Referenced in Donation as `donorId` and `recipientId`

---

### 2. **BloodRequests Collection**

Stores blood donation requests from hospitals or patients.

```javascript
{
  _id: ObjectId,
  requesterId: ObjectId (ref: 'User'),
  patientName: String (required),
  bloodGroup: String (enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], required),
  units: Number (required, min: 1),
  urgency: String (enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium'),
  hospitalName: String (required),
  location: String (required),
  contactName: String (required),
  contactPhone: String (required),
  status: String (enum: ['Pending', 'Approved', 'Fulfilled', 'Rejected'], default: 'Pending'),
  volunteersAccepted: [ObjectId] (ref: 'User'),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `bloodGroup`
- `status`
- `urgency`
- `location`
- `createdAt` (descending)

**Relationships:**
- References User collection via `requesterId`
- References User collection via `volunteersAccepted`

---

### 3. **Camps Collection**

Stores blood donation camp information.

```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String,
  location: String (required),
  date: Date (required),
  startTime: String,
  endTime: String,
  contactName: String,
  contactPhone: String,
  target: Number (default: 50),
  registrations: [ObjectId] (ref: 'User'),
  bloodCollected: Number (default: 0),
  status: String (enum: ['Upcoming', 'Ongoing', 'Completed'], default: 'Upcoming'),
  image: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `date` (descending)
- `location`
- `status`

**Relationships:**
- References User collection via `registrations`

---

### 4. **Donations Collection**

Records of completed blood donations.

```javascript
{
  _id: ObjectId,
  donorId: ObjectId (ref: 'User', required),
  recipientId: ObjectId (ref: 'User'),
  bloodGroup: String,
  units: Number (required),
  date: Date (required),
  type: String (enum: ['Whole Blood', 'Plasma', 'Platelet', 'Red Cells'], default: 'Whole Blood'),
  status: String (enum: ['Collected', 'Testing', 'Approved', 'Used', 'Discarded'], default: 'Collected'),
  location: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `donorId`
- `status`
- `date` (descending)

**Relationships:**
- References User collection via `donorId` and `recipientId`

---

### 5. **Messages Collection**

In-app messaging between users.

```javascript
{
  _id: ObjectId,
  senderId: ObjectId (ref: 'User', required),
  recipientId: ObjectId (ref: 'User', required),
  subject: String,
  message: String (required),
  isRead: Boolean (default: false),
  attachments: [String],
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `recipientId`
- `senderId`
- `isRead`
- `createdAt` (descending)

---

### 6. **ContactMessages Collection**

Messages from the contact form (public inquiries).

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required),
  phone: String,
  subject: String (required),
  message: String (required),
  status: String (enum: ['New', 'Read', 'Responded'], default: 'New'),
  response: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email`
- `status`
- `createdAt` (descending)

---

### 7. **Gallery Collection**

Stores gallery images for blood camps and events.

```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  image: String (required),
  imageUrl: String,
  campId: ObjectId (ref: 'Camp'),
  uploadedBy: ObjectId (ref: 'User'),
  tags: [String],
  featured: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `campId`
- `featured`
- `createdAt` (descending)

---

### 8. **Announcements Collection**

System announcements and news.

```javascript
{
  _id: ObjectId,
  title: String (required),
  content: String (required),
  type: String (enum: ['News', 'Alert', 'Event', 'Update'], default: 'News'),
  image: String,
  author: ObjectId (ref: 'User'),
  isActive: Boolean (default: true),
  views: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `isActive`
- `createdAt` (descending)

---

### 9. **Notifications Collection**

User notifications for important events.

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  type: String (enum: ['Request', 'Donation', 'Camp', 'Message', 'Alert'], required),
  title: String (required),
  message: String (required),
  relatedId: ObjectId,
  isRead: Boolean (default: false),
  actionUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `userId`
- `isRead`
- `createdAt` (descending)

---

## Data Relationships

```
User (Center)
├── ↔ BloodRequest (requesterId)
├── ↔ BloodRequest (volunteersAccepted)
├── ↔ Donation (donorId)
├── ↔ Donation (recipientId)
├── ↔ Camp (registrations)
├── ↔ Message (senderId, recipientId)
├── ↔ Gallery (uploadedBy)
├── ↔ Announcement (author)
└── ↔ Notification (userId)
```

---

## Common Queries

### Find donors with specific blood group
```javascript
db.users.find({ bloodGroup: 'O+', isAvailableForDonation: true })
```

### Find pending blood requests
```javascript
db.bloodrequests.find({ status: 'Pending' }).sort({ createdAt: -1 })
```

### Find donations by date range
```javascript
db.donations.find({
  date: { $gte: ISODate("2024-01-01"), $lt: ISODate("2024-12-31") }
})
```

### Find unread messages for user
```javascript
db.messages.find({ recipientId: ObjectId("..."), isRead: false })
```

### Get camp registration count
```javascript
db.camps.aggregate([
  { $project: { name: 1, registrationCount: { $size: "$registrations" } } }
])
```

---

## Backup & Recovery

### Backup all collections
```bash
node dbCLI.js backup
```

### Restore from backup
```bash
mongorestore --uri "mongodb://localhost:27017/blood-connect" --dir backup_folder
```

### Export specific collection
```bash
node dbCLI.js export users
```

---

## Performance Optimization Tips

1. **Indexing**: All frequently queried fields are already indexed.
2. **Connection Pooling**: Configured with max 10 connections.
3. **Query Optimization**: Use `.lean()` for read-only queries to reduce memory usage.
4. **Aggregation Pipeline**: Use for complex queries instead of map-reduce.
5. **Pagination**: Always implement pagination for large result sets.

---

## Maintenance

### Check database health
```bash
node dbCLI.js health
```

### View statistics
```bash
node dbCLI.js stats
```

### Generate report
```bash
node dbCLI.js report
```

---

## Security Notes

- All passwords are hashed using bcryptjs
- Sensitive data should never be exposed in API responses
- Use `.select('-password')` to exclude passwords in queries
- Implement proper authentication before accessing admin routes
- Enable MongoDB authentication in production

---

For more information, see [MONGODB_SETUP.md](./MONGODB_SETUP.md)
