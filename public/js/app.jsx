// GIE Lab Website - Exact Duplicate of gie-labs.com/certificate.php

const { useState, useEffect } = React;

// Header Component - Exact match to gie-labs.com
const Header = ({ currentPage }) => (
    <>
        {/* Top header with contact info and social icons - dark background */}
        <div className="top-header">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <i className="fas fa-phone"></i>
                            <span>+91-172 - 9940240</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <i className="fas fa-envelope"></i>
                            <span>info@gielabs.com</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <a href="#" className="text-white hover:text-orange-400 transition-colors">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" className="text-white hover:text-orange-400 transition-colors">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="#" className="text-white hover:text-orange-400 transition-colors">
                            <i className="fab fa-linkedin-in"></i>
                        </a>
                        <a href="#" className="text-white hover:text-orange-400 transition-colors">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="#" className="text-white hover:text-orange-400 transition-colors">
                            <i className="fab fa-youtube"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        {/* Main header with logo and Get Certificate button */}
        <header className="main-header">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between py-4">
                    {/* Logo and brand text */}
                    <div className="logo-container">
                        <img src="/logo.png" alt="GIE Logo" className="logo-image" onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'inline-block';
                        }}/>
                        <div className="logo-text">GIE LAB</div>
                    </div>
                    
                    {/* Get Certificate button */}
                    <a 
                        href="/upload-certificate" 
                        className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                        onClick={(e) => { 
                            e.preventDefault(); 
                            window.history.pushState({}, '', '/upload-certificate'); 
                            window.dispatchEvent(new PopStateEvent('popstate'));
                            window.dispatchEvent(new CustomEvent('navigation'));
                        }}
                    >
                        Get Certificate
                    </a>
                </div>
            </div>

            {/* Navigation menu with orange background */}
            <nav className="nav-menu">
                <div className="container mx-auto px-4">
                    <div className="flex">
                        <a href="/" className={`nav-item ${currentPage === 'home' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); window.dispatchEvent(new CustomEvent('navigation')); }}>Home</a>
                        <a href="/about" className={`nav-item ${currentPage === 'about' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/about'); window.dispatchEvent(new PopStateEvent('popstate')); window.dispatchEvent(new CustomEvent('navigation')); }}>About</a>
                        <a href="/certification" className={`nav-item ${currentPage === 'certification' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/certification'); window.dispatchEvent(new PopStateEvent('popstate')); window.dispatchEvent(new CustomEvent('navigation')); }}>Certification</a>
                        <a href="/contact" className={`nav-item ${currentPage === 'contact' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/contact'); window.dispatchEvent(new PopStateEvent('popstate')); window.dispatchEvent(new CustomEvent('navigation')); }}>Contact</a>
                    </div>
                </div>
            </nav>
        </header>
    </>
);

// Certificate Search Section
const CertificateSearch = ({ onSearch, loading, error }) => {
    const [searchValue, setSearchValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchValue.trim()) {
            onSearch(searchValue.trim());
        }
    };

    return (
        <section className="hero-section text-white relative">
            <div className="container mx-auto px-4 py-24 relative z-10">
                <div className="text-center fade-in-up">
                    <h2 className="hero-subtitle">Safe & Faster</h2>
                    <h1 className="hero-title mb-16">Validate Your Report</h1>
                    
                    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                        <div className="search-container">
                            <div className="flex">
                                <input 
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder="Enter Certificate Number"
                                    className="search-input flex-1 text-gray-700"
                                    disabled={loading}
                                />
                                <button 
                                    type="submit" 
                                    disabled={loading || !searchValue.trim()}
                                    className="track-button disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin mr-2"></i>
                                            Searching...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-search mr-2"></i>
                                            Track Report
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                        
                        {error && (
                            <div className="mt-6 p-4 bg-red-500 bg-opacity-90 text-white rounded-xl backdrop-filter backdrop-blur-lg">
                                <i className="fas fa-exclamation-circle mr-2"></i>
                                {error}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
};

// Professional Certificate Display Component
const CertificateDisplay = ({ certificate, onClose }) => {
    if (!certificate) return null;

    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 modern-section">
            <div className="container mx-auto px-4">
                {/* Close button */}
                {onClose && (
                    <div className="flex justify-end mb-6">
                        <button 
                            onClick={onClose} 
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>
                )}

                {/* Certificate Template */}
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-gradient-to-r from-orange-400 to-red-500">
                    {/* Certificate Header */}
                    <div className="relative bg-gradient-to-r from-orange-500 to-red-600 text-white p-8">
                        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-10"></div>
                        <div className="relative z-10 text-center">
                            <img 
                                src="/logo.png" 
                                alt="GIE LAB" 
                                className="h-16 mx-auto mb-4"
                            />
                            <h1 className="text-4xl font-bold mb-2">GEMOLOGICAL INSTITUTE OF EUROPE</h1>
                            <h2 className="text-2xl font-semibold opacity-90">GEMSTONE IDENTIFICATION REPORT</h2>
                            <div className="mt-4 inline-block bg-white bg-opacity-20 px-6 py-2 rounded-full">
                                <span className="text-lg font-bold">Certificate No: {certificate.certificateNumber}</span>
                            </div>
                        </div>
                    </div>

                    {/* Certificate Body */}
                    <div className="p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Left Column - Certificate Details */}
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-orange-500 pb-2 mb-6">IDENTIFICATION DETAILS</h3>
                                
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="cert-detail-item">
                                        <label className="cert-detail-label">Species</label>
                                        <div className="cert-detail-value">{certificate.gemstoneType}</div>
                                    </div>
                                    
                                    <div className="cert-detail-item">
                                        <label className="cert-detail-label">Weight</label>
                                        <div className="cert-detail-value">{certificate.caratWeight} CT</div>
                                    </div>
                                    
                                    <div className="cert-detail-item">
                                        <label className="cert-detail-label">Shape & Cut</label>
                                        <div className="cert-detail-value">{certificate.cut}</div>
                                    </div>
                                    
                                    <div className="cert-detail-item">
                                        <label className="cert-detail-label">Measurements</label>
                                        <div className="cert-detail-value">{certificate.measurements} mm</div>
                                    </div>
                                    
                                    <div className="cert-detail-item">
                                        <label className="cert-detail-label">Color</label>
                                        <div className="cert-detail-value">{certificate.color}</div>
                                    </div>
                                    
                                    <div className="cert-detail-item">
                                        <label className="cert-detail-label">Clarity</label>
                                        <div className="cert-detail-value">{certificate.clarity}</div>
                                    </div>
                                    
                                    <div className="cert-detail-item">
                                        <label className="cert-detail-label">Polish</label>
                                        <div className="cert-detail-value">{certificate.polish}</div>
                                    </div>
                                    
                                    <div className="cert-detail-item">
                                        <label className="cert-detail-label">Symmetry</label>
                                        <div className="cert-detail-value">{certificate.symmetry}</div>
                                    </div>
                                    
                                    <div className="cert-detail-item">
                                        <label className="cert-detail-label">Fluorescence</label>
                                        <div className="cert-detail-value">{certificate.fluorescence}</div>
                                    </div>
                                    
                                    <div className="cert-detail-item">
                                        <label className="cert-detail-label">Origin</label>
                                        <div className="cert-detail-value">{certificate.origin}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Gemstone Image */}
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-orange-500 pb-2 mb-6">GEMSTONE IMAGE</h3>
                                {certificate.imageUrl ? (
                                    <div className="bg-gray-50 p-8 rounded-2xl border-4 border-gray-200">
                                        <img 
                                            src={certificate.imageUrl} 
                                            alt="Certified Gemstone" 
                                            className="w-full max-w-sm mx-auto rounded-lg shadow-lg border-2 border-white"
                                        />
                                        <p className="mt-4 text-sm text-gray-600 font-medium">Actual gemstone photographed</p>
                                    </div>
                                ) : (
                                    <div className="bg-gray-100 p-12 rounded-2xl border-4 border-dashed border-gray-300">
                                        <i className="fas fa-gem text-6xl text-gray-400 mb-4"></i>
                                        <p className="text-gray-500 text-lg">No image available</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Certificate Footer */}
                        <div className="mt-12 pt-8 border-t-2 border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2">Issue Date</h4>
                                    <p className="text-gray-600">{certificate.issueDate}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2">Report Type</h4>
                                    <p className="text-gray-600">Gemstone Identification</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2">Status</h4>
                                    <span className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                                        <i className="fas fa-shield-check mr-2"></i>
                                        VERIFIED
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Security Features */}
                        <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border-2 border-orange-200">
                            <div className="text-center">
                                <h4 className="font-bold text-gray-800 mb-3">
                                    <i className="fas fa-certificate mr-2 text-orange-600"></i>
                                    AUTHENTICITY GUARANTEE
                                </h4>
                                <p className="text-sm text-gray-600">
                                    This certificate is issued by the Gemological Institute of Europe and is protected by advanced security features. 
                                    The gemstone described herein has been examined by qualified gemologists using appropriate gemological techniques.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Print Button */}
                <div className="text-center mt-8">
                    <button 
                        onClick={() => window.print()} 
                        className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all transform hover:scale-105"
                    >
                        <i className="fas fa-print mr-3"></i>
                        Print Certificate
                    </button>
                </div>
            </div>
        </section>
    );
};

// About Section with modern design
const AboutSection = () => (
    <section className="py-20 bg-white modern-section">
        <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2 fade-in-up">
                    <img 
                        src="/gemstone.jpg" 
                        alt="Gemstones Collection" 
                        className="w-full max-w-lg mx-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='400'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23FF4500;stop-opacity:0.1'/%3E%3Cstop offset='100%25' style='stop-color:%23ff6a00;stop-opacity:0.1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='500' height='400' fill='url(%23bg)' rx='20'/%3E%3Ctext x='250' y='180' text-anchor='middle' fill='%23FF4500' font-size='24' font-weight='bold'%3EGemstones%3C/text%3E%3Ctext x='250' y='220' text-anchor='middle' fill='%23FF4500' font-size='18'%3ECollection%3C/text%3E%3C/svg%3E";
                        }}
                    />
                </div>
                <div className="lg:w-1/2 lg:pl-8 fade-in-up">
                    <div className="gie-orange text-sm font-bold mb-6 uppercase tracking-wider">ABOUT US</div>
                    <h2 className="text-5xl font-bold text-gray-800 mb-8 leading-tight">
                        Trusted & Genuine Gem Certificate Provider
                    </h2>
                    <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                        The GIE Labs ensures for providing best treatments of Gemstone and Diamond 
                        testing with Certification. Our state-of-the-art laboratory facilities and 
                        expert gemologists guarantee accurate and reliable certification services.
                    </p>
                    <button className="flex items-center gie-orange font-bold text-lg hover:scale-105 transition-transform group">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-4 group-hover:shadow-lg transition-all">
                            <i className="fas fa-play text-white text-xl"></i>
                        </div>
                        Play Video
                    </button>
                </div>
            </div>
        </div>
    </section>
);

