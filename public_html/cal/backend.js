// Shilov.org Backend Service
class ShilovBackend {
    constructor() {
        this.currentUser = null;
        this.baseUrl = 'https://api.shilov.org';
        this.token = localStorage.getItem('shilov_session_token') || '';
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
            const payload = await this._request('/user/me', { method: 'GET' });
            const email = typeof payload === 'string' ? payload : payload?.email;
            if (!email) {
                return { success: false };
            }
            this.currentUser = { email };
            return { success: true, user: this.currentUser };
        } catch (_) {
            return { success: false };
        }
    }

    async loadColorDataMap() {
        try {
            return await this._loadColorsMap();
        } catch (error) {
            console.error('Error loading color data map:', error);
            throw error;
        }
    }

    async upsertColorData(data) {
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

            return { datestr, color };
        } catch (error) {
            console.error('Error upserting color data:', error);
            throw error;
        }
    }

    async deleteColorData(datestr) {
        try {
            if (!datestr) {
                throw new Error('datestr is required');
            }

            await this._request(`/cal/colors/${encodeURIComponent(datestr)}`, {
                method: 'DELETE'
            });
            return { datestr };
        } catch (error) {
            console.error('Error deleting color data:', error);
            throw error;
        }
    }

}

// Create and export a singleton instance
const shilovBackend = new ShilovBackend();

// Export the backend instance
window.shilovBackend = shilovBackend;
