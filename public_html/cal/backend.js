// Appwrite Backend Service
// This file provides an abstraction layer for interacting with Appwrite services

class AppwriteBackend {
    constructor() {
        this.client = null;
        this.account = null;
        this.databases = null;
        this.query = null;
        this.currentUser = null;
    }

    // Initialize the Appwrite client and services
    initialize(endpoint, projectId) {
        try {
            const { Client, Account, Databases, Query } = Appwrite;

            // Initialize Appwrite client
            this.client = new Client();
            this.client
                .setEndpoint(endpoint)
                .setProject(projectId);

            // Initialize services
            this.databases = new Databases(this.client);
            this.account = new Account(this.client);
            this.query = Query;

            return true;
        } catch (error) {
            console.error('Error initializing Appwrite:', error);
            return false;
        }
    }

    // Authentication methods
    async login(email, password) {
        try {
            await this.account.createEmailPasswordSession(email, password);
            this.currentUser = await this.account.get();
            return { success: true, user: this.currentUser };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    }

    async signup(email, password) {
        try {
            const user = await this.account.create('unique()', email, password);
            // Automatically log in after successful signup
            await this.login(email, password);
            return { success: true, user };
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, error: error.message };
        }
    }

    async logout() {
        try {
            await this.account.deleteSession('current');
            this.currentUser = null;
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
    }

    async checkSession() {
        try {
            this.currentUser = await this.account.get();
            return { success: true, user: this.currentUser };
        } catch (error) {
            console.log('No active session');
            return { success: false };
        }
    }

    // Database operations
    async listDocuments(databaseId, collectionId, queries = []) {
        try {
            return await this.databases.listDocuments(databaseId, collectionId, queries);
        } catch (error) {
            console.error('Error listing documents:', error);
            throw error;
        }
    }

    async createDocument(databaseId, collectionId, documentId, data) {
        try {
            return await this.databases.createDocument(databaseId, collectionId, documentId, data);
        } catch (error) {
            console.error('Error creating document:', error);
            throw error;
        }
    }

    async getDocument(databaseId, collectionId, documentId) {
        try {
            return await this.databases.getDocument(databaseId, collectionId, documentId);
        } catch (error) {
            console.error('Error getting document:', error);
            throw error;
        }
    }

    async updateDocument(databaseId, collectionId, documentId, data) {
        try {
            return await this.databases.updateDocument(databaseId, collectionId, documentId, data);
        } catch (error) {
            console.error('Error updating document:', error);
            throw error;
        }
    }

    async deleteDocument(databaseId, collectionId, documentId) {
        try {
            return await this.databases.deleteDocument(databaseId, collectionId, documentId);
        } catch (error) {
            console.error('Error deleting document:', error);
            throw error;
        }
    }

    // Helper method to load all documents with pagination
    async loadAllDocuments(databaseId, collectionId, queries = []) {
        try {
            const allDocuments = [];
            let offset = 0;
            const limit = 100;

            while (true) {
                const paginationQueries = [
                    this.query.limit(limit),
                    this.query.offset(offset),
                    ...queries
                ];

                const response = await this.databases.listDocuments(
                    databaseId,
                    collectionId,
                    paginationQueries
                );

                allDocuments.push(...response.documents);

                if (response.documents.length < limit) {
                    break;
                }

                offset += limit;
            }

            return allDocuments;
        } catch (error) {
            console.error('Error loading all documents:', error);
            throw error;
        }
    }

    // Get the current user
    getCurrentUser() {
        return this.currentUser;
    }
}

// Create and export a singleton instance
const backend = new AppwriteBackend();

// Export the backend instance
window.appwriteBackend = backend;
