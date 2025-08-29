import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import url from 'url';
import { storage } from './storage.js';
import { ObjectStorageService, ObjectNotFoundError } from './objectStorage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

// In-memory storage
let certificates = [
  {
    id: 1,
    certificateNumber: 'GIE-2024-001234',
    gemstoneType: 'Natural Diamond',
    caratWeight: '1.25',
    color: 'D',
    clarity: 'VVS1',
    cut: 'Excellent',
    polish: 'Excellent',
    symmetry: 'Excellent',
    fluorescence: 'None',
    measurements: '6.85 x 6.91 x 4.24 mm',
    origin: 'Natural',
    issueDate: '2024-01-15',
    imageUrl: null
  },
  {
    id: 2,
    certificateNumber: 'GIE-2024-001235',
    gemstoneType: 'Ruby',
    caratWeight: '2.15',
    color: 'Pigeon Blood Red',
    clarity: 'VS1',
    cut: 'Oval',
    polish: 'Very Good',
    symmetry: 'Very Good',
    fluorescence: 'None',
    measurements: '8.12 x 6.45 x 4.21 mm',
    origin: 'Burma (Myanmar)',
    issueDate: '2024-01-20',
    imageUrl: null
  },
  {
    id: 3,
    certificateNumber: 'GIE-2024-001236',
    gemstoneType: 'Sapphire',
    caratWeight: '3.45',
    color: 'Royal Blue',
    clarity: 'VVS2',
    cut: 'Cushion',
    polish: 'Excellent',
    symmetry: 'Very Good',
    fluorescence: 'None',
    measurements: '9.15 x 8.92 x 5.78 mm',
    origin: 'Kashmir',
    issueDate: '2024-02-01',
    imageUrl: null
  }
];

let users = [{ id: 1, username: 'admin', password: 'admin123' }];
let sessions = {};

// Helper functions
function getContentType(filePath) {
  const ext = path.extname(filePath);
  const types = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
  };
  return types[ext] || 'text/plain';
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve({});
      }
    });
  });
}

