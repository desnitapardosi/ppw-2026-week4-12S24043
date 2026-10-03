document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});

class App {
    constructor() {
        this.state = {
            profile: null,
            projects: [],
            services: []
        };
    }

    async init() {
        await this.loadProfileData();
        await this.loadServicesData();
        await this.loadProjectsData();
        this.setupFormEventListener();
    }

    // Helper Sanitasi DOM XSS Preventer
    escapeHTML(str) {
        if (!str) return '';
        return String(str).replace(/[&<>"']/g, (m) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[m]));
    }

    // 1. RENDER PROFILE DATA
    async loadProfileData() {
        try {
            const profile = await ApiService.getProfile();
            this.state.profile = profile;

            // Injeksi data ke Hero Section
            const heroName = document.getElementById('heroName');
            const heroRole = document.getElementById('heroRole');
            const heroBio = document.getElementById('heroBio');

            if (heroName) {
                heroName.innerHTML = `${this.escapeHTML(profile.name.split(' ')[0])} <span>${this.escapeHTML(profile.name.split(' ').slice(1).join(' '))}</span>`;
            }
            if (heroRole) heroRole.textContent = profile.role || profile.program;
            if (heroBio) heroBio.textContent = profile.description;

        } catch (err) {
            console.error('Gagal memuat profil:', err);
        }
    }

    // 2. RENDER SERVICES TO DROPDOWN FORM
    async loadServicesData() {
        const selectEl = document.getElementById('serviceSelect');
        if (!selectEl) return;

        try {
            const services = await ApiService.getServices();
            this.state.services = services;

            selectEl.innerHTML = '<option value="" selected disabled>-- Pilih jenis layanan --</option>';
            services.forEach(srv => {
                const opt = document.createElement('option');
                opt.value = srv.value;
                opt.textContent = srv.name;
                selectEl.appendChild(opt);
            });
        } catch (err) {
            selectEl.innerHTML = '<option value="">Gagal memuat daftar layanan</option>';
        }
    }

    // 3. RENDER PROJECTS & 4 UI STATES
    async loadProjectsData() {
        const container = document.getElementById('projectsContainer');
        if (!container) return;

        // --- UI State 1: Loading State (Spinner) ---
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status"></div>
                <p class="mt-3 text-secondary fw-semibold">Memuat karya & proyek...</p>
            </div>
        `;

        try {
            const projects = await ApiService.getProjects();
            this.state.projects = projects;

            // --- UI State 2: Empty State ---
            if (!projects || projects.length === 0) {
                container.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <i class="bi bi-folder-x display-4 text-muted"></i>
                        <p class="text-secondary mt-2">Belum ada proyek yang dapat ditampilkan.</p>
                    </div>
                `;
                return;
            }

            // --- UI State 3: Success Render State ---
            this.renderProjectsGrid(projects);

        } catch (err) {
            // --- UI State 4: Error Fallback State ---
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger text-center p-4 rounded-4 shadow-sm" role="alert">
                        <i class="bi bi-exclamation-triangle-fill fs-2 mb-2 d-block"></i>
                        <h5 class="fw-bold">Gagal Memuat Data Proyek</h5>
                        <p class="mb-0 small">Pastikan Anda menjalankan proyek ini menggunakan <strong>Live Server</strong> di Visual Studio Code.</p>
                    </div>
                </div>
            `;
        }
    }

    renderProjectsGrid(projects) {
        const container = document.getElementById('projectsContainer');
        container.innerHTML = '';

        projects.forEach(proj => {
            const col = document.createElement('div');
            col.className = 'col';
            col.innerHTML = `
                <article class="project-card card h-100 border-0 rounded-4 shadow-sm p-4">
                    <div class="card-body p-0 d-flex flex-column">
                        <div class="project-image-wrapper mb-3 rounded-3 overflow-hidden" style="height: 180px;">
                            <img src="${proj.thumbnail || './images/organic-fruit-store.png'}" 
                                 class="project-image w-100 h-100 object-fit-cover" 
                                 alt="${this.escapeHTML(proj.title)}"
                                 onerror="this.onerror=null;this.src='https://via.placeholder.com/400x250?text=Gambar+Tidak+Ditemukan';">
                        </div>
                        <span class="project-number text-uppercase fw-bold mb-2">PROJECT ${proj.number || proj.id}</span>
                        <h3 class="card-title h4 fw-bold text-dark-custom mb-2">${this.escapeHTML(proj.title)}</h3>
                        <p class="card-text text-secondary mb-3 flex-grow-1 small">${this.escapeHTML(proj.description)}</p>
                        
                        <div class="mb-4">
                            ${(proj.tags || []).map(tag => `<span class="badge badge-custom me-1 mb-1">${this.escapeHTML(tag)}</span>`).join('')}
                        </div>

                        <button type="button" class="btn btn-outline-primary-custom rounded-pill mt-auto w-100 fw-bold btn-view-detail"
                                data-id="${proj.id}">
                            <i class="bi bi-info-circle me-1"></i> Detail Proyek
                        </button>
                    </div>
                </article>
            `;
            container.appendChild(col);
        });

        // Attach event listener ke tombol "Detail Proyek"
        container.querySelectorAll('.btn-view-detail').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetBtn = e.target.closest('.btn-view-detail');
                const rawId = targetBtn.getAttribute('data-id');
                const pId = isNaN(rawId) ? rawId : parseInt(rawId);
                this.openUniversalModal(pId);
            });
        });
    }

    // 4. UNIVERSAL DYNAMIC MODAL COMPONENT
    openUniversalModal(projectId) {
        const proj = this.state.projects.find(p => p.id === projectId);
        if (!proj) return;

        const titleEl = document.getElementById('projectModalTitle');
        const bodyEl = document.getElementById('projectModalBody');

        if (titleEl) titleEl.textContent = proj.title;

        if (bodyEl) {
            bodyEl.innerHTML = `
                <div class="text-center mb-3">
                    <img src="${proj.thumbnail || './images/organic-fruit-store.png'}" 
                         class="img-fluid rounded-4 shadow-sm w-100" 
                         style="max-height: 280px; object-fit: cover;"
                         alt="${this.escapeHTML(proj.title)}"
                         onerror="this.onerror=null;this.src='https://via.placeholder.com/600x300?text=Gambar+Tidak+Ditemukan';">
                </div>
                
                <div class="mb-3">
                    <span class="badge bg-accent px-3 py-2 rounded-pill">${this.escapeHTML(proj.category || 'General')}</span>
                </div>

                <p class="text-secondary leading-relaxed mb-4">${this.escapeHTML(proj.details || proj.description)}</p>

                ${proj.features && proj.features.length > 0 ? `
                    <h6 class="fw-bold text-dark-custom mb-2"><i class="bi bi-check2-circle text-accent me-1"></i> Fitur & Hasil Utama:</h6>
                    <ul class="list-group list-group-flush mb-3">
                        ${proj.features.map(f => `<li class="list-group-item bg-transparent px-0 text-secondary small">• ${this.escapeHTML(f)}</li>`).join('')}
                    </ul>
                ` : ''}

                <div class="pt-2 border-top">
                    <small class="text-muted">Teknologi: ${this.escapeHTML((proj.tags || []).join(', '))}</small>
                </div>
            `;
        }

        const modalEl = document.getElementById('universalProjectModal');
        if (modalEl) {
            const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
            modalInstance.show();
        }
    }

    // 5. DECOUPLED ASYNCHRONOUS REST FORM & LOCALSTORAGE
    setupFormEventListener() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Client-side validation check
            if (!form.checkValidity()) {
                e.stopPropagation();
                form.classList.add('was-validated');
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn.innerHTML;

            // Transisi status tombol submit
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span> Mengirim...';

            const formData = new FormData(form);
            const payload = Object.fromEntries(formData.entries());

            try {
                // Panggil API Service asinkron (no reload)
                await ApiService.submitServiceOrder(payload);

                // Simpan data pemesanan ke localStorage
                const existingOrders = JSON.parse(localStorage.getItem('portfolioMessages') || '[]');
                existingOrders.push({
                    ...payload,
                    submittedAt: new Date().toISOString()
                });
                localStorage.setItem('portfolioMessages', JSON.stringify(existingOrders));

                // Tampilkan Bootstrap Toast Feedback
                this.showToastNotification('Sukses!', 'Permohonan layanan berhasil dikirim dan disimpan.');

                // Reset form
                form.reset();
                form.classList.remove('was-validated');

            } catch (err) {
                this.showToastNotification('Gagal!', 'Terjadi kesalahan saat mengirim permohonan.', 'danger');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
            }
        });
    }

    showToastNotification(title, message) {
        const toastEl = document.getElementById('liveToast');
        if (!toastEl) return;

        const toastTitle = document.getElementById('toastTitle');
        const toastBody = document.getElementById('toastBody');

        if (toastTitle) toastTitle.textContent = title;
        if (toastBody) toastBody.textContent = message;

        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    }
}