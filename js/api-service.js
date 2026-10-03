class ApiService {
    // Memuat data profil
    static async getProfile() {
        return await this.fetchJson('./data/profile.json');
    }

    // Memuat daftar proyek
    static async getProjects() {
        return await this.fetchJson('./data/projects.json');
    }

    // Memuat daftar layanan untuk dropdown form
    static async getServices() {
        return await this.fetchJson('./data/services.json');
    }

    // Method pembantu Fetch API dengan error handling
    static async fetchJson(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`[API Network Error] Gagal memuat ${url}:`, error);
            throw error;
        }
    }

    // Simulasi pengiriman data form (AJAX/REST POST)
    static async submitServiceOrder(payload) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ 
                    status: 'success', 
                    message: 'Permintaan layanan berhasil diproses.', 
                    data: payload 
                });
            }, 800);
        });
    }
}