/*
 * SKYRATE TRAVEL WEBSITE - JAVASCRIPT
 * Author: Sola Sarkis
 * Created: 2025
 * Description: Modern ES6 JavaScript for travel website functionality
 * 
 * Custom UI Requirement Implementation:
 * The AlertManager class provides styled alert messages for user feedback
 * as required by the project specifications.
 */

// ============================================================
// MAIN APPLICATION CLASS
// ============================================================
class SkyrateTravelApp {
    constructor() {
        this.alertManager = new AlertManager();
        this.countryService = new CountryService();
        this.feedbackManager = new FeedbackManager(this.alertManager);
        this.ratingsManager = new RatingsManager(this.alertManager);
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFeaturedDestinations();
        this.showWelcomeMessage();
    }

    setupEventListeners() {
        // Search form submission
        const searchForm = document.getElementById('searchForm');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => this.handleSearch(e));
        }

        // Quick search buttons
        const quickSearchButtons = document.querySelectorAll('.quick-search-btn');
        quickSearchButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleQuickSearch(e));
        });

        // Newsletter form
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => this.handleNewsletter(e));
        }

        // Smooth scrolling for navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    async handleSearch(event) {
        event.preventDefault();
        const searchInput = document.getElementById('countrySearch');
        const query = searchInput.value.trim();

        if (!query) {
            this.alertManager.showAlert('Please enter a country name', 'warning');
            return;
        }

        try {
            this.showLoading(true);
            const countryData = await this.countryService.searchCountry(query);
            
            if (countryData && countryData.length > 0) {
                this.displaySearchResults(countryData);
                this.alertManager.showAlert(`Found information for ${countryData[0].name.common}`, 'success');
            } else {
                this.alertManager.showAlert('Country not found. Please try a different name.', 'danger');
            }
        } catch (error) {
            console.error('Search error:', error);
            this.alertManager.showAlert('An error occurred while searching. Please try again.', 'danger');
        } finally {
            this.showLoading(false);
        }
    }

    async handleQuickSearch(event) {
        const countryName = event.target.getAttribute('data-country');
        document.getElementById('countrySearch').value = countryName;
        
        // Trigger search
        const searchForm = document.getElementById('searchForm');
        if (searchForm) {
            searchForm.dispatchEvent(new Event('submit'));
        }
    }

    handleNewsletter(event) {
        event.preventDefault();
        const email = event.target.querySelector('input[type="email"]').value;
        
        // Simulate newsletter signup
        setTimeout(() => {
            this.alertManager.showAlert(`Thank you for subscribing with ${email}!`, 'success');
            event.target.reset();
        }, 500);
    }

    displaySearchResults(countries) {
        const resultsContainer = document.getElementById('searchResults');
        const resultsSection = document.getElementById('resultsSection');
        
        if (!resultsContainer || !resultsSection) return;

        resultsContainer.innerHTML = '';
        
        countries.forEach(country => {
            const countryCard = this.createCountryCard(country);
            resultsContainer.appendChild(countryCard);
        });

        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    createCountryCard(country) {
        const card = document.createElement('div');
        card.className = 'col-12 mb-4';
        
        const languages = country.languages ? Object.values(country.languages).join(', ') : 'Not available';
        const currencies = country.currencies ? Object.values(country.currencies).map(c => c.name).join(', ') : 'Not available';
        const capital = country.capital ? country.capital[0] : 'Not available';
        const population = country.population ? country.population.toLocaleString() : 'Not available';
        const region = country.region || 'Not available';
        const subregion = country.subregion || 'Not available';
        const area = country.area ? `${country.area.toLocaleString()} km²` : 'Not available';
        const timezones = country.timezones ? country.timezones.join(', ') : 'Not available';

        card.innerHTML = `
            <div class="country-detail-card">
                <div class="country-header">
                    <span class="country-flag">${country.flag}</span>
                    <h2 class="mb-2">${country.name.common}</h2>
                    <p class="mb-0 opacity-75">${country.name.official}</p>
                </div>
                <div class="country-info-grid">
                    <div class="info-item">
                        <div class="info-label">
                            <i class="fas fa-map-marker-alt me-2"></i>Capital
                        </div>
                        <div class="info-value">${capital}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">
                            <i class="fas fa-users me-2"></i>Population
                        </div>
                        <div class="info-value">${population}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">
                            <i class="fas fa-globe me-2"></i>Region
                        </div>
                        <div class="info-value">${region} - ${subregion}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">
                            <i class="fas fa-expand-arrows-alt me-2"></i>Area
                        </div>
                        <div class="info-value">${area}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">
                            <i class="fas fa-language me-2"></i>Languages
                        </div>
                        <div class="info-value">${languages}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">
                            <i class="fas fa-coins me-2"></i>Currencies
                        </div>
                        <div class="info-value">${currencies}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">
                            <i class="fas fa-clock me-2"></i>Timezones
                        </div>
                        <div class="info-value">${timezones}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">
                            <i class="fas fa-car me-2"></i>Driving Side
                        </div>
                        <div class="info-value">${country.car ? country.car.side : 'Not available'}</div>
                    </div>
                </div>
            </div>
        `;

        return card;
    }

    async loadFeaturedDestinations() {
        const containers = ['popularDestinations', 'featuredDestinations'];
        const featuredCountries = ['france', 'japan', 'italy', 'australia', 'brazil', 'canada'];
        
        for (const containerId of containers) {
            const container = document.getElementById(containerId);
            if (!container) continue;

            try {
                for (const countryName of featuredCountries.slice(0, 3)) {
                    const countryData = await this.countryService.searchCountry(countryName);
                    if (countryData && countryData.length > 0) {
                        const card = this.createDestinationCard(countryData[0]);
                        container.appendChild(card);
                    }
                }
            } catch (error) {
                console.error('Error loading featured destinations:', error);
            }
        }
    }

    createDestinationCard(country) {
        const card = document.createElement('div');
        card.className = 'col-md-4';
        
        const capital = country.capital ? country.capital[0] : 'Not available';
        const population = country.population ? country.population.toLocaleString() : 'Not available';

        card.innerHTML = `
            <div class="destination-card card h-100 border-0 shadow-sm">
                <div class="card-body p-4 text-center destination-info">
                    <span class="destination-flag">${country.flag}</span>
                    <h5 class="card-title fw-bold mb-2">${country.name.common}</h5>
                    <p class="text-muted mb-3">${country.region}</p>
                    <div class="destination-stats">
                        <small class="text-muted">
                            <i class="fas fa-map-marker-alt me-1"></i>Capital: ${capital}<br>
                            <i class="fas fa-users me-1"></i>Population: ${population}
                        </small>
                    </div>
                    <button class="btn btn-outline-primary btn-sm mt-3 explore-btn" 
                            data-country="${country.name.common.toLowerCase()}">
                        <i class="fas fa-info-circle me-1"></i>Explore
                    </button>
                </div>
            </div>
        `;

        // Add event listener for explore button
        const exploreBtn = card.querySelector('.explore-btn');
        exploreBtn.addEventListener('click', () => {
            document.getElementById('countrySearch').value = country.name.common;
            window.location.href = 'destinations.html';
        });

        return card;
    }

    showLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.classList.toggle('d-none', !show);
        }
    }

    showWelcomeMessage() {
        // Show welcome message only on homepage
        if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
            setTimeout(() => {
                this.alertManager.showAlert('Welcome to Skyrate! Start exploring amazing destinations.', 'info');
            }, 1000);
        }
    }
}

