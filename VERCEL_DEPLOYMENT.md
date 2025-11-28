# Vercel Deployment Guide

This guide explains how to deploy both the NestJS API and Angular client applications to Vercel from this monorepo.

## Overview

You need **two separate Vercel projects** - one for the API and one for the Angular client. Both can be deployed from the same GitHub repository using Vercel's monorepo support.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your code pushed to a GitHub repository
3. MongoDB database (you can use MongoDB Atlas for production)

## Deployment Steps

### Step 1: Deploy the NestJS API

1. **Create a new Vercel project:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Name it something like `flower-api` or `flower-business-api`

2. **Configure the project:**
   - **Framework Preset:** Other or NestJS (Vercel will auto-detect)
   - **Root Directory:** `apps/flower-api` ✅ (correct)
   - **Build Command:** Leave EMPTY (IMPORTANT: Clear this field - Vercel will compile `api/index.ts` automatically)
   - **Output Directory:** Leave EMPTY (IMPORTANT: Clear this field - serverless functions don't use output directory)
   - **Install Command:** `npm install` ✅ (correct)
   
   **⚠️ Critical Settings:**
   - **Build Command MUST be empty** - Vercel's `@vercel/node` builder will compile `api/index.ts` automatically
   - **Output Directory MUST be empty** - Serverless functions don't need an output directory
   - The `vercel.json` file configures the serverless function routing

3. **Set Environment Variables:**
   Go to Project Settings → Environment Variables and add:
   ```
   MONGODB_URL=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret-key
   JWT_REFRESH_SECRET=your-refresh-token-secret
   ALLOWED_ORIGINS=https://your-angular-app.vercel.app,https://your-custom-domain.com
   NODE_ENV=production
   ENABLE_SWAGGER=false
   ```
   
   **Important:** Replace `your-angular-app.vercel.app` with your actual Angular app URL after you deploy it.

4. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete
   - Note your API URL (e.g., `https://flower-api.vercel.app`)

### Step 2: Deploy the Angular Client

1. **Create a new Vercel project:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import the same GitHub repository
   - Name it something like `flower-client` or `flower-business-client`

2. **Configure the project:**
   - **Framework Preset:** Other
   - **Root Directory:** `apps/flower-client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist/flower-client/browser`
   - **Install Command:** `npm install`

3. **Set Environment Variables:**
   Go to Project Settings → Environment Variables and add:
   ```
   API_URL=https://your-api-domain.vercel.app
   ```
   
   Replace `your-api-domain.vercel.app` with the actual API URL from Step 1.

4. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete
   - Note your client URL (e.g., `https://flower-client.vercel.app`)

### Step 3: Update CORS Configuration

After deploying the Angular app, update the API's `ALLOWED_ORIGINS` environment variable to include your Angular app URL:

1. Go to your API project on Vercel
2. Navigate to Settings → Environment Variables
3. Update `ALLOWED_ORIGINS` to include your Angular app URL:
   ```
   ALLOWED_ORIGINS=https://flower-client.vercel.app,https://your-custom-domain.com
   ```
4. Redeploy the API (or wait for automatic redeploy if you have it enabled)

## Automated Deployments

Vercel automatically deploys when you push to your GitHub repository. To set up automated deployments:

1. **Connect your GitHub repository** (done during project creation)
2. **Configure branch deployments:**
   - Production: Deploy from `main` or `master` branch
   - Preview: Deploy from all other branches (automatic)

3. **For monorepo deployments:**
   - Vercel will automatically detect changes in the root directory you specified
   - Only the affected project will be rebuilt when files in its directory change

## Project Structure

```
flower-business/
├── apps/
│   ├── flower-api/          # NestJS API
│   │   ├── vercel.json       # Vercel config for API
│   │   └── api/
│   │       └── index.ts      # Serverless entry point
│   └── flower-client/        # Angular Client
│       ├── vercel.json       # Vercel config for client
│       └── src/
│           └── environments/
│               └── environment.prod.ts  # Production environment
```

## Environment Variables Reference

### API Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URL` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret for JWT access tokens | `your-secret-key-here` |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | `your-refresh-secret-here` |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed origins | `https://app.vercel.app,https://example.com` |
| `NODE_ENV` | Environment mode | `production` |
| `ENABLE_SWAGGER` | Enable Swagger UI | `false` (recommended for production) |

### Client Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `API_URL` | Backend API URL | `https://flower-api.vercel.app` |

**Note:** The API URL will be visible in the client-side JavaScript bundle. This is normal and expected for frontend applications - the browser needs to know where to make API requests. Security is handled on the API side through:
- JWT authentication (tokens are required for protected routes)
- CORS configuration (only allowed origins can make requests)
- API secrets (JWT_SECRET, etc.) are stored server-side only, never in the client
- Role-based access control (guards protect sensitive endpoints)

## Custom Domains

To add custom domains:

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Troubleshooting

### API Issues

- **Build fails with "nest: command not found":**
  - This happens when Vercel tries to run `npm run build`
  - **Solution:** Make sure the Build Command in Vercel project settings is **empty** or leave it blank
  - The `vercel-build` script in package.json will be used instead, which skips the build
  - Vercel will compile TypeScript directly from `api/index.ts`

- **Build fails:** Check that all dependencies are in `package.json`
- **Runtime errors:** Check environment variables are set correctly
- **CORS errors:** Verify `ALLOWED_ORIGINS` includes your client URL
- **npm audit vulnerabilities:** These are warnings and won't block deployment. You can address them later with `npm audit fix`

### Client Issues

- **Build fails:** Ensure Angular build command works locally
- **API calls fail:** Verify `API_URL` environment variable is correct
- **Routing issues:** The `vercel.json` includes rewrites for Angular routing

### Monorepo Issues

- **Wrong project deploying:** Verify the Root Directory setting in Vercel
- **Dependencies not found:** Ensure `package.json` files are in the correct locations

## Important Notes

- **Separate Projects Required:** You need two separate Vercel projects - one for the API and one for the Angular client
- **Monorepo Support:** Both projects can be deployed from the same GitHub repository
- **Root Directory:** Make sure to set the correct Root Directory for each project in Vercel settings
- **Environment Variables:** Each project has its own environment variables - set them separately
- **Build Process:** 
  - API: Vercel will automatically compile TypeScript in the `api/` directory
  - Client: Angular build runs during deployment
- **Local Testing:** You can use Vercel's CLI for local testing: `vercel dev`

## Alternative: Single Project with Subdirectories

If you prefer a single Vercel project, you can:
1. Deploy the Angular app as the main project
2. Use Vercel's rewrites to proxy API requests to a separate API deployment
3. However, this is more complex and not recommended for production

## Next Steps

1. Set up MongoDB Atlas (or your preferred MongoDB hosting)
2. Configure environment variables in both Vercel projects
3. Deploy the API first, then the client
4. Update the API's `ALLOWED_ORIGINS` with the client URL
5. Test the integration
6. Set up custom domains (optional)
7. Configure monitoring and alerts
8. Set up CI/CD if needed (Vercel handles this automatically with GitHub integration)