function sendJSON(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

function serveFile(res, filePath) {
  try {
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': getContentType(filePath) });
    res.end(content);
  } catch (error) {
    res.writeHead(404);
    res.end('File not found');
  }
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // API Routes
  if (pathname.startsWith('/api/certificates/lookup/')) {
    const certNumber = decodeURIComponent(pathname.split('/').pop());
    
    try {
      // Try database first
      const certificate = await storage.getCertificate(certNumber);
      
      if (certificate) {
        sendJSON(res, certificate);
      } else {
        // Fallback to in-memory for sample data
        const fallbackCert = certificates.find(cert => 
          cert.certificateNumber.toLowerCase() === certNumber.toLowerCase()
        );
        
        if (fallbackCert) {
          sendJSON(res, fallbackCert);
        } else {
          sendJSON(res, { message: 'Certificate not found' }, 404);
        }
      }
    } catch (error) {
      console.error('Error fetching certificate:', error);
      sendJSON(res, { message: 'Error fetching certificate' }, 500);
    }
    return;
  }

  if (pathname === '/api/certificates') {
    if (method === 'GET') {
      sendJSON(res, certificates);
    } else if (method === 'POST') {
      const body = await parseBody(req);
      
      try {
        // Check if certificate number already exists in database
        const existingInDb = await storage.checkCertificateExists(body.certificateNumber);
        const existingInMemory = certificates.find(cert => 
          cert.certificateNumber.toLowerCase() === body.certificateNumber?.toLowerCase()
        );
        
        if (existingInDb || existingInMemory) {
          sendJSON(res, { 
            message: 'Certificate number already used. This certificate number is already in our system.' 
          }, 400);
          return;
        }

        // Create certificate in database
        const newCertificate = await storage.createCertificate({
          certificateNumber: body.certificateNumber,
          gemstoneType: body.gemstoneType,
          caratWeight: body.caratWeight,
          color: body.color,
          clarity: body.clarity,
          cut: body.cut,
          polish: body.polish,
          measurements: body.measurements,
          origin: body.origin,
          imageUrl: body.imageUrl || null
        });

        sendJSON(res, newCertificate, 201);
      } catch (error) {
        console.error('Error creating certificate:', error);
        sendJSON(res, { message: 'Error creating certificate' }, 500);
      }
    }
    return;
  }

  // Photo upload endpoints for object storage
  if (pathname === '/api/objects/upload' && method === 'POST') {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      sendJSON(res, { uploadURL });
    } catch (error) {
      console.error('Error getting upload URL:', error);
      sendJSON(res, { message: 'Error getting upload URL' }, 500);
    }
    return;
  }

  // Photo URL handling endpoint
  if (pathname === '/api/objects/set-url' && method === 'POST') {
    try {
      const body = await parseBody(req);
      const objectStorageService = new ObjectStorageService();
      const objectPath = objectStorageService.normalizeObjectEntityPath(body.uploadURL);
      sendJSON(res, { objectPath });
    } catch (error) {
      console.error('Error setting object URL:', error);
      sendJSON(res, { message: 'Error processing upload URL' }, 500);
    }
    return;
  }

  // Serve uploaded objects
  if (pathname.startsWith('/objects/')) {
    try {
      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(pathname);
      await objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      if (error instanceof ObjectNotFoundError) {
        res.writeHead(404);
        res.end('Object not found');
      } else {
        console.error('Error serving object:', error);
        res.writeHead(500);
        res.end('Error serving object');
      }
    }
    return;
  }

  if (pathname === '/api/auth/login' && method === 'POST') {
    const { username, password } = await parseBody(req);
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      const sessionId = Math.random().toString(36);
      sessions[sessionId] = user.id;
      sendJSON(res, { message: 'Login successful', sessionId, user: { id: user.id, username: user.username } });
    } else {
      sendJSON(res, { message: 'Invalid credentials' }, 401);
    }
    return;
  }

  // Special API endpoints for assets
  if (pathname === '/api/logo') {
    // Serve the GIE logo
    const logoPath = path.join(__dirname, '../attached_assets/logo gie_1753197610784.png');
    try {
      if (fs.existsSync(logoPath)) {
        const logoData = fs.readFileSync(logoPath);
        res.writeHead(200, { 'Content-Type': 'image/png' });
        res.end(logoData);
      } else {
        // Fallback SVG logo
        const svgLogo = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 120 40">
          <rect width="120" height="40" fill="#FF4500"/>
          <text x="60" y="25" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">GIE LAB</text>
        </svg>`;
        res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
        res.end(svgLogo);
      }
    } catch (error) {
      res.writeHead(500);
      res.end('Error loading logo');
    }
    return;
  }

  if (pathname === '/api/header') {
    // Serve the header gemstone background image
    const headerPath = path.join(__dirname, '../attached_assets/header_1753114606423_1755514033694.jpg');
    try {
      if (fs.existsSync(headerPath)) {
        const headerData = fs.readFileSync(headerPath);
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        res.end(headerData);
      } else {
        // Fallback to gemstone image
        const fallbackPath = path.join(__dirname, '../attached_assets/gemstone_1753197610794.jpg');
        if (fs.existsSync(fallbackPath)) {
          const fallbackData = fs.readFileSync(fallbackPath);
          res.writeHead(200, { 'Content-Type': 'image/jpeg' });
          res.end(fallbackData);
        } else {
          res.writeHead(404);
          res.end('Header image not found');
        }
      }
    } catch (error) {
      res.writeHead(500);
      res.end('Error loading header image');
    }
    return;
  }

  if (pathname === '/api/gemstone-image' || pathname === '/api/gemstone') {
    // Serve the gemstone collection image
    const gemPath = path.join(__dirname, '../attached_assets/gemstone_1753197610794.jpg');
    try {
      if (fs.existsSync(gemPath)) {
        const gemData = fs.readFileSync(gemPath);
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        res.end(gemData);
      } else {
        // Fallback placeholder
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Gemstone image not found');
      }
    } catch (error) {
      res.writeHead(500);
      res.end('Error loading gemstone image');
    }
    return;
  }

  if (pathname === '/api/gem-test') {
    // Serve the gem testing equipment image
    const gemTestPath = path.join(__dirname, '../attached_assets/gem test_1753197610794.jpg');
    try {
      if (fs.existsSync(gemTestPath)) {
        const gemTestData = fs.readFileSync(gemTestPath);
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        res.end(gemTestData);
      } else {
        // Fallback placeholder
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Gem test image not found');
      }
    } catch (error) {
      res.writeHead(500);
      res.end('Error loading gem test image');
    }
    return;
  }

  // Static file serving with client-side routing support
  if (pathname === '/' || pathname === '/upload-certificate' || pathname === '/about' || pathname === '/certification' || pathname === '/contact' || pathname === '/index.html') {
    serveFile(res, path.join(__dirname, '../public/index.html'));
    return;
  }

  if (pathname.startsWith('/js/')) {
    const filePath = path.join(__dirname, '../public', pathname);
    // Handle JSX files with proper content type
    if (pathname.endsWith('.jsx')) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(content);
      } catch (error) {
        res.writeHead(404);
        res.end('File not found');
      }
    } else {
      serveFile(res, filePath);
    }
    return;
  }

  if (pathname.startsWith('/css/')) {
    serveFile(res, path.join(__dirname, '../public', pathname));
    return;
  }

  // Serve static files (images, etc.) from public folder
  if (pathname.match(/\.(png|jpg|jpeg|gif|svg|ico)$/)) {
    const filePath = path.join(__dirname, '../public', pathname);
    try {
      if (fs.existsSync(filePath)) {
        serveFile(res, filePath);
      } else {
        res.writeHead(404);
        res.end('File not found');
      }
    } catch (error) {
      res.writeHead(500);
      res.end('Error serving file');
    }
    return;
  }

  // Default to index.html for SPA
  serveFile(res, path.join(__dirname, '../public/index.html'));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 GIE Certificate System running on http://0.0.0.0:${PORT}`);
  console.log(`📂 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💎 Sample certificates: GIE-2024-001234, GIE-2024-001235, GIE-2024-001236`);
});