// GIE Lab Description Section
const DescriptionSection = () => (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50 modern-section">
        <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16 fade-in-up">
                    <h2 className="text-5xl font-bold text-gray-800 mb-6">Why Choose GIE Lab?</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Leading the industry with cutting-edge technology and unparalleled expertise in gemstone certification
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="glass-card text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="fas fa-microscope text-white text-2xl"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Advanced Technology</h3>
                        <p className="text-gray-600 leading-relaxed">
                            State-of-the-art equipment and cutting-edge analysis techniques for precise gemstone evaluation.
                        </p>
                    </div>
                    
                    <div className="glass-card text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="fas fa-certificate text-white text-2xl"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Certified Experts</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Our team of internationally certified gemologists brings decades of experience to every evaluation.
                        </p>
                    </div>
                    
                    <div className="glass-card text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="fas fa-shield-alt text-white text-2xl"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Trusted Certification</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Globally recognized certificates that provide confidence and value to your precious gemstones.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// Enhanced Contact Section
const ContactSection = () => (
    <section className="contact-info py-20">
        <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16 fade-in-up">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Get In Touch With Us</h2>
                    <p className="text-xl text-gray-600">We're here to help with all your gemstone certification needs</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="glass-card">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-6">
                            <i className="fas fa-map-marker-alt text-white text-xl"></i>
                        </div>
                        <h3 className="font-bold text-xl mb-4 gie-orange">Our Location</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            501/502, Mehta Bhavan, 5th Floor<br/>
                            Raja Ram Mohan Roy Marg<br/>
                            New Charniroad, Mumbai
                        </p>
                        <div className="space-y-2">
                            <p className="text-gray-600 flex items-center">
                                <i className="fas fa-phone mr-3 gie-orange"></i>
                                +91-172 - 9940240
                            </p>
                            <p className="text-gray-600 flex items-center">
                                <i className="fas fa-envelope mr-3 gie-orange"></i>
                                info@gielabs.com
                            </p>
                        </div>
                    </div>
                    
                    <div className="glass-card">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-6">
                            <i className="fas fa-link text-white text-xl"></i>
                        </div>
                        <h3 className="font-bold text-xl mb-4 gie-orange">Quick Links</h3>
                        <div className="space-y-3">
                            <a href="/" className="block text-gray-600 hover:text-orange-500 transition-colors py-1 border-b border-transparent hover:border-orange-500">Home</a>
                            <a href="/about" className="block text-gray-600 hover:text-orange-500 transition-colors py-1 border-b border-transparent hover:border-orange-500">About Us</a>
                            <a href="/certification" className="block text-gray-600 hover:text-orange-500 transition-colors py-1 border-b border-transparent hover:border-orange-500">Certification</a>
                            <a href="/contact" className="block text-gray-600 hover:text-orange-500 transition-colors py-1 border-b border-transparent hover:border-orange-500">Contact Us</a>
                        </div>
                    </div>
                    
                    <div className="glass-card">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-6">
                            <i className="fas fa-envelope-open text-white text-xl"></i>
                        </div>
                        <h3 className="font-bold text-xl mb-4 gie-orange">Newsletter</h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            GIE Lab is a growing online community and collaboration platform 
                            for all gemstones owner and distributor. Join our newsletter for updates!
                        </p>
                        <button className="w-full gie-bg-orange text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold">
                            <i className="fas fa-paper-plane mr-2"></i>
                            Sign Up Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// Footer
const Footer = () => (
    <footer className="footer-section py-6">
        <div className="container mx-auto px-4 text-center">
            <p>&copy; GIE Labs. All Rights Reserved.</p>
        </div>
    </footer>
);

// Photo Upload Component
const PhotoUploader = ({ onPhotoUploaded, currentPhoto }) => {
    const [uploading, setUploading] = useState(false);

    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            return;
        }

        setUploading(true);

        try {
            // Convert file to base64 for display (no cloud storage on Vercel)
            const reader = new FileReader();
            reader.onload = function(e) {
                onPhotoUploaded(e.target.result);
                setUploading(false);
            };
            reader.onerror = function() {
                alert('Failed to read file. Please try again.');
                setUploading(false);
            };
            reader.readAsDataURL(file);

        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to process photo. Please try again.');
            setUploading(false);
        }
    };

    return (
        <div className="md:col-span-2 mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
                Gemstone Photo (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                {currentPhoto ? (
                    <div className="space-y-4">
                        <img 
                            src={currentPhoto} 
                            alt="Uploaded gemstone" 
                            className="max-w-48 max-h-48 object-contain mx-auto border rounded-lg shadow-md"
                        />
                        <button
                            type="button"
                            onClick={() => onPhotoUploaded('')}
                            className="text-red-500 hover:text-red-700 text-sm font-semibold"
                        >
                            <i className="fas fa-trash mr-1"></i>
                            Remove Photo
                        </button>
                    </div>
                ) : (
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            disabled={uploading}
                            className="hidden"
                            id="photo-upload"
                        />
                        <label 
                            htmlFor="photo-upload" 
                            className={`cursor-pointer ${uploading ? 'opacity-50' : ''}`}
                        >
                            <div className="text-gray-600">
                                {uploading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin text-3xl mb-4 text-orange-500"></i>
                                        <p className="text-lg font-semibold">Uploading...</p>
                                        <p className="text-sm text-gray-500">Please wait</p>
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-cloud-upload-alt text-4xl mb-4 text-orange-500"></i>
                                        <p className="text-lg font-semibold text-gray-700">Click to upload gemstone photo</p>
                                        <p className="text-sm text-gray-500 mt-2">Supported: JPG, PNG, GIF (Max 10MB)</p>
                                    </>
                                )}
                            </div>
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
};

// About Page - Exact content from gie-labs.com/about.php
const AboutPage = () => {
    return (
        <div>
            <Header currentPage="about" />
            
            {/* Page hero with gemstone background */}
            <section className="page-hero">
                <div className="container mx-auto px-4 text-center">
                    <h1>About</h1>
                    <div className="breadcrumb-section mt-8">
                        <nav className="flex justify-center items-center space-x-2 text-white">
                            <a href="/" className="hover:text-orange-400" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}>Home</a>
                            <span className="w-2 h-2 bg-white rounded-full"></span>
                            <span className="text-orange-400">About</span>
                        </nav>
                    </div>
                </div>
            </section>

            {/* Hero section with gemstone image */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap items-center">
                        <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
                            <img src="/gemstone.jpg" alt="Gemstone Collection" className="w-full h-auto rounded-lg shadow-lg" onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNmM2Y0ZjYiLz48cGF0aCBkPSJNMzAwIDEwMGwxMDAgMTAwLTEwMCAxMDAtMTAwLTEwMHoiIGZpbGw9IiNlZjQ0NDQiLz48dGV4dCB4PSIzMDAiIHk9IjI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzM3NDE1MSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4Ij5HZW1zdG9uZSBDb2xsZWN0aW9uPC90ZXh0Pjwvc3ZnPg==';
                            }}/>
                        </div>
                        <div className="w-full lg:w-1/2 lg:pl-12">
                            <div className="text-orange-500 font-semibold text-lg mb-2">5+ Years Experience</div>
                            <h6 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-4">About Us</h6>
                            <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to Gemological Institute of Europe</h1>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                Gemological Institute of Europe was established to protect consumers when buying or valuing their diamonds, precious stones and precious jewellery. GIE is an independent foundation with offices around Europe and the world. GIE has been serving the international diamond industry for more then 5 years.
                            </p>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                GIE operates various services dependent on the individual laboratory. However all our laboratories offer our core services: Diamond Lab, our full service diamond grading laboratory, which is respected world wide by the diamond industry and by the general public alike; Precious Stones Lab; Jewellery Valuation Service.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gem test image section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap items-center">
                        <div className="w-full lg:w-1/2 lg:pr-12 mb-8 lg:mb-0">
                            <h6 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-4">Why Choose Us</h6>
                            <h2 className="text-4xl font-bold text-gray-800 mb-6">Faster, Safe and Trusted Gemstone Report Provider</h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                In addition we invest heavily in Research and Development to counter the growing use of Laboratory Enhanced Diamonds. GIE stands for quality, tradition and the highest standards. We regularly meet with our laboratory directors to inform and update on current equipment and enhancements and to stabilize the gradings and services offered from our laboratories.
                            </p>
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center">
                                    <i className="fas fa-check-circle text-orange-500 mr-3"></i>
                                    <h6 className="font-bold text-gray-800">Best In Industry</h6>
                                </div>
                                <div className="flex items-center">
                                    <i className="fas fa-check-circle text-orange-500 mr-3"></i>
                                    <h6 className="font-bold text-gray-800">Emergency Services</h6>
                                </div>
                                <div className="flex items-center">
                                    <i className="fas fa-check-circle text-orange-500 mr-3"></i>
                                    <h6 className="font-bold text-gray-800">24/7 Customer Support</h6>
                                </div>
                            </div>
                            <a href="/about" className="inline-flex items-center bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                                Learn More
                                <i className="fas fa-arrow-right ml-2"></i>
                            </a>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <img src="/gem-test.jpg" alt="Gem Testing Equipment" className="w-full h-auto rounded-lg shadow-lg" onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNmM2Y0ZjYiLz48Y2lyY2xlIGN4PSIzMDAiIGN5PSIyMDAiIHI9IjUwIiBmaWxsPSIjMzMzIi8+PGNpcmNsZSBjeD0iMzAwIiBjeT0iMjAwIiByPSIzMCIgZmlsbD0iI2VmNDQ0NCIvPjx0ZXh0IHg9IjMwMCIgeT0iMzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMzc0MTUxIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiPkdlbSBUZXN0aW5nPC90ZXh0Pjwvc3ZnPg==';
                            }}/>
                        </div>
                    </div>
                </div>
            </section>

            <ContactSection />
            <Footer />
        </div>
    );
};

