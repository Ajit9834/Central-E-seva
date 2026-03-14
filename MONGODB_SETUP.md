# MongoDB Setup Guide for SevaDesk

## Issue Identified
Documents are being uploaded but not saved to database because MongoDB is not properly configured.

## Quick Fix Steps

### 1. Install MongoDB (if not installed)
```bash
# Windows - Download from https://www.mongodb.com/try/download/community
# Or use Chocolatey: choco install mongodb
```

### 2. Start MongoDB Service
```bash
# Windows
net start MongoDB

# Or run manually
mongod
```

### 3. Create .env.local file
Create `/.env.local` in project root with:
```
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=sevadesk
```

### 4. Test Connection
Visit: http://localhost:3000/api/debug/db

### Alternative: Use MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/atlas
2. Create free account
3. Create new cluster
4. Get connection string
5. Update .env.local:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sevadesk?retryWrites=true&w=majority
MONGODB_DB=sevadesk
```

## Current Status
- ✅ File uploads work (files saved to `/public/uploads`)
- ❌ Database connection failing
- ✅ Fallback to JSON storage working

## Debug Steps
1. Check if MongoDB is running: `mongod --version`
2. Check connection: Visit `/api/debug/db`
3. Check server logs for database errors
4. Verify .env.local exists and has correct values

## Files Modified
- ✅ Fixed API response structure
- ✅ Added proper error logging
- ✅ Fixed type mapping
- ✅ Added debug endpoint
