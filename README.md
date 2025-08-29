# GIE Certificate Management System

A comprehensive gemstone certificate verification system that replicates the exact design and functionality of gie-labs.com.

## 🌟 Features

- **Certificate Verification**: Search and verify gemstone certificates by number
- **Professional Design**: Exact visual match to original gie-labs.com website
- **Admin Panel**: Upload new certificates with comprehensive details
- **Database Storage**: Persistent PostgreSQL database storage
- **Duplicate Prevention**: Prevents duplicate certificate numbers
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Deployment Options

### Option 1: Vercel (Recommended for Production)
- Serverless functions for API endpoints
- PostgreSQL database support
- Global CDN for fast loading
- See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for detailed instructions

### Option 2: Replit (Development/Testing)
- Simple one-click deployment
- Built-in database and object storage
- Perfect for development and testing

## 🛠 Technology Stack

- **Frontend**: Pure JavaScript with React (via Babel transpilation)
- **Backend**: Node.js with PostgreSQL
- **Database**: PostgreSQL with automatic schema creation
- **Styling**: Custom CSS matching gie-labs.com design
- **Icons**: Font Awesome

## 📁 Project Structure

```
├── api/                    # Vercel API routes (serverless functions)
├── public/                 # Static files (HTML, CSS, JS, images)
├── server/                 # Replit server files
├── shared/                 # Shared schemas and types
├── attached_assets/        # User uploaded assets
└── vercel.json            # Vercel configuration
```

## 🔧 Environment Variables

```
DATABASE_URL=postgresql://...     # PostgreSQL connection string
SESSION_SECRET=random_secret      # Session encryption key
```

## 📊 Database Schema

### Certificates Table
- Certificate number (unique identifier)
- Gemstone details (type, weight, color, clarity, cut)
- Quality metrics (polish, symmetry, fluorescence)
- Physical measurements and origin
- Issue date and optional photo

### Users Table
- Admin user credentials for certificate management

## 🎨 Design Features

- **Exact Visual Match**: Replicates gie-labs.com design pixel-perfect
- **Orange/Black Theme**: Professional GIE LAB branding
- **Gemstone Backgrounds**: Beautiful background images on all pages
- **Responsive Layout**: Mobile-friendly design
- **Professional Typography**: Clean, readable fonts

## 🔍 Certificate Search

- Case-insensitive search
- URL-encoded character support
- Real-time verification
- Professional certificate display

## 🛡 Security Features

- Admin authentication system
- Duplicate certificate prevention
- Input validation and sanitization
- Secure database connections

## 📱 Pages

1. **Home**: Certificate search and verification
2. **About**: Company information and history
3. **Certification**: Importance of certification details
4. **Contact**: Contact information with map
5. **Upload**: Admin certificate upload form

## 🚦 Getting Started

1. Clone the repository
2. Set up environment variables
3. Initialize the database
4. Deploy to your preferred platform

For detailed deployment instructions, see the deployment guides for your chosen platform.

## 📞 Support

For questions about the GIE Certificate Management System, please refer to the documentation or contact the development team.