// Certification Page - Exact content from gie-labs.com/certification.php
const CertificationPage = () => {
    return (
        <div>
            <Header currentPage="certification" />
            
            {/* Page hero with gemstone background */}
            <section className="page-hero">
                <div className="container mx-auto px-4 text-center">
                    <h1>Certification</h1>
                    <div className="breadcrumb-section mt-8">
                        <nav className="flex justify-center items-center space-x-2 text-white">
                            <a href="/" className="hover:text-orange-400" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}>Home</a>
                            <span className="w-2 h-2 bg-white rounded-full"></span>
                            <span className="text-orange-400">Certification</span>
                        </nav>
                    </div>
                </div>
            </section>

            {/* Main content */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl font-bold text-gray-800 mb-8">Importance of Certification</h1>
                        
                        <div className="prose prose-lg text-gray-600 space-y-6">
                            <p className="text-lg leading-relaxed">
                                A GIE Certificate provides clear details of the item that accompanies it, giving confidence to both the buyer and the seller. A stone´s value is determined by its gemmological makeup, its natural rarity, and its finished quality. Diamonds and gemstones that may look similar, can have important differences in value. Even experts need to use powerful analytic tools to be able to detect synthetics, treatments and enhancement processes. GIE lead the way in understanding and recognising these key differences, using the very finest equipment to guarantee accuracy.
                            </p>
                            
                            <p className="text-lg leading-relaxed font-semibold text-gray-800">
                                GIE is the trusted name for both expert and impartial grading of diamonds, gemstones and also jewellery.
                            </p>
                            
                            <p className="text-lg leading-relaxed">
                                It is our key belief that a gemstone should only ever change hands when accompanied by a certificate that attests to its quality. GIE is accepted as the common language of confidence and trust in the Gemological world, and should be considered an essential part of any purchase. Impartial and accurate grading is our first priority, and we take this responsibility very seriously.
                            </p>
                        </div>
                        
                        {/* Gem test image */}
                        <div className="mt-12 text-center">
                            <img src="/gem-test.jpg" alt="Gem Testing Equipment" className="w-full max-w-2xl mx-auto rounded-lg shadow-lg" onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNmM2Y0ZjYiLz48Y2lyY2xlIGN4PSIzMDAiIGN5PSIyMDAiIHI9IjUwIiBmaWxsPSIjMzMzIi8+PGNpcmNsZSBjeD0iMzAwIiBjeT0iMjAwIiByPSIzMCIgZmlsbD0iI2VmNDQ0NCIvPjx0ZXh0IHg9IjMwMCIgeT0iMzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMzc0MTUxIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiPkdlbSBUZXN0aW5nPC90ZXh0Pjwvc3ZnPg==';
                            }}/>
                        </div>
                    </div>
                </div>
            </section>

            <ContactSection />
            <Footer />
        </div>
    );
};

