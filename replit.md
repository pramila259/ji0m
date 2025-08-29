# GIE Certificate Management System

## Overview

Pure JavaScript gemstone certificate verification system for the Gemological Institute of Europe (GIE). Built with vanilla JavaScript and Node.js HTTP server for maximum simplicity and reliability.

## User Preferences

- Simple, everyday language
- Pure JavaScript implementation (no TypeScript or complex frameworks)
- Clean, professional GIE branding with navy blue and gold colors

## Recent Changes (August 2025)

✓ **EXACT DUPLICATE OF GIE-LABS.COM WEBSITE**
✓ Replicated gie-labs.com/certificate.php design exactly
✓ Orange/red GIE LAB branding with dark hero section
✓ "Safe & Faster" + "Validate Your Report" hero text
✓ Certificate search with "Track Report" button
✓ Gemstone collection image and "Trusted & Genuine" section
✓ Contact info, quick links, and newsletter sections
✓ URL routing: /upload-certificate shows upload form (no admin panel)
✓ React 18 with createRoot (fixed React warnings)
✓ Serves actual logo and gemstone images from attached_assets
✓ Professional footer matching original design
✓ **MODERN DESIGN UPDATE**: Added animated gradients, glass effects, larger logo (60px)
✓ **DATABASE INTEGRATION**: PostgreSQL with duplicate certificate prevention
✓ **PHOTO UPLOAD**: Object storage integration for gemstone photos
✓ **DUPLICATE PREVENTION**: Shows "already used" message for duplicate certificate numbers
✓ **DEPLOYMENT READY**: Added build script to package.json for successful deployment
✓ **NEW PAGES ADDED**: About and Certification pages with exact content from gie-labs.com
✓ **CONTACT PAGE**: Added with large bold address text, Google Maps embed, and contact details
✓ **EXACT VISUAL MATCH**: Redesigned all pages to match original gie-labs.com design exactly
✓ **HEADER REDESIGN**: Dark top header with contact info, larger logo with "GIE LAB" text, orange navigation bar
✓ **PAGE HEROES**: All pages now have gemstone background heroes with large white titles and breadcrumbs
✓ **BLACK & ORANGE THEME**: Proper color scheme matching original website throughout
✓ **SEARCH FIX**: Improved certificate search with case-insensitive matching and URL decoding
✓ **VERCEL DEPLOYMENT**: Converted to Vercel serverless functions with PostgreSQL database
✓ **API ENDPOINTS**: Created Vercel-compatible API routes for certificates and authentication
✓ **DATABASE SETUP**: Automated database initialization script for production deployment
✓ **PHOTO HANDLING**: Adapted photo upload to use base64 encoding (no cloud storage needed)
✓ **NEON POSTGRESQL INTEGRATION**: Successfully integrated @neondatabase/serverless with Drizzle ORM
✓ **SERVERLESS DATABASE**: All API endpoints now use Neon PostgreSQL for cloud database operations
✓ **DATABASE TESTING**: Verified certificate lookup, creation, and duplicate prevention work correctly

## System Architecture

### Frontend (`public/`)
- **Single HTML file** with embedded styling and JavaScript
- **Tailwind CSS** via CDN for styling
- **React with JSX** for component-based architecture
- **Single Page Application** with client-side routing

### Backend (Dual Architecture)
**Replit Version (`server/`):**
- **Node.js HTTP server** (no Express framework)
- **Object storage** for gemstone photos with cloud persistence

**Vercel Version (`api/`):**
- **Serverless functions** for API endpoints
- **Base64 photo encoding** (no cloud storage required)
- **PostgreSQL database** compatible with Vercel Postgres

### Database (`PostgreSQL`)
- **Permanent certificate storage** ensuring data persists for years
- **Duplicate prevention** with unique certificate number constraints
- **Automatic timestamps** for issue dates and creation tracking
- **Flexible column naming** (camelCase in API, lowercase in database)

### Key Features
- **Certificate verification** by number with database lookup
- **Photo upload** for gemstone images with cloud storage
- **Duplicate prevention** showing "already used" messages
- **Permanent storage** ensuring certificates persist for years
- **Certificate upload** with comprehensive form validation
- **Responsive design** with authentic GIE branding
- **Database persistence** with PostgreSQL backend

## API Endpoints

**Replit Version:**
- `GET /api/certificates/lookup/:number` - Look up certificate by number
- `GET /api/certificates` - Get all certificates (admin)
- `POST /api/certificates` - Create new certificate
- `POST /api/auth/login` - Admin login

**Vercel Version:**
- `GET /api/certificates/lookup/[number]` - Look up certificate by number
- `GET /api/certificates` - Get all certificates (admin)
- `POST /api/certificates` - Create new certificate
- `POST /api/auth/login` - Admin login
- `POST /api/setup/database` - Initialize database tables and sample data

## Data Structure

### Certificate
- certificateNumber (string)
- gemstoneType (string)
- caratWeight (string)
- color (string)
- clarity (string)
- cut (string)
- polish (string)
- symmetry (string)
- fluorescence (string)
- measurements (string)
- origin (string)
- issueDate (string)
- imageUrl (string, optional)

### User
- id (number)
- username (string)
- password (string)

## Deployment

### Replit Deployment
The application runs on a single Node.js HTTP server serving both API and static files. No build process required - just install dependencies and run.

```bash
npm install
npm run dev
```

Port: 5000 (configurable via PORT environment variable)

### Vercel Deployment
1. **Repository Setup**: Push code to Git repository
2. **Database**: Set up PostgreSQL database (Vercel Postgres, Neon, etc.)
3. **Environment Variables**: 
   - `DATABASE_URL` - PostgreSQL connection string
   - `SESSION_SECRET` - Random secret for sessions
4. **Deploy**: Connect repository to Vercel and deploy
5. **Initialize**: Visit `/api/setup/database` to create tables and sample data

### Deployment Files
- `vercel.json` - Vercel configuration for serverless functions
- `api/` - Serverless function endpoints
- `VERCEL_DEPLOYMENT.md` - Detailed deployment instructions
- `setup-vercel-db.cjs` - Database initialization script