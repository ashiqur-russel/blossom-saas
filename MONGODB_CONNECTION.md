# MongoDB Connection Guide

## MongoDB Compass Connection String

Use this connection string in MongoDB Compass:

```
mongodb://localhost:28018/flower-business
```

### Steps to Connect:

1. Open MongoDB Compass
2. Click "New Connection"
3. Paste the connection string: `mongodb://localhost:28018/flower-business`
4. Click "Connect"

## Alternative: Command Line Access

### View all databases:
```bash
cd /Users/ashiqur/Documents/flower-business
docker-compose -f db/docker-compose.dev.yml exec mongodb mongosh --eval "db.adminCommand('listDatabases')"
```

### Connect to flower-business database:
```bash
docker-compose -f db/docker-compose.dev.yml exec mongodb mongosh flower-business
```

### View all collections:
```bash
docker-compose -f db/docker-compose.dev.yml exec mongodb mongosh flower-business --eval "db.getCollectionNames()"
```

### View all flower weeks:
```bash
docker-compose -f db/docker-compose.dev.yml exec mongodb mongosh flower-business --eval "db.flower_weeks.find().pretty()"
```

### Count documents:
```bash
docker-compose -f db/docker-compose.dev.yml exec mongodb mongosh flower-business --eval "db.flower_weeks.countDocuments()"
```

### Delete all documents (be careful!):
```bash
docker-compose -f db/docker-compose.dev.yml exec mongodb mongosh flower-business --eval "db.flower_weeks.deleteMany({})"
```

## Quick Access Script

You can also use the npm script:
```bash
npm run db:dev:shell
```

This will open an interactive MongoDB shell.