// Contact Page - Exact match to gie-labs.com/contact.php
const ContactPage = () => {
    return (
        <div style={{margin: 0, padding: 0}}>
            <Header currentPage="contact" />
            
            {/* Full viewport hero with all content on gemstone background */}
            <div className="page-hero">
                <div className="container mx-auto px-4 text-center" style={{paddingTop: '4rem'}}>
                    <h1>Contact</h1>
                    <div className="breadcrumb-section mt-8">
                        <nav className="flex justify-center items-center space-x-2 text-white">
                            <a href="/" className="hover:text-orange-400" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}>Home</a>
                            <span className="w-2 h-2 bg-white rounded-full"></span>
                            <span className="text-orange-400">Contact</span>
                        </nav>
                    </div>
                    
                    {/* All content directly on background */}
                    <div style={{marginTop: '4rem', padding: '3rem 2rem', maxWidth: '800px', margin: '4rem auto 0'}}>
                        <h2 className="contact-hero-text" style={{color: 'white', marginBottom: '2rem', textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
                            501/502, Mehta Bhavan, 5th Floor,<br />
                            Raja Ram Mohan Roy Marg,<br />
                            New Charniroad, Mumbai
                        </h2>
                    
                        {/* Google Maps Embed */}
                        <div className="max-w-full mx-auto mb-8">
                            <div className="relative w-full h-80 bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3772.8234567890!2d72.8159!3d18.9533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9b273b46d91%3A0xac5a4b7299f93ea6!2sGemmological%20Institute%20Of%20India!5e0!3m2!1sen!2sin!4v1234567890!5m2!1sen!2sin"
                                    width="100%" 
                                    height="100%" 
                                    style={{border: 0}}
                                    allowFullScreen="" 
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="GIE Location Map"
                                />
                            </div>
                        </div>

                        {/* Location details */}
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-white mb-4" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>Gemmological Institute Of India</h3>
                            <p className="text-white mb-4" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>
                                501/502, Mehta Bhavan, 5th Floor, Raja Ram Mohan Roy Marg,<br />
                                New Charniroad, Opposite Charni Road Station (East),<br />
                                Mumbai, Maharashtra 400004
                            </p>
                            
                            <div className="flex flex-wrap justify-center gap-6 mb-6">
                                <div className="flex items-center text-white">
                                    <i className="fas fa-phone text-orange-400 mr-2"></i>
                                    <span className="font-semibold" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>+91-172 - 9940240</span>
                                </div>
                                <div className="flex items-center text-white">
                                    <i className="fas fa-envelope text-orange-400 mr-2"></i>
                                    <span className="font-semibold" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>info@gielabs.com</span>
                                </div>
                            </div>
                            
                            <div className="flex justify-center space-x-4 pb-8">
                                <a 
                                    href="https://maps.google.com/maps/dir//Gemmological+Institute+Of+India" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                                >
                                    <i className="fas fa-directions mr-2"></i>
                                    Get Directions
                                </a>
                                <div className="flex items-center bg-green-100 text-green-800 px-4 py-3 rounded-lg">
                                    <i className="fas fa-star text-yellow-500 mr-2"></i>
                                    <span className="font-bold">4.6</span>
                                    <span className="ml-2">(56 reviews)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Upload Certificate Page
const UploadCertificatePage = () => {
    const [formData, setFormData] = useState({
        certificateNumber: '',
        gemstoneType: '',
        caratWeight: '',
        cut: '',
        measurements: '',
        clarity: '',
        color: '',
        polish: '',
        symmetry: '',
        fluorescence: '',
        origin: '',
        issueDate: new Date().toISOString().split('T')[0] // Set today as default
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePhotoUploaded = (url) => {
        setPhotoUrl(url);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const submitData = {
                ...formData,
                imageUrl: photoUrl || null
            };

            console.log('Submitting certificate data:', submitData); // Debug log

            const response = await fetch('/api/certificates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submitData)
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', [...response.headers.entries()]);
            
            const responseText = await response.text();
            console.log('Raw response text:', responseText);
            
            let result;
            try {
                result = JSON.parse(responseText);
                console.log('Parsed JSON result:', result);
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                console.error('Response was not valid JSON:', responseText);
                throw new Error(`Server returned invalid response: ${responseText.substring(0, 100)}`);
            }

            if (response.ok) {
                setMessage('Certificate uploaded successfully!');
                setFormData({
                    certificateNumber: '',
                    gemstoneType: '',
                    caratWeight: '',
                    cut: '',
                    measurements: '',
                    clarity: '',
                    color: '',
                    polish: '',
                    symmetry: '',
                    fluorescence: '',
                    origin: '',
                    issueDate: new Date().toISOString().split('T')[0]
                });
                setPhotoUrl('');
            } else {
                setMessage(`Error: ${result.message || result.error || 'Unknown error occurred'}`);
                console.error('Upload error:', result);
            }
        } catch (error) {
            console.error('Network error:', error);
            setMessage(`Network error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Header currentPage="upload" />
            
            {/* Page hero with gemstone background */}
            <section className="page-hero">
                <div className="container mx-auto px-4 text-center">
                    <h1>Upload Certificate</h1>
                    <div className="breadcrumb-section mt-8">
                        <nav className="flex justify-center items-center space-x-2 text-white">
                            <a href="/" className="hover:text-orange-400" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}>Home</a>
                            <span className="w-2 h-2 bg-white rounded-full"></span>
                            <span className="text-orange-400">Upload Certificate</span>
                        </nav>
                    </div>
                </div>
            </section>
            
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                        <h1 className="text-3xl font-bold text-center mb-8 gie-orange">Upload Certificate</h1>
                        
                        {message && (
                            <div className={`mb-6 p-4 rounded ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Certificate Number</label>
                                <input 
                                    type="text" 
                                    name="certificateNumber" 
                                    value={formData.certificateNumber}
                                    onChange={handleChange}
                                    required 
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                                    placeholder="e.g., GIE-2024-001237"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Gemstone Type</label>
                                <input 
                                    type="text" 
                                    name="gemstoneType" 
                                    value={formData.gemstoneType}
                                    onChange={handleChange}
                                    required 
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                                    placeholder="e.g., Natural Diamond"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Carat Weight</label>
                                <input 
                                    type="text" 
                                    name="caratWeight" 
                                    value={formData.caratWeight}
                                    onChange={handleChange}
                                    required 
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                                    placeholder="e.g., 1.25"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Cut/Shape</label>
                                <input 
                                    type="text" 
                                    name="cut" 
                                    value={formData.cut}
                                    onChange={handleChange}
                                    required 
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                                    placeholder="e.g., Round"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Measurements</label>
                                <input 
                                    type="text" 
                                    name="measurements" 
                                    value={formData.measurements}
                                    onChange={handleChange}
                                    required 
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                                    placeholder="e.g., 6.85 x 6.91 x 4.24"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Clarity</label>
                                <input 
                                    type="text" 
                                    name="clarity" 
                                    value={formData.clarity}
                                    onChange={handleChange}
                                    required 
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                                    placeholder="e.g., VVS1"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Color</label>
                                <input 
                                    type="text" 
                                    name="color" 
                                    value={formData.color}
                                    onChange={handleChange}
                                    required 
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                                    placeholder="e.g., D"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Polish</label>
                                <input 
                                    type="text" 
                                    name="polish" 
                                    value={formData.polish}
                                    onChange={handleChange}
                                    required 
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                                    placeholder="e.g., Excellent"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Symmetry</label>
                                <input 
                                    type="text" 
                                    name="symmetry" 
                                    value={formData.symmetry}
                                    onChange={handleChange}
                                    required 
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                                    placeholder="e.g., Excellent"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Fluorescence</label>
                                <input 
                                    type="text" 
                                    name="fluorescence" 
                                    value={formData.fluorescence}
                                    onChange={handleChange}
                                    required 
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                                    placeholder="e.g., None"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Origin</label>
                                <input 
                                    type="text" 
                                    name="origin" 
                                    value={formData.origin}
                                    onChange={handleChange}
                                    required 
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                                    placeholder="e.g., Natural"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Issue Date</label>
                                <input 
                                    type="date" 
                                    name="issueDate" 
                                    value={formData.issueDate}
                                    onChange={handleChange}
                                    required 
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                                />
                            </div>
                            
                            <PhotoUploader 
                                onPhotoUploaded={handlePhotoUploaded}
                                currentPhoto={photoUrl}
                            />
                            
                            <div className="md:col-span-2 text-center">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="gie-bg-orange text-white px-12 py-4 rounded font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin mr-2"></i>
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-upload mr-2"></i>
                                            Upload Certificate
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
            
            <ContactSection />
            <Footer />
        </div>
    );
};

// Main Homepage
const HomePage = () => {
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Transform database response to expected format
    const transformCertificateData = (dbData) => {
        return {
            id: dbData.id,
            certificateNumber: dbData.certificatenumber,
            gemstoneType: dbData.gemstonetype,
            caratWeight: dbData.caratweight,
            color: dbData.color,
            clarity: dbData.clarity,
            cut: dbData.cut,
            polish: dbData.polish,
            symmetry: dbData.symmetry,
            fluorescence: dbData.fluorescence,
            measurements: dbData.measurements,
            origin: dbData.origin,
            issueDate: dbData.issuedate,
            imageUrl: dbData.imageurl,
            createdAt: dbData.createdat
        };
    };

    const handleSearch = async (certificateNumber) => {
        setLoading(true);
        setError('');
        setCertificate(null);

        try {
            const response = await fetch(`/api/certificates/lookup/${encodeURIComponent(certificateNumber)}`);
            const data = await response.json();

            if (response.ok) {
                // Transform database response to expected format
                const transformedData = transformCertificateData(data);
                setCertificate(transformedData);
            } else {
                setError(data.message || 'Certificate not found');
            }
        } catch (err) {
            setError('Error searching for certificate');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Header currentPage="home" />
            <CertificateSearch onSearch={handleSearch} loading={loading} error={error} />
            {certificate && <CertificateDisplay certificate={certificate} onClose={() => setCertificate(null)} />}
            <AboutSection />
            <DescriptionSection />
            <ContactSection />
            <Footer />
        </div>
    );
};

// Router Component
const Router = () => {
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    useEffect(() => {
        const handlePopState = () => {
            setCurrentPath(window.location.pathname);
        };
        
        // Handle initial path
        setCurrentPath(window.location.pathname);
        
        window.addEventListener('popstate', handlePopState);
        
        // Also listen for custom navigation events
        const handleNavigation = () => {
            setCurrentPath(window.location.pathname);
        };
        
        window.addEventListener('navigation', handleNavigation);
        
        return () => {
            window.removeEventListener('popstate', handlePopState);
            window.removeEventListener('navigation', handleNavigation);
        };
    }, []);

    if (currentPath === '/upload-certificate') {
        return <UploadCertificatePage />;
    }
    
    if (currentPath === '/about') {
        return <AboutPage />;
    }
    
    if (currentPath === '/certification') {
        return <CertificationPage />;
    }
    
    if (currentPath === '/contact') {
        return <ContactPage />;
    }

    return <HomePage />;
};

// Main App
const App = () => <Router />;

// Use createRoot instead of ReactDOM.render for React 18
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
