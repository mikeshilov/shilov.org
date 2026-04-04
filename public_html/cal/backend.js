// Shilov.org Backend Service
class ShilovBackend {
    constructor() {
        this.query = null;
        this.currentUser = null;
        this.baseUrl = 'https://api.shilov.org';
        this.token = localStorage.getItem('shilov_session_token') || '';
    }

    // Initialize query helpers used by the calendar code.
    initialize() {
        try {
            this.query = {
                equal: (field, value) => ({ op: 'equal', field, value })
            };

            return true;
        } catch (error) {
            console.error('Error initializing Shilov backend:', error);
            return false;
        }
    }

    async _request(path, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            'X-App-ID': 'shilov.org', // used for localhost testing only, can be removed in production
            ...(options.headers || {})
        };

        if (this.token) {
            headers.Authorization = `Bearer ${this.token}`;
        }

        const response = await fetch(`${this.baseUrl}${path}`, {
            ...options,
            headers
        });

        if (response.status === 204) {
            return null;
        }

        const text = await response.text();
        let payload = null;
        if (text) {
            try {
                payload = JSON.parse(text);
            } catch (e) {
                payload = { raw: text };
            }
        }

        if (!response.ok) {
            const message =
                payload?.message ||
                payload?.code ||
                payload?.error ||
                `Request failed with status ${response.status}`;
            throw new Error(message);
        }

        return payload;
    }

    _setToken(token) {
        this.token = token || '';
        if (this.token) {
            localStorage.setItem('shilov_session_token', this.token);
        } else {
            localStorage.removeItem('shilov_session_token');
        }
    }

    _extractToken(payload) {
        return payload?.session_token || payload?.sessionToken || payload?.token || '';
    }

    _colorsMapToDocuments(colorsMap) {
        const docs = [];
        for (const [datestr, color] of Object.entries(colorsMap || {})) {
            docs.push({
                $id: datestr,
                datestr,
                color
            });
        }
        return docs;
    }

    async _loadColorsMap() {
        const payload = await this._request('/cal/colors', { method: 'GET' });
        return payload?.colors || {};
    }

    // Authentication methods (OTP-only flow)
    async login(email, otp) {
        try {
            if (!otp) {
                return { success: false, error: 'OTP code is required' };
            }

            const payload = await this._request('/user/otp/verify', {
                method: 'POST',
                body: JSON.stringify({ email, otp })
            });

            const token = this._extractToken(payload);
            if (!token) {
                return { success: false, error: 'Missing session token in response' };
            }

            this._setToken(token);
            const me = await this.checkSession();
            if (!me.success) {
                return { success: false, error: 'OTP verified but session check failed' };
            }
            return { success: true, user: this.currentUser };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    }

    async signup(email) {
        try {
            await this._request('/user/otp/send', {
                method: 'POST',
                body: JSON.stringify({ email })
            });
            return {
                success: true,
                otpSent: true,
                message: 'OTP sent to your email'
            };
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, error: error.message };
        }
    }

    async logout() {
        try {
            await this._request('/user/logout', { method: 'POST' });
            this._setToken('');
            this.currentUser = null;
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
    }

    async checkSession() {
        try {
            let payload = null;
            payload = await this._request('/user/me', { method: 'GET' });
            const email = payload?.email || payload;
            if (!email) {
                return { success: false };
            }
            this.currentUser = email;
            return { success: true, user: this.currentUser };
        } catch (_) {
            return { success: false };
        }
    }

    // Database operations compatibility
    async listDocuments(databaseId, collectionId, queries = []) {
        try {
            const colorsMap = await this._loadColorsMap();
            let documents = this._colorsMapToDocuments(colorsMap);

            for (const q of queries || []) {
                if (q && q.op === 'equal' && q.field === 'datestr') {
                    documents = documents.filter(d => d.datestr === q.value);
                }
            }

            return {
                total: documents.length,
                documents
            };
        } catch (error) {
            console.error('Error listing documents:', error);
            throw error;
        }
    }

    async createDocument(databaseId, collectionId, documentId, data) {
        try {
            const datestr = data?.datestr;
            const color = data?.color;
            if (!datestr || !color) {
                throw new Error('datestr and color are required');
            }

            await this._request(`/cal/colors/${encodeURIComponent(datestr)}`, {
                method: 'PUT',
                body: JSON.stringify({ color })
            });

            return {
                $id: datestr,
                datestr,
                color
            };
        } catch (error) {
            console.error('Error creating document:', error);
            throw error;
        }
    }

    async updateDocument(databaseId, collectionId, documentId, data) {
        try {
            const datestr = data?.datestr || documentId;
            const color = data?.color;
            if (!datestr || !color) {
                throw new Error('datestr and color are required');
            }

            await this._request(`/cal/colors/${encodeURIComponent(datestr)}`, {
                method: 'PUT',
                body: JSON.stringify({ color })
            });

            return {
                $id: datestr,
                datestr,
                color
            };
        } catch (error) {
            console.error('Error updating document:', error);
            throw error;
        }
    }

    async deleteDocument(databaseId, collectionId, documentId) {
        try {
            await this._request(`/cal/colors/${encodeURIComponent(documentId)}`, {
                method: 'DELETE'
            });
            return { $id: documentId };
        } catch (error) {
            console.error('Error deleting document:', error);
            throw error;
        }
    }

    // Helper method to load all documents with pagination compatibility
    async loadAllDocuments(databaseId, collectionId, queries = []) {
        try {
            const response = await this.listDocuments(databaseId, collectionId, queries);
            return response.documents || [];
        } catch (error) {
            console.error('Error loading all documents:', error);
            throw error;
        }
    }

}

// Create and export a singleton instance
const shilovBackend = new ShilovBackend();

// Export the backend instance
window.shilovBackend = shilovBackend;