// ============================================================
// ALERT MANAGER CLASS - CUSTOM UI REQUIREMENT
// ============================================================
class AlertManager {
    constructor() {
        this.container = document.getElementById('alertContainer');
        this.alerts = [];
    }

    showAlert(message, type = 'info', duration = 5000) {
        const alert = this.createAlert(message, type);
        this.container.appendChild(alert);
        this.alerts.push(alert);

        // Auto-dismiss after duration
        setTimeout(() => {
            this.dismissAlert(alert);
        }, duration);

        return alert;
    }

    createAlert(message, type) {
        const alertId = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const alert = document.createElement('div');
        alert.className = `alert custom-alert alert-${type} alert-dismissible`;
        alert.id = alertId;
        alert.setAttribute('role', 'alert');

        const icon = this.getAlertIcon(type);
        
        alert.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="${icon} me-2"></i>
                <div class="flex-grow-1">${message}</div>
                <button type="button" class="alert-close" onclick="app.alertManager.dismissAlert(document.getElementById('${alertId}'))">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        return alert;
    }

    getAlertIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            info: 'fas fa-info-circle',
            warning: 'fas fa-exclamation-triangle',
            danger: 'fas fa-exclamation-circle'
        };
        return icons[type] || icons.info;
    }

    dismissAlert(alert) {
        if (alert && alert.parentNode) {
            alert.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.parentNode.removeChild(alert);
                }
                this.alerts = this.alerts.filter(a => a !== alert);
            }, 300);
        }
    }

    clearAllAlerts() {
        this.alerts.forEach(alert => this.dismissAlert(alert));
    }
}

