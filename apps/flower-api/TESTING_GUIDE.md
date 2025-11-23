# Testing Authentication Module - Local Development Guide

## Prerequisites

1. Node.js installed
2. Docker Desktop running (for MongoDB)
3. `.env` file configured

## Step-by-Step Setup

### 1. Create `.env` File

```bash
cd /Users/ashiqur/Documents/flower-business/apps/flower-api

# Option 1: Use the setup script (recommended)
./setup-env.sh

# Option 2: Create manually
cp .env.example .env
# Then edit .env and add your secrets
```

### 2. Start MongoDB Database

```bash
# From project root
cd /Users/ashiqur/Documents/flower-business
docker-compose -f db/docker-compose.dev.yml up -d

# Verify MongoDB is running
docker ps | grep mongodb
```

### 3. Install Dependencies (if not already done)

```bash
cd /Users/ashiqur/Documents/flower-business/apps/flower-api
npm install
```

### 4. Start the API Server

```bash
cd /Users/ashiqur/Documents/flower-business/apps/flower-api
npm run start:dev
```

You should see:
```
Application is running on: http://localhost:3000
Swagger documentation: http://localhost:3000/api
```

## Testing Endpoints

### Option 1: Using Swagger UI (Easiest)

1. Open your browser and go to: **http://localhost:3000/api**
2. You'll see all available endpoints with interactive testing

### Option 2: Using cURL

#### Register a New User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "firstName": "John",
    "lastName": "Doe",
    "businessName": "Blossom Flowers"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

#### Get Profile (Protected Route)
```bash
# First login to get access token, then:
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -b cookies.txt
```

#### Refresh Token
```bash
curl -X POST http://localhost:3000/auth/refresh \
  -b cookies.txt
```

#### Logout
```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -b cookies.txt
```

### Option 3: Using Postman

1. **Import Collection**: Create a new collection
2. **Set Base URL**: `http://localhost:3000`
3. **Test Endpoints**:

   - **Register**: `POST /auth/register`
   - **Login**: `POST /auth/login` (save access token from response)
   - **Profile**: `GET /auth/profile` (add Bearer token in Authorization header)
   - **Refresh**: `POST /auth/refresh` (cookies are handled automatically)
   - **Logout**: `POST /auth/logout` (add Bearer token)

## Expected Responses

### Register Response
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "businessName": "Blossom Flowers",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Login Response
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "businessName": "Blossom Flowers",
    "role": "user"
  }
}
```

## Testing Protected Routes

### Test with Public Decorator

Try accessing a protected route without token:
```bash
curl -X GET http://localhost:3000/auth/profile
# Should return: 401 Unauthorized
```

### Test with Valid Token

1. Login first to get access token
2. Use the token in Authorization header:
```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Common Issues

### MongoDB Connection Error
```bash
# Check if MongoDB is running
docker ps | grep mongodb

# Check MongoDB logs
docker-compose -f db/docker-compose.dev.yml logs mongodb

# Restart MongoDB
docker-compose -f db/docker-compose.dev.yml restart
```

### Port Already in Use
```bash
# Change PORT in .env file or kill the process
lsof -ti:3000 | xargs kill -9
```

### JWT Secret Error
- Make sure `.env` file exists and has `JWT_SECRET` and `JWT_REFRESH_SECRET`
- Restart the server after creating/updating `.env`

## Quick Test Script

Create a test script `test-auth.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"

echo "1. Registering user..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "firstName": "John",
    "lastName": "Doe",
    "businessName": "Blossom Flowers"
  }')

echo $REGISTER_RESPONSE | jq '.'

TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.accessToken')

echo -e "\n2. Getting profile with token..."
curl -s -X GET $BASE_URL/auth/profile \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

Make it executable and run:
```bash
chmod +x test-auth.sh
./test-auth.sh
```

## Swagger Documentation

The easiest way to test is using Swagger UI:

1. Start the server: `npm run start:dev`
2. Open browser: **http://localhost:3000/api**
3. Click "Try it out" on any endpoint
4. Fill in the request body
5. Click "Execute"
6. See the response

## Next Steps

After testing authentication:
- Test protected routes in other modules (weeks, withdrawals)
- Test role-based access control
- Test refresh token flow
- Test logout functionality

