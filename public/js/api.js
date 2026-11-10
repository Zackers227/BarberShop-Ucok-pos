// API Base URL
const API_URL = window.location.origin + '/api';

// Storage keys
const TOKEN_KEY = 'pos_token';
const USER_KEY = 'pos_user';

// API Helper
class API {
    static getToken() {
        return localStorage.getItem(TOKEN_KEY);
    }

    static setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    }

    static getUser() {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    }

    static setUser(user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    static clearAuth() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }

    static async request(endpoint, options = {}) {
        const token = this.getToken();
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            ...options
        };

        if (options.body) {
            config.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(`${API_URL}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth
    static async login(username, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: { username, password }
        });
        
        this.setToken(data.token);
        this.setUser(data.user);
        return data;
    }

    static async logout() {
        this.clearAuth();
    }

    // Services
    static async getServices() {
        return await this.request('/services');
    }

    // Products
    static async getProducts() {
        return await this.request('/products');
    }

    static async getLowStockProducts() {
        return await this.request('/products?low_stock=true');
    }

    // Kapsters
    static async getKapsters() {
        return await this.request('/kapsters');
    }

    // Customers
    static async getCustomers(search = '') {
        return await this.request(`/customers${search ? '?search=' + search : ''}`);
    }

    static async createCustomer(data) {
        return await this.request('/customers', {
            method: 'POST',
            body: data
        });
    }

    // Discounts
    static async getDiscounts() {
        return await this.request('/discounts');
    }

    static async validateDiscount(code, transaction_total) {
        return await this.request('/discounts/validate', {
            method: 'POST',
            body: { code, transaction_total }
        });
    }

    // Transactions
    static async createTransaction(data) {
        return await this.request('/transactions', {
            method: 'POST',
            body: data
        });
    }

    static async getTransactions(params = {}) {
        const query = new URLSearchParams(params).toString();
        return await this.request(`/transactions${query ? '?' + query : ''}`);
    }

    static async getTransaction(id) {
        return await this.request(`/transactions/${id}`);
    }

    static async voidTransaction(id, reason) {
        return await this.request(`/transactions/${id}/void`, {
            method: 'POST',
            body: { reason }
        });
    }

    // Shifts
    static async getCurrentShift() {
        return await this.request('/shifts/current');
    }

    static async openShift(opening_balance, notes = '') {
        return await this.request('/shifts/open', {
            method: 'POST',
            body: { opening_balance, notes }
        });
    }

    static async closeShift(closing_balance, notes = '') {
        return await this.request('/shifts/close', {
            method: 'POST',
            body: { closing_balance, notes }
        });
    }

    static async getShiftHistory(limit = 10) {
        return await this.request(`/shifts/history?limit=${limit}`);
    }

    // Reports
    static async getDashboard() {
        return await this.request('/reports/dashboard');
    }

    static async getSalesReport(start_date, end_date, group_by = 'day') {
        const params = new URLSearchParams({ start_date, end_date, group_by }).toString();
        return await this.request(`/reports/sales?${params}`);
    }

    static async getKapsterReport(start_date, end_date) {
        const params = new URLSearchParams({ start_date, end_date }).toString();
        return await this.request(`/reports/kapsters?${params}`);
    }

    static async getTopServices(start_date, end_date, limit = 10) {
        const params = new URLSearchParams({ start_date, end_date, limit }).toString();
        return await this.request(`/reports/services/top?${params}`);
    }

    static async getPaymentReport(start_date, end_date) {
        const params = new URLSearchParams({ start_date, end_date }).toString();
        return await this.request(`/reports/payments?${params}`);
    }
}

// Helper functions
function formatCurrency(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatDateTime(date) {
    return new Date(date).toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showNotification(message, type = 'success') {
    // Simple notification (bisa diganti dengan toast library)
    alert(message);
}
