# Environment Variables Setup Guide

## Quick Setup

1. Copy the example file to create your local `.env`:
   ```bash
   cd apps/flower-api
   cp .env.example .env
   ```

2. Generate secure JWT secrets for production:
   ```bash
   # Generate JWT_SECRET
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   
   # Generate JWT_REFRESH_SECRET
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. Update the `.env` file with your generated secrets.

## Environment Variables

### Application Configuration
- `NODE_ENV` - Environment mode (`development` or `production`)
- `PORT` - Server port (default: `3000`)

### MongoDB Configuration
- `MONGODB_URL` - MongoDB connection string
  - Local: `mongodb://localhost:28018/flower-business`
  - Docker: `mongodb://mongodb:27017/flower-business`

### JWT Configuration
- `JWT_SECRET` - Secret key for signing access tokens
- `JWT_EXPIRES_IN` - Access token expiration (default: `15m`)
- `JWT_REFRESH_SECRET` - Secret key for signing refresh tokens
- `JWT_REFRESH_EXPIRES_IN` - Refresh token expiration (default: `7d`)

## Docker Configuration

### Using Docker Compose

A `docker-compose.yml` file is provided in `apps/flower-api/` that:
- Automatically loads `.env` file using `env_file`
- Sets `MONGODB_URL` to use the MongoDB container (`mongodb://mongodb:27017/flower-business`)
- Exposes the API on the port specified in `.env` (default: 3000)

**To run with Docker:**
```bash
cd apps/flower-api
docker-compose up -d
```

**Note**: When running in Docker, the `MONGODB_URL` is automatically set to use the MongoDB container. For local development, use `mongodb://localhost:28018/flower-business`.

### Environment Variables in Docker

The Docker setup uses the `.env` file automatically. The `docker-compose.yml` includes:
```yaml
env_file:
  - .env
environment:
  - MONGODB_URL=mongodb://mongodb:27017/flower-business
```

This means:
- All variables from `.env` are loaded
- `MONGODB_URL` is overridden to use the Docker MongoDB container

## Security Notes

⚠️ **IMPORTANT**: 
- Never commit `.env` files to version control
- Use strong, randomly generated secrets in production
- Use different secrets for development and production
- Keep secrets secure and rotate them periodically

## Quick Setup Script

A setup script is provided to automatically create `.env` with secure secrets:

```bash
cd apps/flower-api
./setup-env.sh
```

This will:
1. Copy `.env.example` to `.env`
2. Generate secure random secrets for JWT tokens
3. Update the `.env` file with the generated secrets

## Local Development

For local development, the `.env` file should be in:
```
apps/flower-api/.env
```

The NestJS `ConfigModule` will automatically load this file when the application starts.

## Manual Setup

If you prefer to set up manually:

1. Copy the example file:
   ```bash
   cd apps/flower-api
   cp .env.example .env
   ```

2. Generate secure secrets:
   ```bash
   # Generate JWT_SECRET
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   
   # Generate JWT_REFRESH_SECRET  
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. Update `.env` with your generated secrets

