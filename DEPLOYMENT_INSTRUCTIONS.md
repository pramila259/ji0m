# GIE Labs - Deployment Instructions

## Quick Deploy to Vercel

### Step 1: Repository Setup
1. Create a new repository on GitHub: `https://github.com/pramila259/GIE-labs`
2. Clone or upload all these files to your repository
3. Make sure these key files are included:
   - `api/` folder (serverless functions)
   - `public/` folder (frontend files)
   - `vercel.json` (configuration)
   - `setup-vercel-db.cjs` (database setup)

### Step 2: Database Setup
1. Create a PostgreSQL database (recommended: Vercel Postgres or Neon)
2. Get your `DATABASE_URL` connection string
3. Generate a random `SESSION_SECRET` (e.g., use: `openssl rand -base64 32`)

### Step 3: Vercel Deployment
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project" and import your GitHub repository
3. In "Environment Variables" section, add:
   ```
   DATABASE_URL=postgresql://username:password@host:port/database
   SESSION_SECRET=your_random_secret_here
   ```
4. Click "Deploy"

### Step 4: Initialize Database
1. After deployment, visit: `https://your-site.vercel.app/api/setup/database`
2. This will create the database tables and sample certificates
3. You should see: "Database setup completed successfully"

### Step 5: Test Your Site
1. Visit your main site: `https://your-site.vercel.app`
2. Test certificate search with: `GIE-2024-001234`
3. Access admin panel: `https://your-site.vercel.app/upload-certificate`
4. Login with: username=`admin`, password=`admin123`

## Features Available
- ✅ Certificate verification and search
- ✅ Admin certificate upload
- ✅ All pages (Home, About, Certification, Contact)
- ✅ PostgreSQL database persistence
- ✅ Duplicate certificate prevention
- ✅ Responsive design matching gie-labs.com
- ✅ Photo upload (base64 encoding)

## File Structure
```
├── api/                    # Vercel serverless functions
│   ├── certificates/
│   ├── auth/
│   └── setup/
├── public/                 # Frontend files
│   ├── index.html
│   ├── js/app.jsx
│   ├── css/
│   └── images/
├── vercel.json            # Vercel configuration
├── README.md              # Project documentation
└── VERCEL_DEPLOYMENT.md   # Detailed deployment guide
```

## Support
- Sample certificates: GIE-2024-001234, GIE-2024-001235, GIE-2024-001236
- Default admin: username=admin, password=admin123
- For detailed instructions, see: `VERCEL_DEPLOYMENT.md`

Your GIE Certificate Management System is ready for production deployment! 🚀