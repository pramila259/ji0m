// GIE Certificate Management System - Pure JavaScript Implementation
// Recreating the full TypeScript/React functionality in vanilla JS

class GIEApp {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'home';
        this.certificates = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthStatus();
        this.showPage('home');
    }

    bindEvents() {
        // Navigation
        document.getElementById('homeBtn').addEventListener('click', () => this.showPage('home'));
        document.getElementById('uploadBtn').addEventListener('click', () => this.showPage('upload'));
        document.getElementById('adminBtn').addEventListener('click', () => this.showPage('admin'));

        // Certificate search
        document.getElementById('searchBtn').addEventListener('click', () => this.searchCertificate());
        document.getElementById('certificateInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchCertificate();
        });

        // Sample certificates
        document.querySelectorAll('.sample-cert').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const certNumber = e.target.dataset.cert;
                document.getElementById('certificateInput').value = certNumber;
                this.searchCertificate();
            });
        });

        // Upload form
        document.getElementById('uploadForm').addEventListener('submit', (e) => this.uploadCertificate(e));

        // Admin login
        document.getElementById('adminLoginForm').addEventListener('submit', (e) => this.adminLogin(e));

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    showPage(page) {
        // Hide all pages
        document.querySelectorAll('#homePage, #uploadPage, #adminPage').forEach(el => {
            el.classList.add('hidden');
        });

        // Show selected page
        const pageElement = document.getElementById(`${page}Page`);
        if (pageElement) {
            pageElement.classList.remove('hidden');
        }

        this.currentPage = page;

        // Load admin data if on admin page and authenticated
        if (page === 'admin' && this.currentUser) {
            this.showAdminDashboard();
            this.loadCertificates();
        } else if (page === 'admin' && !this.currentUser) {
            this.showLoginForm();
        }
    }

    async searchCertificate() {
        const input = document.getElementById('certificateInput');
        const certificateNumber = input.value.trim();

        if (!certificateNumber) {
            this.showMessage('Please enter a certificate number', 'error');
            return;
        }

        this.showLoading(true);

        try {
            const response = await fetch(`/api/certificates/lookup/${encodeURIComponent(certificateNumber)}`);
            const data = await response.json();

            if (response.ok) {
                this.displayCertificate(data);
            } else {
                this.showMessage(data.message || 'Certificate not found', 'error');
                document.getElementById('certificateResult').classList.add('hidden');
            }
        } catch (error) {
            this.showMessage('Error searching certificate', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    displayCertificate(certificate) {
        const resultDiv = document.getElementById('certificateResult');
        const dataDiv = document.getElementById('certificateData');

        // Create certificate display in the exact format from the reference image
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

        let html = '';
        fields.forEach(field => {
            html += `
                <div class="certificate-field">
                    <div class="field-label">${field.label}</div>
                    <div class="field-value">${field.value}</div>
                </div>
            `;
        });

        // Add gem image if available
        if (certificate.imageUrl) {
            html += `
                <div class="certificate-field">
                    <div class="field-label">GEM IMAGE:</div>
                    <div class="field-value">
                        <img src="${certificate.imageUrl}" alt="Gemstone Image" class="certificate-image rounded border">
                    </div>
                </div>
            `;
        }

        dataDiv.innerHTML = html;
        resultDiv.classList.remove('hidden');

        // Smooth scroll to certificate
        setTimeout(() => {
            resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }

    async uploadCertificate(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData();

        // Get form fields and build request data
        const fields = [
            'certificateNumber', 'gemstoneType', 'caratWeight', 
            'cut', 'measurements', 'clarity', 'color', 'polish', 'origin'
        ];

        const data = {};
        fields.forEach(field => {
            const input = form.querySelector(`[name="${field}"]`);
            if (input) {
                data[field] = input.value.trim();
            }
        });

        // Validate required fields
        const requiredFields = ['certificateNumber', 'gemstoneType', 'caratWeight'];
        for (const field of requiredFields) {
            if (!data[field]) {
                this.showMessage(`${field} is required`, 'error');
                return;
            }
        }

        this.showLoading(true);

        try {
            const response = await fetch('/api/certificates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                this.showMessage('Certificate uploaded successfully!', 'success');
                form.reset();
                
                // Auto-navigate to search the newly created certificate
                setTimeout(() => {
                    document.getElementById('certificateInput').value = data.certificateNumber;
                    this.showPage('home');
                    this.searchCertificate();
                }, 1500);
            } else {
                this.showMessage(result.message || 'Error uploading certificate', 'error');
            }
        } catch (error) {
            this.showMessage('Error uploading certificate', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async adminLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (!username || !password) {
            this.showMessage('Please enter both username and password', 'error');
            return;
        }

        this.showLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.currentUser = data.user;
                this.showMessage('Login successful!', 'success');
                this.showAdminDashboard();
                this.loadCertificates();
                
                // Clear form
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';
            } else {
                this.showMessage(data.message || 'Login failed', 'error');
            }
        } catch (error) {
            this.showMessage('Login error - please try again', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async logout() {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            this.currentUser = null;
            this.showMessage('Logged out successfully', 'success');
            this.showLoginForm();
        } catch (error) {
            this.showMessage('Logout error', 'error');
        }
    }

    async checkAuthStatus() {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                this.currentUser = data.user;
            }
        } catch (error) {
            // Not authenticated - continue as guest
            this.currentUser = null;
        }
    }

    showAdminDashboard() {
        const loginForm = document.getElementById('loginForm');
        const dashboard = document.getElementById('adminDashboard');
        
        if (loginForm) loginForm.classList.add('hidden');
        if (dashboard) dashboard.classList.remove('hidden');
    }

    showLoginForm() {
        const loginForm = document.getElementById('loginForm');
        const dashboard = document.getElementById('adminDashboard');
        
        if (loginForm) loginForm.classList.remove('hidden');
        if (dashboard) dashboard.classList.add('hidden');
    }

    async loadCertificates() {
        try {
            this.showLoading(true);
            
            const response = await fetch('/api/certificates');
            if (!response.ok) {
                throw new Error('Failed to load certificates');
            }
            
            this.certificates = await response.json();

            const tbody = document.getElementById('certificatesTable');
            if (!tbody) return;

            tbody.innerHTML = '';

            if (this.certificates.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                            <i class="fas fa-gem text-3xl mb-2"></i>
                            <p>No certificates found. Upload your first certificate!</p>
                        </td>
                    </tr>
                `;
                return;
            }

            this.certificates.forEach((cert, index) => {
                const row = document.createElement('tr');
                row.className = `border-b hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`;
                
                row.innerHTML = `
                    <td class="px-6 py-4 font-medium text-blue-600 hover:text-blue-800 cursor-pointer" onclick="app.viewCertificateDetails('${cert.certificateNumber}')">
                        <i class="fas fa-certificate mr-2"></i>${cert.certificateNumber}
                    </td>
                    <td class="px-6 py-4">${cert.gemstoneType}</td>
                    <td class="px-6 py-4 font-semibold">${cert.caratWeight} CT</td>
                    <td class="px-6 py-4">
                        <span class="inline-block w-4 h-4 rounded-full mr-2" style="background-color: ${this.getColorCode(cert.color)}"></span>
                        ${cert.color}
                    </td>
                    <td class="px-6 py-4 text-gray-600">${cert.issueDate}</td>
                `;
                tbody.appendChild(row);
            });
        } catch (error) {
            this.showMessage('Error loading certificates', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    getColorCode(color) {
        const colorMap = {
            'D': '#f8f9fa', 'E': '#f1f3f5', 'F': '#e9ecef', 'G': '#dee2e6',
            'H': '#ced4da', 'I': '#adb5bd', 'J': '#6c757d',
            'White': '#ffffff', 'Yellow': '#ffd43b', 'Blue': '#339af0',
            'Red': '#ff6b6b', 'Green': '#51cf66', 'Pink': '#f783ac',
            'Pigeon Blood Red': '#c92a2a', 'Royal Blue': '#1c7ed6'
        };
        return colorMap[color] || '#6c757d';
    }

    viewCertificateDetails(certificateNumber) {
        // Switch to home page and search for the certificate
        document.getElementById('certificateInput').value = certificateNumber;
        this.showPage('home');
        this.searchCertificate();
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        if (show) {
            loading.classList.remove('hidden');
        } else {
            loading.classList.add('hidden');
        }
    }

    showMessage(message, type) {
        // Remove any existing messages
        document.querySelectorAll('.toast-message').forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.className = `toast-message fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 transform ${
            type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`;
        
        messageDiv.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'} mr-2"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-3 text-white hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(messageDiv);

        // Animate in
        setTimeout(() => {
            messageDiv.style.transform = 'translateX(0)';
            messageDiv.style.opacity = '1';
        }, 100);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (messageDiv.parentElement) {
                messageDiv.style.transform = 'translateX(100%)';
                messageDiv.style.opacity = '0';
                setTimeout(() => messageDiv.remove(), 300);
            }
        }, 4000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new GIEApp();
});