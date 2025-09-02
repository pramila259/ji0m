import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';
import { fileURLToPath } from 'url';
import { sql } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;

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
  try {
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

    console.log(`${method} ${pathname}`); // Log all requests

  // API Routes
  if (pathname.startsWith('/api/certificates/lookup/')) {
    const certNumber = decodeURIComponent(pathname.split('/').pop());
    
    try {
      console.log('Looking up certificate:', certNumber);
      
      // Try database first using direct SQL
      const certificateResult = await sql`
        SELECT * FROM certificates 
        WHERE LOWER(certificatenumber) = LOWER(${certNumber})
        ORDER BY createdat DESC
        LIMIT 1
      `;
      
      if (certificateResult.length > 0) {
        // Transform database result to expected format
        const cert = certificateResult[0];
        const transformedCert = {
          id: cert.id,
          certificateNumber: cert.certificatenumber,
          gemstoneType: cert.gemstonetype,
          caratWeight: cert.caratweight,
          color: cert.color,
          clarity: cert.clarity,
          cut: cert.cut,
          polish: cert.polish,
          symmetry: cert.symmetry,
          fluorescence: cert.fluorescence,
          measurements: cert.measurements,
          origin: cert.origin,
          issueDate: cert.issuedate,
          imageUrl: cert.imageurl,
          createdAt: cert.createdat
        };
        sendJSON(res, transformedCert);
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
      console.log('Certificate upload request body:', body);
      
      try {
        // Validate required fields
        const requiredFields = ['certificateNumber', 'gemstoneType', 'caratWeight', 'color', 'clarity', 'cut', 'polish', 'symmetry', 'fluorescence', 'measurements', 'origin', 'issueDate'];
        const missingFields = requiredFields.filter(field => !body[field]);
        
        if (missingFields.length > 0) {
          console.error('Missing required fields:', missingFields);
          sendJSON(res, { 
            message: `Missing required fields: ${missingFields.join(', ')}` 
          }, 400);
          return;
        }
        
        // Initialize database table if it doesn't exist
        console.log('Ensuring certificates table exists...');
        console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
        console.log('DATABASE_URL length:', process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0);
        
        try {
          await sql`
            CREATE TABLE IF NOT EXISTS certificates (
              id SERIAL PRIMARY KEY,
              certificatenumber VARCHAR(100) UNIQUE NOT NULL,
              gemstonetype VARCHAR(100) NOT NULL,
              caratweight VARCHAR(50) NOT NULL,
              color VARCHAR(50) NOT NULL,
              clarity VARCHAR(50) NOT NULL,
              cut VARCHAR(100) NOT NULL,
              polish VARCHAR(50) NOT NULL,
              symmetry VARCHAR(50) NOT NULL,
              fluorescence VARCHAR(50) NOT NULL,
              measurements VARCHAR(100) NOT NULL,
              origin VARCHAR(100) NOT NULL,
              issuedate VARCHAR(50) NOT NULL,
              imageurl TEXT,
              createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
          `;
          console.log('Table creation completed successfully');
        } catch (tableError) {
          console.error('Table creation failed:', tableError);
          throw tableError;
        }

        // Check if certificate number already exists
        console.log('Checking for existing certificate:', body.certificateNumber);
        const existingCerts = await sql`
          SELECT certificatenumber FROM certificates 
          WHERE LOWER(certificatenumber) = LOWER(${body.certificateNumber})
        `;
        
        if (existingCerts.length > 0) {
          console.log('Certificate already exists');
          sendJSON(res, { 
            message: 'Certificate number already used. This certificate number is already in our system.' 
          }, 400);
          return;
        }

        console.log('Creating new certificate in database');
        // Insert new certificate using direct SQL
        const newCertificateResult = await sql`
          INSERT INTO certificates (
            certificatenumber, gemstonetype, caratweight, color, clarity,
            cut, polish, symmetry, fluorescence, measurements, origin,
            issuedate, imageurl
          ) VALUES (
            ${body.certificateNumber}, ${body.gemstoneType}, ${body.caratWeight},
            ${body.color}, ${body.clarity}, ${body.cut}, ${body.polish},
            ${body.symmetry}, ${body.fluorescence}, ${body.measurements},
            ${body.origin}, ${body.issueDate}, ${body.imageUrl || null}
          ) RETURNING *
        `;

        const newCertificate = newCertificateResult[0];
        console.log('Certificate created successfully:', newCertificate.certificatenumber);
        sendJSON(res, newCertificate, 201);
      } catch (error) {
        console.error('Error creating certificate:', error);
        console.error('Error stack:', error.stack);
        sendJSON(res, { message: `Error creating certificate: ${error.message}` }, 500);
      }
    }
    return;
  }

  // Simplified photo upload - store as base64 in database
  if (pathname === '/api/upload-photo' && method === 'POST') {
    try {
      const body = await parseBody(req);
      // For now, just return the base64 data as is
      sendJSON(res, { imageUrl: body.imageData });
    } catch (error) {
      console.error('Error processing photo upload:', error);
      sendJSON(res, { message: 'Error processing photo' }, 500);
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
  } catch (error) {
    console.error('Unhandled server error:', error);
    console.error('Stack trace:', error.stack);
    console.error('Request URL:', req.url);
    console.error('Request method:', req.method);
    try {
      if (!res.headersSent) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(500);
        res.end(JSON.stringify({ 
          message: 'Internal server error', 
          error: error.message,
          url: req.url,
          method: req.method
        }));
      }
    } catch (writeError) {
      console.error('Error writing error response:', writeError);
      if (!res.headersSent) {
        res.writeHead(500);
        res.end('Server error');
      }
    }
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 GIE Certificate System running on http://0.0.0.0:${PORT}`);
  console.log(`📂 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💎 Sample certificates: GIE-2024-001234, GIE-2024-001235, GIE-2024-001236`);
});
