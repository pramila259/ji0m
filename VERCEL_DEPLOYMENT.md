# GIE Certificate Management System - Vercel Deployment Guide

## Overview
This guide walks you through deploying the GIE Certificate Management System to Vercel with PostgreSQL database support.

## Prerequisites
1. Vercel account (free tier works)
2. PostgreSQL database (Vercel Postgres, Neon, or similar)
3. Git repository

## Deployment Steps

### 1. Prepare Database
Set up a PostgreSQL database with the following environment variables:
- `DATABASE_URL` - Your PostgreSQL connection string
- `SESSION_SECRET` - Random secret for sessions

### 2. Deploy to Vercel
1. Connect your repository to Vercel
2. In Vercel dashboard, go to Project Settings > Environment Variables
3. Add these environment variables (NOT as secrets):
   - `DATABASE_URL` = your PostgreSQL connection string
   - `SESSION_SECRET` = any random string (e.g., "my-secret-key-123")
4. Deploy the application

### 3. Initialize Database
After deployment, make a POST request to initialize the database:

**Method 1: Using curl**
```bash
curl -X POST https://your-site.vercel.app/api/setup/database
```

**Method 2: Using browser console**
Visit your site and open browser console, then run:
```javascript
fetch('/api/setup/database', { method: 'POST' }).then(r => r.json()).then(console.log)
```

This will create the necessary tables and sample data.

## Project Structure for Vercel

```
├── api/                          # Vercel serverless functions
│   ├── certificates/
│   │   ├── index.js             # GET/POST certificates
│   │   └── lookup/[number].js   # Certificate lookup
│   ├── auth/
│   │   └── login.js             # Authentication
│   └── setup/
│       └── database.js          # Database initialization
├── public/                       # Static files served by Vercel
│   ├── index.html              # Main HTML file
│   ├── js/app.jsx              # React application
│   ├── css/                    # Stylesheets
│   └── images/                 # Static images
├── vercel.json                 # Vercel configuration
└── setup-vercel-db.cjs        # Database setup script
```

## API Endpoints

- `GET /api/certificates` - Get all certificates
- `POST /api/certificates` - Create new certificate
- `GET /api/certificates/lookup/[number]` - Lookup certificate
- `POST /api/auth/login` - Admin login
- `POST /api/setup/database` - Initialize database

## Features

### ✅ Working on Vercel
- Certificate verification and search
- Certificate upload form
- Admin login system
- Responsive design matching gie-labs.com
- Database persistence with PostgreSQL
- Duplicate certificate prevention

### ❌ Not Available on Vercel
- Object storage for photos (uses base64 instead)
- Server-side image serving (replaced with static assets)

## Environment Variables Required

```
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your-random-secret-string
```

## Database Schema

The system creates two tables:

### certificates
- id (serial primary key)
- certificatenumber (unique)
- gemstonetype, caratweight, color, clarity, cut
- polish, symmetry, fluorescence, measurements
- origin, issuedate, imageurl
- createdat (timestamp)

### users
- id (serial primary key)
- username (unique)
- password
- createdat (timestamp)

## Sample Data
The setup creates sample certificates:
- GIE-2024-001234 (Natural Diamond)
- GIE-2024-001235 (Ruby)
- GIE-2024-001236 (Sapphire)

Default admin user: username=admin, password=admin123

## Differences from Replit Version
1. **Photo Upload**: Uses base64 encoding instead of cloud storage
2. **Image Serving**: Static assets instead of dynamic serving
3. **Database**: Uses Vercel Postgres instead of local PostgreSQL
4. **API Structure**: Serverless functions instead of Express server