// ============================================================
// COUNTRY SERVICE CLASS - API INTEGRATION
// ============================================================
class CountryService {
    constructor() {
        this.baseUrl = 'https://restcountries.com/v3.1';
        this.cache = new Map();
    }

    async searchCountry(query) {
        // Check cache first
        const cacheKey = query.toLowerCase();
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const response = await fetch(`${this.baseUrl}/name/${query}?fullText=false`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    return null;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Cache the result
            this.cache.set(cacheKey, data);
            
            return data;
        } catch (error) {
            console.error('Error fetching country data:', error);
            throw error;
        }
    }

    async getAllCountries() {
        try {
            const response = await fetch(`${this.baseUrl}/all?fields=name,flag,region,population,capital`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching all countries:', error);
            throw error;
        }
    }

    async getCountryByCode(code) {
        try {
            const response = await fetch(`${this.baseUrl}/alpha/${code}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching country by code:', error);
            throw error;
        }
    }
}

// ============================================================
// FEEDBACK MANAGER CLASS - FEEDBACK PAGE FUNCTIONALITY
// ============================================================
class FeedbackManager {
    constructor(alertManager) {
        this.alertManager = alertManager;
        this.currentRating = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupStarRating();
        this.setupCharacterCounter();
    }

    setupEventListeners() {
        const feedbackForm = document.getElementById('feedbackForm');
        if (feedbackForm) {
            feedbackForm.addEventListener('submit', (e) => this.handleFeedbackSubmission(e));
        }
    }

    setupStarRating() {
        const stars = document.querySelectorAll('.star');
        const ratingInput = document.getElementById('rating');
        const ratingText = document.getElementById('ratingText');

        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                this.currentRating = index + 1;
                this.updateStarDisplay();
                if (ratingInput) ratingInput.value = this.currentRating;
                if (ratingText) ratingText.textContent = this.getRatingText(this.currentRating);
            });

            star.addEventListener('mouseenter', () => {
                this.highlightStars(index + 1);
            });
        });

        const starRating = document.getElementById('starRating');
        if (starRating) {
            starRating.addEventListener('mouseleave', () => {
                this.updateStarDisplay();
            });
        }
    }

    setupCharacterCounter() {
        const messageTextarea = document.getElementById('message');
        const charCount = document.getElementById('charCount');

        if (messageTextarea && charCount) {
            messageTextarea.addEventListener('input', () => {
                const length = messageTextarea.value.length;
                charCount.textContent = length;
                
                // Change color based on character count
                charCount.className = length > 450 ? 'text-warning' : 
                                    length > 480 ? 'text-danger' : 'text-primary';
            });
        }
    }

    highlightStars(rating) {
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.classList.toggle('active', index < rating);
        });
    }

    updateStarDisplay() {
        this.highlightStars(this.currentRating);
    }

    getRatingText(rating) {
        const texts = {
            1: 'Poor',
            2: 'Fair',
            3: 'Good',
            4: 'Very Good',
            5: 'Excellent'
        };
        return texts[rating] || 'Click to rate';
    }

    handleFeedbackSubmission(event) {
        event.preventDefault();
        
        const form = event.target;
        
        // Validate form
        if (!form.checkValidity()) {
            event.stopPropagation();
            form.classList.add('was-validated');
            this.alertManager.showAlert('Please fill in all required fields correctly.', 'warning');
            return;
        }

        // Check if rating is provided
        if (this.currentRating === 0) {
            this.alertManager.showAlert('Please provide a rating by clicking on the stars.', 'warning');
            return;
        }

        // Collect form data
        const formData = this.collectFormData(form);
        
        // Simulate form submission
        this.submitFeedback(formData);
    }

    collectFormData(form) {
        return {
            firstName: form.querySelector('#firstName').value,
            lastName: form.querySelector('#lastName').value,
            email: form.querySelector('#email').value,
            feedbackType: form.querySelector('#feedbackType').value,
            rating: this.currentRating,
            message: form.querySelector('#message').value,
            consent: form.querySelector('#consent').checked,
            timestamp: new Date().toISOString()
        };
    }

    async submitFeedback(formData) {
        try {
            // Show loading state
            const submitBtn = document.querySelector('#feedbackForm button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Submitting...';
            submitBtn.disabled = true;

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Store feedback in localStorage
            this.storeFeedback(formData);

            // Success feedback
            this.alertManager.showAlert(
                `Thank you ${formData.firstName}! Your feedback has been submitted successfully. We appreciate your ${this.getRatingText(formData.rating).toLowerCase()} rating!`, 
                'success', 
                8000
            );

            // Reset form
            this.resetForm();

            // Restore button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

        } catch (error) {
            console.error('Error submitting feedback:', error);
            this.alertManager.showAlert('Sorry, there was an error submitting your feedback. Please try again later.', 'danger');
            
            // Restore button
            const submitBtn = document.querySelector('#feedbackForm button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Submit Feedback';
            submitBtn.disabled = false;
        }
    }

    storeFeedback(formData) {
        // Get existing feedback from localStorage
        let storedFeedback = localStorage.getItem('skyrateFeedback');
        let feedbackArray = storedFeedback ? JSON.parse(storedFeedback) : [];

        // Add unique ID and timestamp
        const feedback = {
            ...formData,
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            submittedAt: new Date().toISOString()
        };

        // Add to array
        feedbackArray.push(feedback);

        // Store back to localStorage
        localStorage.setItem('skyrateFeedback', JSON.stringify(feedbackArray));
    }

    resetForm() {
        const form = document.getElementById('feedbackForm');
        if (form) {
            form.reset();
            form.classList.remove('was-validated');
            this.currentRating = 0;
            this.updateStarDisplay();
            
            // Reset rating text and hidden input
            const ratingText = document.getElementById('ratingText');
            const ratingInput = document.getElementById('rating');
            if (ratingText) ratingText.textContent = 'Click to rate';
            if (ratingInput) ratingInput.value = '';
            
            // Reset character counter
            const charCount = document.getElementById('charCount');
            if (charCount) {
                charCount.textContent = '0';
                charCount.className = 'text-primary';
            }
        }
    }
}

// ============================================================
// RATINGS MANAGER CLASS - RATINGS PAGE FUNCTIONALITY
// ============================================================
class RatingsManager {
    constructor(alertManager) {
        this.alertManager = alertManager;
        this.allFeedback = [];
        this.filteredFeedback = [];
        this.init();
    }

    init() {
        if (window.location.pathname.includes('ratings.html')) {
            this.loadFeedback();
            this.setupEventListeners();
            this.displayStatistics();
            this.displayReviews();
        }
    }

    setupEventListeners() {
        const ratingFilter = document.getElementById('ratingFilter');
        const typeFilter = document.getElementById('typeFilter');
        const sortFilter = document.getElementById('sortFilter');

        if (ratingFilter) ratingFilter.addEventListener('change', () => this.applyFilters());
        if (typeFilter) typeFilter.addEventListener('change', () => this.applyFilters());
        if (sortFilter) sortFilter.addEventListener('change', () => this.applyFilters());
    }

    loadFeedback() {
        const storedFeedback = localStorage.getItem('skyrateFeedback');
        this.allFeedback = storedFeedback ? JSON.parse(storedFeedback) : [];
        this.filteredFeedback = [...this.allFeedback];
    }

    displayStatistics() {
        const totalReviews = this.allFeedback.length;
        const averageRating = totalReviews > 0 ? 
            (this.allFeedback.reduce((sum, feedback) => sum + feedback.rating, 0) / totalReviews).toFixed(1) : 0.0;
        const positiveReviews = this.allFeedback.filter(feedback => feedback.rating >= 4).length;
        
        // Count reviews from this month
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const thisMonthReviews = this.allFeedback.filter(feedback => {
            const feedbackDate = new Date(feedback.submittedAt);
            return feedbackDate.getMonth() === currentMonth && feedbackDate.getFullYear() === currentYear;
        }).length;

        // Update statistics display
        const averageRatingEl = document.getElementById('averageRating');
        const totalReviewsEl = document.getElementById('totalReviews');
        const positiveReviewsEl = document.getElementById('positiveReviews');
        const thisMonthEl = document.getElementById('thisMonth');

        if (averageRatingEl) averageRatingEl.textContent = averageRating;
        if (totalReviewsEl) totalReviewsEl.textContent = totalReviews;
        if (positiveReviewsEl) positiveReviewsEl.textContent = positiveReviews;
        if (thisMonthEl) thisMonthEl.textContent = thisMonthReviews;
    }

    applyFilters() {
        const ratingFilter = document.getElementById('ratingFilter')?.value;
        const typeFilter = document.getElementById('typeFilter')?.value;
        const sortFilter = document.getElementById('sortFilter')?.value || 'newest';

        // Filter feedback
        this.filteredFeedback = this.allFeedback.filter(feedback => {
            const matchesRating = !ratingFilter || feedback.rating.toString() === ratingFilter;
            const matchesType = !typeFilter || feedback.feedbackType === typeFilter;
            return matchesRating && matchesType;
        });

        // Sort feedback
        this.sortFeedback(sortFilter);

        // Re-display reviews
        this.displayReviews();
    }

    sortFeedback(sortBy) {
        switch (sortBy) {
            case 'oldest':
                this.filteredFeedback.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));
                break;
            case 'highest':
                this.filteredFeedback.sort((a, b) => b.rating - a.rating);
                break;
            case 'lowest':
                this.filteredFeedback.sort((a, b) => a.rating - b.rating);
                break;
            case 'newest':
            default:
                this.filteredFeedback.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
                break;
        }
    }

    displayReviews() {
        const reviewsContainer = document.getElementById('reviewsContainer');
        const noReviews = document.getElementById('noReviews');

        if (!reviewsContainer || !noReviews) return;

        if (this.filteredFeedback.length === 0) {
            reviewsContainer.innerHTML = '';
            noReviews.style.display = 'block';
            return;
        }

        noReviews.style.display = 'none';
        reviewsContainer.innerHTML = '';

        this.filteredFeedback.forEach(feedback => {
            const reviewCard = this.createReviewCard(feedback);
            reviewsContainer.appendChild(reviewCard);
        });
    }

    createReviewCard(feedback) {
        const card = document.createElement('div');
        card.className = 'review-card card border-0 shadow-sm mb-4';

        const initials = (feedback.firstName.charAt(0) + feedback.lastName.charAt(0)).toUpperCase();
        const stars = '★'.repeat(feedback.rating) + '☆'.repeat(5 - feedback.rating);
        const date = new Date(feedback.submittedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const typeColors = {
            general: 'bg-primary',
            bug: 'bg-danger',
            feature: 'bg-success',
            design: 'bg-info',
            content: 'bg-warning',
            other: 'bg-secondary'
        };

        card.innerHTML = `
            <div class="card-body p-4">
                <div class="d-flex align-items-start">
                    <div class="review-avatar me-3">
                        ${initials}
                    </div>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <h5 class="fw-bold mb-1">${feedback.firstName} ${feedback.lastName}</h5>
                                <div class="review-stars mb-1">${stars}</div>
                                <div class="review-date">${date}</div>
                            </div>
                            <div class="review-type ${typeColors[feedback.feedbackType] || 'bg-secondary'} text-white">
                                ${feedback.feedbackType}
                            </div>
                        </div>
                        <div class="review-message">
                            <p class="mb-0">${feedback.message}</p>
                        </div>
                        <div class="review-meta mt-2">
                            <small class="text-muted">
                                <i class="fas fa-envelope me-1"></i>${feedback.email}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return card;
    }
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

// Smooth scroll to features section
function scrollToFeatures() {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Contact alert function for feedback page
function showContactAlert() {
    if (window.app) {
        window.app.alertManager.showAlert('Email: info@skyrate.com | Our team will respond within 24 hours', 'info', 8000);
    }
}

// Phone alert function for feedback page
function showPhoneAlert() {
    if (window.app) {
        window.app.alertManager.showAlert('Phone: +1 (555) 123-4567 | Available Mon-Fri 9AM-6PM EST', 'info', 8000);
    }
}

// Contact alert function for about page
function showContactAlert() {
    if (window.app) {
        window.app.alertManager.showAlert('Email: sola.sarkis@skyrate.com | Phone: +1 (555) 123-4567', 'info', 8000);
    }
}

// LinkedIn alert function for about page
function showLinkedInAlert() {
    if (window.app) {
        window.app.alertManager.showAlert('Connect with Sola Sarkis on LinkedIn: linkedin.com/in/sola-sarkis', 'info', 8000);
    }
}

// Format number with commas
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Debounce function for search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SkyrateTravelApp();
    
    // Add some interactive effects
    addInteractiveEffects();
});

// Add interactive effects
function addInteractiveEffects() {
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = heroSection.querySelector('.hero-overlay');
            if (parallax) {
                parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    }

    // Animate cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards
    document.querySelectorAll('.card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Add hover effects to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.backgroundColor = 'rgba(44, 62, 80, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.backgroundColor = '';
                navbar.style.backdropFilter = '';
            }
        });
    }
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Recalculate any responsive elements if needed
    const alertContainer = document.getElementById('alertContainer');
    if (alertContainer && window.innerWidth < 768) {
        alertContainer.style.left = '10px';
        alertContainer.style.right = '10px';
        alertContainer.style.maxWidth = 'none';
    } else if (alertContainer) {
        alertContainer.style.left = '';
        alertContainer.style.right = '20px';
        alertContainer.style.maxWidth = '400px';
    }
}, 250));

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SkyrateTravelApp,
        AlertManager,
        CountryService
    };
} 