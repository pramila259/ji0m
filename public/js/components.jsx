// GIE Certificate Management System - React JSX Components

const { useState, useEffect, useCallback } = React;

// Navigation Component
const Navigation = ({ currentPage, onPageChange, currentUser }) => (
    <nav className="gie-bg-blue text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center py-4">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <i className="fas fa-balance-scale text-xl gie-blue"></i>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">Gemological Institute of Europe</h1>
                        <p className="text-sm opacity-90">Certificate Verification System</p>
                    </div>
                </div>
                <div className="flex space-x-4">
                    <button 
                        onClick={() => onPageChange('home')}
                        className={`px-4 py-2 rounded transition-colors ${currentPage === 'home' ? 'bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        <i className="fas fa-home mr-2"></i>Home
                    </button>
                    <button 
                        onClick={() => onPageChange('upload')}
                        className={`px-4 py-2 rounded transition-colors ${currentPage === 'upload' ? 'bg-green-800' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        <i className="fas fa-upload mr-2"></i>Upload
                    </button>
                    <button 
                        onClick={() => onPageChange('admin')}
                        className={`px-4 py-2 rounded transition-colors ${currentPage === 'admin' ? 'gie-bg-gold' : 'gie-bg-gold hover:bg-yellow-600'}`}
                    >
                        <i className="fas fa-user-shield mr-2"></i>Admin
                        {currentUser && <span className="ml-1">({currentUser.username})</span>}
                    </button>
                </div>
            </div>
        </div>
    </nav>
);

// Certificate Display Component
const CertificateDisplay = ({ certificate, onClose }) => {
    if (!certificate) return null;

    const fields = [
        { label: 'CERTIFICATE NO:', value: certificate.certificateNumber },
        { label: 'NAME:', value: certificate.gemstoneType },
        { label: 'WEIGHT:', value: `${certificate.caratWeight} CT` },
        { label: 'SHAPE:', value: certificate.cut },
        { label: 'DIMENSION:', value: `${certificate.measurements} MM` },
        { label: 'CLARITY:', value: certificate.clarity },
        { label: 'COLOR:', value: certificate.color },
        { label: 'CUT:', value: certificate.polish || certificate.symmetry || 'Excellent' },
        { label: 'ORIGIN:', value: certificate.origin }
    ];

    return (
        <div className="certificate-container">
            <div className="p-6 border-b-2 border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold gie-blue">Certificate Details</h3>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center text-green-600 font-semibold">
                            <i className="fas fa-shield-check mr-2 text-xl"></i>
                            <span>VERIFIED</span>
                        </div>
                        {onClose && (
                            <button 
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 text-xl"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="divide-y divide-gray-200">
                {fields.map((field, index) => (
                    <div key={index} className="certificate-field">
                        <div className="field-label">{field.label}</div>
                        <div className="field-value">{field.value}</div>
                    </div>
                ))}
                
                {certificate.imageUrl && (
                    <div className="certificate-field">
                        <div className="field-label">GEM IMAGE:</div>
                        <div className="field-value">
                            <img 
                                src={certificate.imageUrl} 
                                alt="Gemstone Image" 
                                className="certificate-image rounded border"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Home Page Component
const HomePage = ({ onCertificateFound }) => {
    const [searchValue, setSearchValue] = useState('');
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!searchValue.trim()) {
            setError('Please enter a certificate number');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            const response = await fetch(`/api/certificates/lookup/${encodeURIComponent(searchValue.trim())}`);
            const data = await response.json();

            if (response.ok) {
                setCertificate(data);
                onCertificateFound(data);
                setError('');
            } else {
                setError(data.message || 'Certificate not found');
                setCertificate(null);
            }
        } catch (err) {
            setError('Error searching certificate');
            setCertificate(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSampleClick = (certNumber) => {
        setSearchValue(certNumber);
        setTimeout(handleSearch, 100);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold gie-blue mb-4">Certificate Verification</h2>
                <p className="text-gray-600 text-lg">Enter your certificate number to verify authenticity and view details</p>
            </div>

            {/* Search Section */}
            <div className="bg-white p-8 rounded-lg shadow-lg mb-8 max-w-2xl mx-auto">
                <div className="flex space-x-4">
                    <input 
                        type="text" 
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter certificate number (e.g., GIE-2024-001234)" 
                        className="flex-1 p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                        disabled={loading}
                    />
                    <button 
                        onClick={handleSearch}
                        disabled={loading}
                        className="px-8 py-4 gie-bg-blue text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin mr-2"></i>Verifying...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-search mr-2"></i>Verify Certificate
                            </>
                        )}
                    </button>
                </div>
                
                {error && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        <i className="fas fa-exclamation-circle mr-2"></i>{error}
                    </div>
                )}
                
                {/* Sample Certificates */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-sm font-semibold gie-blue mb-3">Try Sample Certificates:</h3>
                    <div className="flex flex-wrap gap-2">
                        <button 
                            onClick={() => handleSampleClick('GIE-2024-001234')}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                        >
                            GIE-2024-001234 (Diamond)
                        </button>
                        <button 
                            onClick={() => handleSampleClick('GIE-2024-001235')}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                        >
                            GIE-2024-001235 (Ruby)
                        </button>
                        <button 
                            onClick={() => handleSampleClick('GIE-2024-001236')}
                            className="bg-blue-800 text-white px-3 py-1 rounded text-sm hover:bg-blue-900 transition-colors"
                        >
                            GIE-2024-001236 (Sapphire)
                        </button>
                    </div>
                </div>
            </div>

            {/* Certificate Display */}
            {certificate && (
                <CertificateDisplay 
                    certificate={certificate} 
                    onClose={() => setCertificate(null)}
                />
            )}
        </div>
    );
};

// Upload Page Component
const UploadPage = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        certificateNumber: '',
        gemstoneType: '',
        caratWeight: '',
        cut: '',
        measurements: '',
        clarity: '',
        color: '',
        polish: '',
        origin: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        const requiredFields = ['certificateNumber', 'gemstoneType', 'caratWeight'];
        for (const field of requiredFields) {
            if (!formData[field].trim()) {
                setMessage({ text: `${field} is required`, type: 'error' });
                return;
            }
        }

        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const response = await fetch('/api/certificates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                setMessage({ text: 'Certificate uploaded successfully!', type: 'success' });
                setFormData({
                    certificateNumber: '',
                    gemstoneType: '',
                    caratWeight: '',
                    cut: '',
                    measurements: '',
                    clarity: '',
                    color: '',
                    polish: '',
                    origin: ''
                });
                
                if (onSuccess) {
                    setTimeout(() => onSuccess(result), 1500);
                }
            } else {
                setMessage({ text: result.message || 'Error uploading certificate', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Error uploading certificate', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold gie-blue mb-6 text-center">
                    <i className="fas fa-upload mr-3"></i>Upload New Certificate
                </h2>
                
                {message.text && (
                    <div className={`mb-6 p-4 rounded-lg ${message.type === 'error' ? 'bg-red-100 border border-red-400 text-red-700' : 'bg-green-100 border border-green-400 text-green-700'}`}>
                        <i className={`fas ${message.type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'} mr-2`}></i>
                        {message.text}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">Certificate No:</label>
                            <input 
                                type="text" 
                                name="certificateNumber" 
                                value={formData.certificateNumber}
                                onChange={handleChange}
                                required 
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                placeholder="e.g., GIE-2024-001237"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">Name:</label>
                            <input 
                                type="text" 
                                name="gemstoneType" 
                                value={formData.gemstoneType}
                                onChange={handleChange}
                                required 
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                placeholder="e.g., Natural Diamond"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">Weight:</label>
                            <input 
                                type="text" 
                                name="caratWeight" 
                                value={formData.caratWeight}
                                onChange={handleChange}
                                required 
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                placeholder="e.g., 1.25"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">Shape:</label>
                            <input 
                                type="text" 
                                name="cut" 
                                value={formData.cut}
                                onChange={handleChange}
                                required 
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                placeholder="e.g., Round"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">Dimension:</label>
                            <input 
                                type="text" 
                                name="measurements" 
                                value={formData.measurements}
                                onChange={handleChange}
                                required 
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                placeholder="e.g., 6.85 x 6.91 x 4.24"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">Clarity:</label>
                            <input 
                                type="text" 
                                name="clarity" 
                                value={formData.clarity}
                                onChange={handleChange}
                                required 
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                placeholder="e.g., VVS1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">Color:</label>
                            <input 
                                type="text" 
                                name="color" 
                                value={formData.color}
                                onChange={handleChange}
                                required 
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                placeholder="e.g., D"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">Cut:</label>
                            <input 
                                type="text" 
                                name="polish" 
                                value={formData.polish}
                                onChange={handleChange}
                                required 
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                placeholder="e.g., Excellent"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">Origin:</label>
                            <input 
                                type="text" 
                                name="origin" 
                                value={formData.origin}
                                onChange={handleChange}
                                required 
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                placeholder="e.g., Natural"
                            />
                        </div>
                    </div>
                    
                    <div className="text-center">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-12 py-4 gie-bg-blue text-white rounded-lg hover:bg-blue-700 font-semibold text-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-3"></i>Uploading...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save mr-3"></i>Upload Certificate
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Admin Page Component
const AdminPage = ({ currentUser, onLogin, onLogout }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        if (currentUser) {
            loadCertificates();
        }
    }, [currentUser]);

    const loadCertificates = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/certificates');
            if (response.ok) {
                const data = await response.json();
                setCertificates(data);
            }
        } catch (error) {
            setMessage({ text: 'Error loading certificates', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!credentials.username || !credentials.password) {
            setMessage({ text: 'Please enter both username and password', type: 'error' });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (response.ok) {
                onLogin(data.user);
                setCredentials({ username: '', password: '' });
                setMessage({ text: '', type: '' });
            } else {
                setMessage({ text: data.message || 'Login failed', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Login error - please try again', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            onLogout();
        } catch (error) {
            setMessage({ text: 'Logout error', type: 'error' });
        }
    };

    const getColorCode = (color) => {
        const colorMap = {
            'D': '#f8f9fa', 'E': '#f1f3f5', 'F': '#e9ecef', 'G': '#dee2e6',
            'H': '#ced4da', 'I': '#adb5bd', 'J': '#6c757d',
            'White': '#ffffff', 'Yellow': '#ffd43b', 'Blue': '#339af0',
            'Red': '#ff6b6b', 'Green': '#51cf66', 'Pink': '#f783ac',
            'Pigeon Blood Red': '#c92a2a', 'Royal Blue': '#1c7ed6'
        };
        return colorMap[color] || '#6c757d';
    };

    if (!currentUser) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold gie-blue mb-6 text-center">
                        <i className="fas fa-user-shield mr-3"></i>Admin Access
                    </h2>
                    
                    {message.text && (
                        <div className={`mb-4 p-3 rounded ${message.type === 'error' ? 'bg-red-100 border border-red-400 text-red-700' : 'bg-green-100 border border-green-400 text-green-700'}`}>
                            <i className={`fas ${message.type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'} mr-2`}></i>
                            {message.text}
                        </div>
                    )}
                    
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                            <input 
                                type="text" 
                                value={credentials.username}
                                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                                required 
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <input 
                                type="password" 
                                value={credentials.password}
                                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                                required 
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-3 gie-bg-blue text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-2"></i>Logging in...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-sign-in-alt mr-2"></i>Login
                                </>
                            )}
                        </button>
                    </form>
                    <p className="mt-4 text-sm text-gray-600 text-center">Default: admin / admin123</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold gie-blue">Certificate Management Dashboard</h2>
                <button 
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                    <i className="fas fa-sign-out-alt mr-2"></i>Logout
                </button>
            </div>
            
            {message.text && (
                <div className={`mb-6 p-4 rounded-lg ${message.type === 'error' ? 'bg-red-100 border border-red-400 text-red-700' : 'bg-green-100 border border-green-400 text-green-700'}`}>
                    <i className={`fas ${message.type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'} mr-2`}></i>
                    {message.text}
                </div>
            )}
            
            <div className="bg-white rounded-lg shadow-lg p-6">
                {loading ? (
                    <div className="text-center py-8">
                        <i className="fas fa-spinner fa-spin text-3xl gie-blue mb-4"></i>
                        <p>Loading certificates...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="gie-bg-blue text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left font-semibold">Certificate No.</th>
                                    <th className="px-6 py-3 text-left font-semibold">Gemstone</th>
                                    <th className="px-6 py-3 text-left font-semibold">Weight</th>
                                    <th className="px-6 py-3 text-left font-semibold">Color</th>
                                    <th className="px-6 py-3 text-left font-semibold">Issue Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {certificates.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                            <i className="fas fa-gem text-3xl mb-2"></i>
                                            <p>No certificates found. Upload your first certificate!</p>
                                        </td>
                                    </tr>
                                ) : (
                                    certificates.map((cert, index) => (
                                        <tr key={cert.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                            <td className="px-6 py-4 font-medium text-blue-600">
                                                <i className="fas fa-certificate mr-2"></i>
                                                {cert.certificateNumber}
                                            </td>
                                            <td className="px-6 py-4">{cert.gemstoneType}</td>
                                            <td className="px-6 py-4 font-semibold">{cert.caratWeight} CT</td>
                                            <td className="px-6 py-4">
                                                <span 
                                                    className="inline-block w-4 h-4 rounded-full mr-2" 
                                                    style={{backgroundColor: getColorCode(cert.color)}}
                                                ></span>
                                                {cert.color}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{cert.issueDate}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

// Main App Component
const App = () => {
    const [currentPage, setCurrentPage] = useState('home');
    const [currentUser, setCurrentUser] = useState(null);
    const [foundCertificate, setFoundCertificate] = useState(null);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                setCurrentUser(data.user);
            }
        } catch (error) {
            // Not authenticated - continue as guest
        }
    };

    const handleLogin = (user) => {
        setCurrentUser(user);
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleCertificateFound = (certificate) => {
        setFoundCertificate(certificate);
    };

    const handleUploadSuccess = (certificate) => {
        setCurrentPage('home');
        setFoundCertificate(certificate);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation 
                currentPage={currentPage}
                onPageChange={handlePageChange}
                currentUser={currentUser}
            />
            
            {currentPage === 'home' && (
                <HomePage onCertificateFound={handleCertificateFound} />
            )}
            
            {currentPage === 'upload' && (
                <UploadPage onSuccess={handleUploadSuccess} />
            )}
            
            {currentPage === 'admin' && (
                <AdminPage 
                    currentUser={currentUser}
                    onLogin={handleLogin}
                    onLogout={handleLogout}
                />
            )}
        </div>
    );
};

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));