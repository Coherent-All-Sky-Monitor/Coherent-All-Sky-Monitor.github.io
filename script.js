// Dark mode toggle logic
function setDarkMode(enabled) {
    document.body.classList.toggle('dark-mode', enabled);
    localStorage.setItem('darkMode', enabled ? '1' : '0');
    document.getElementById('darkModeToggle').textContent = enabled ? '☀️' : '🌙';
}

function initDarkMode() {
    const saved = localStorage.getItem('darkMode');
    const enabled = saved === '1';
    setDarkMode(enabled);
    document.getElementById('darkModeToggle').addEventListener('click', () => {
        setDarkMode(!document.body.classList.contains('dark-mode'));
    });
}

window.addEventListener('DOMContentLoaded', initDarkMode);
class RepositoryManager {
    constructor() {
        this.repositories = [];
        this.filteredRepositories = [];
        this.init();
    }

    async init() {
        await this.loadRepositories();
        this.setupEventListeners();
        this.renderRepositories();
        this.populateLanguageFilter();
    }

    async loadRepositories() {
        try {
            const response = await fetch('repos.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.repositories = await response.json();
            this.filteredRepositories = [...this.repositories];
            
            document.getElementById('loading').style.display = 'none';
            document.getElementById('reposTable').style.display = 'table';
        } catch (error) {
            console.error('Error loading repositories:', error);
            this.showError('Failed to load repositories. Please try again later.');
        }
    }

    setupEventListeners() {
        const searchInput = document.getElementById('search');
        const languageFilter = document.getElementById('languageFilter');
        const refreshButton = document.getElementById('refresh');

        searchInput.addEventListener('input', () => this.filterRepositories());
        languageFilter.addEventListener('change', () => this.filterRepositories());
        refreshButton.addEventListener('click', () => this.refreshData());
    }

    filterRepositories() {
        const searchTerm = document.getElementById('search').value.toLowerCase();
        const selectedLanguage = document.getElementById('languageFilter').value;

        this.filteredRepositories = this.repositories.filter(repo => {
            const matchesSearch = repo.name.toLowerCase().includes(searchTerm) ||
                                repo.description.toLowerCase().includes(searchTerm);
            const matchesLanguage = !selectedLanguage || repo.language === selectedLanguage;
            
            return matchesSearch && matchesLanguage;
        });

        this.renderRepositories();
    }

    populateLanguageFilter() {
        const languages = [...new Set(this.repositories.map(repo => repo.language).filter(Boolean))];
        const select = document.getElementById('languageFilter');
        
        languages.sort().forEach(language => {
            const option = document.createElement('option');
            option.value = language;
            option.textContent = language;
            select.appendChild(option);
        });
    }

    renderRepositories() {
        const tbody = document.getElementById('reposTableBody');
        tbody.innerHTML = '';

        this.filteredRepositories.forEach(repo => {
            const row = this.createRepositoryRow(repo);
            tbody.appendChild(row);
        });
    }

    createRepositoryRow(repo) {
        const row = document.createElement('tr');
        
        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleDateString();
        };

        const createLinks = (repo) => {
            const linksContainer = document.createElement('div');
            linksContainer.className = 'repo-links';

            // GitHub repository link
            const repoLink = document.createElement('a');
            repoLink.href = repo.html_url;
            repoLink.target = '_blank';
            repoLink.innerHTML = '📁 Repo';
            linksContainer.appendChild(repoLink);

            // GitHub Pages link (if available)
            if (repo.has_pages && repo.pages_url) {
                const pagesLink = document.createElement('a');
                pagesLink.href = repo.pages_url;
                pagesLink.target = '_blank';
                pagesLink.innerHTML = '🌐 Live Demo';
                linksContainer.appendChild(pagesLink);
            }

            // Custom homepage link (if different from pages)
            if (repo.homepage && repo.homepage !== repo.pages_url) {
                const homepageLink = document.createElement('a');
                homepageLink.href = repo.homepage;
                homepageLink.target = '_blank';
                homepageLink.innerHTML = '🔗 Website';
                linksContainer.appendChild(homepageLink);
            }

            return linksContainer;
        };

        row.innerHTML = `
            <td><strong>${repo.name}</strong></td>
            <td>${repo.description}</td>
            <td>${repo.language ? `<span class="language-tag">${repo.language}</span>` : '-'}</td>
            <td><span class="stars">⭐ ${repo.stars}</span></td>
            <td></td>
            <td>${formatDate(repo.updated_at)}</td>
        `;

        // Add links to the appropriate cell
        const linksCell = row.cells[4];
        linksCell.appendChild(createLinks(repo));

        return row;
    }

    async refreshData() {
        document.getElementById('refresh').disabled = true;
        document.getElementById('refresh').textContent = '🔄 Refreshing...';
        
        try {
            // Force reload by adding timestamp
            const response = await fetch(`repos.json?t=${Date.now()}`);
            if (response.ok) {
                this.repositories = await response.json();
                this.filteredRepositories = [...this.repositories];
                this.renderRepositories();
                this.populateLanguageFilter();
            }
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            document.getElementById('refresh').disabled = false;
            document.getElementById('refresh').textContent = '🔄 Refresh';
        }
    }

    showError(message) {
        document.getElementById('loading').style.display = 'none';
        const errorDiv = document.getElementById('error');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RepositoryManager();
});
