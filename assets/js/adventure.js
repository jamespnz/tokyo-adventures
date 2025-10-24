/* ========================================
   Tokyo Adventures - Interactive Magic
   "Endless Enchantment" Functionality
   ======================================== */

// ========== Global State ==========
let currentAttractions = [];
let currentModal = null;

// ========== CSV Parser ==========
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = parseCSVLine(lines[0]);
    const attractions = [];

    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const values = parseCSVLine(lines[i]);
            const attraction = {};
            
            headers.forEach((header, index) => {
                attraction[header.trim()] = values[index] ? values[index].trim() : '';
            });
            
            attractions.push(attraction);
        }
    }

    return attractions;
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result;
}

// ========== Load Attractions from CSV ==========
async function loadAttractions(csvFilename) {
    const loadingState = document.querySelector('.loading-state');
    const attractionsGrid = document.getElementById('attractionsGrid');
    
    try {
        // Try GitHub first
        let response = await fetch(`https://raw.githubusercontent.com/jamespnz/tokyo-adventures/main/data/${csvFilename}`);
        
        // Fallback to local
        if (!response.ok) {
            response = await fetch(`../data/${csvFilename}`);
        }
        
        if (!response.ok) {
            throw new Error('Failed to load attractions data');
        }
        
        const csvText = await response.text();
        currentAttractions = parseCSV(csvText);
        
        console.log(`Loaded ${currentAttractions.length} attractions from ${csvFilename}`);
        
        if (loadingState) {
            loadingState.style.display = 'none';
        }
        
        displayAttractions(currentAttractions);
        
    } catch (error) {
        console.error('Error loading attractions:', error);
        if (loadingState) {
            loadingState.innerHTML = '<p>Unable to load attractions. Please try again later.</p>';
        }
    }
}

// ========== Display Attraction Cards ==========
function displayAttractions(attractions) {
    const grid = document.getElementById('attractionsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    attractions.forEach((attraction, index) => {
        const card = createAttractionCard(attraction, index);
        grid.appendChild(card);
    });
}

function createAttractionCard(attraction, index) {
    const card = document.createElement('div');
    card.className = 'attraction-card';
    card.setAttribute('data-index', index);
    
    // Build experience tags
    const tags = attraction.experience_tags ? attraction.experience_tags.split(',') : [];
    const tagsHTML = tags.length > 0 
        ? `<div class="experience-tags">
            ${tags.map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}
           </div>`
        : '';
    
    // Build entry fee badge
    const entryBadge = attraction.entry_fee && attraction.entry_fee.toLowerCase() === 'free'
        ? '<div class="card-badge">Free Entry</div>'
        : attraction.entry_fee 
        ? `<div class="card-badge">${attraction.entry_fee}</div>`
        : '';
    
    card.innerHTML = `
        <div class="card-image-wrapper">
            <img src="${attraction.image_hero_url || 'https://via.placeholder.com/800x400?text=Image+Coming+Soon'}" 
                 alt="${attraction.attraction_name}" 
                 class="card-image"
                 loading="lazy"
                 onerror="this.src='https://via.placeholder.com/800x400?text=Image+Unavailable'">
            ${entryBadge}
        </div>
        <div class="card-content">
            <h3 class="attraction-name">${attraction.attraction_name}</h3>
            <p class="attraction-name-jp japanese-text">${attraction.attraction_japanese || ''}</p>
            
            <div class="journey-info">
                <span class="icon">🚉</span>
                <span>${attraction.nearest_station || 'Station info coming soon'} • ${attraction.journey_from_shinjuku || 'Journey time TBA'}</span>
            </div>
            
            ${attraction.tagline ? `<p class="tagline">"${attraction.tagline}"</p>` : ''}
            
            <p class="description">${truncateText(attraction.description || '', 180)}</p>
            
            ${tagsHTML}
            
            <button class="explore-btn" onclick="openAttractionModal(${index})">
                Explore This Attraction →
            </button>
        </div>
    `;
    
    return card;
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

// ========== Modal Functionality ==========
function openAttractionModal(index) {
    const attraction = currentAttractions[index];
    if (!attraction) return;
    
    const modal = document.getElementById('attractionModal');
    if (!modal) return;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.innerHTML = generateModalContent(attraction);
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    currentModal = modal;
}

function closeAttractionModal() {
    const modal = document.getElementById('attractionModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentModal = null;
}

function generateModalContent(attraction) {
    // Parse season guide if available
    const seasonGuide = parseSeasonGuide(attraction.best_experienced);
    
    // Parse tips if available
    const tips = attraction.practical_tips ? attraction.practical_tips.split(';') : [];
    
    return `
        <div class="modal-hero">
            <img src="${attraction.image_hero_url || 'https://via.placeholder.com/900x400'}" 
                 alt="${attraction.attraction_name}"
                 class="modal-image"
                 onerror="this.src='https://via.placeholder.com/900x400?text=Image+Unavailable'">
            ${attraction.image_hero_attribution ? `<p class="image-attribution">${attraction.image_hero_attribution}</p>` : ''}
            <div class="modal-title-overlay">
                <h1>${attraction.attraction_name}</h1>
                <p class="japanese-text">${attraction.attraction_japanese || ''}</p>
                ${attraction.tagline ? `<p class="modal-tagline">"${attraction.tagline}"</p>` : ''}
            </div>
        </div>
        
        <div class="modal-body">
            ${generateJourneySection(attraction)}
            ${generateExperienceSection(attraction)}
            ${generateTimingSection(attraction, seasonGuide)}
            ${generateTipsSection(tips)}
            ${generateAdditionalImagesSection(attraction)}
            ${generateNearbySection(attraction)}
            ${generatePracticalInfoSection(attraction)}
        </div>
    `;
}

function generateJourneySection(attraction) {
    return `
        <section class="modal-section">
            <h2>🚉 Your Journey</h2>
            <div class="journey-details">
                <div class="journey-step">
                    <strong>From Shinjuku:</strong>
                    <p>${attraction.journey_from_shinjuku || 'Journey details coming soon'}</p>
                </div>
                <div class="journey-step">
                    <strong>Nearest Station:</strong>
                    <p>${attraction.nearest_station || 'Station info coming soon'}</p>
                </div>
                ${attraction.city ? `
                <div class="journey-step">
                    <strong>Location:</strong>
                    <p>${attraction.city}, ${attraction.prefecture || ''}</p>
                </div>
                ` : ''}
            </div>
        </section>
    `;
}

function generateExperienceSection(attraction) {
    if (!attraction.description && !attraction.why_visit) return '';
    
    return `
        <section class="modal-section">
            <h2>✨ The Experience</h2>
            ${attraction.description ? `<p class="experience-text">${attraction.description}</p>` : ''}
            ${attraction.why_visit ? `<p class="why-visit"><strong>Why visit:</strong> ${attraction.why_visit}</p>` : ''}
        </section>
    `;
}

function generateTimingSection(attraction, seasonGuide) {
    if (!attraction.best_experienced) return '';
    
    return `
        <section class="modal-section">
            <h2>🌸 Best Experienced</h2>
            ${seasonGuide ? seasonGuide : `<p>${attraction.best_experienced}</p>`}
            ${attraction.crowd_level ? `<p><strong>Crowd Level:</strong> ${attraction.crowd_level}</p>` : ''}
        </section>
    `;
}

function generateTipsSection(tips) {
    if (tips.length === 0) return '';
    
    return `
        <section class="modal-section">
            <h2>💡 Insider Knowledge</h2>
            <ul class="tips-list">
                ${tips.map(tip => `<li>${tip.trim()}</li>`).join('')}
            </ul>
        </section>
    `;
}

function generateAdditionalImagesSection(attraction) {
    const images = [];
    
    if (attraction.image_detail_url) {
        images.push({
            url: attraction.image_detail_url,
            attribution: attraction.image_detail_attribution
        });
    }
    
    if (attraction.image_experience_url) {
        images.push({
            url: attraction.image_experience_url,
            attribution: attraction.image_experience_attribution
        });
    }
    
    if (images.length === 0) return '';
    
    return `
        <section class="modal-section">
            <h2>📸 More Views</h2>
            <div class="image-gallery">
                ${images.map(img => `
                    <div class="gallery-item">
                        <img src="${img.url}" 
                             alt="Additional view"
                             class="gallery-image"
                             loading="lazy"
                             onerror="this.src='https://via.placeholder.com/400x300?text=Image+Unavailable'">
                        ${img.attribution ? `<p class="image-attribution">${img.attribution}</p>` : ''}
                    </div>
                `).join('')}
            </div>
        </section>
    `;
}

function generateNearbySection(attraction) {
    if (!attraction.nearby_attractions) return '';
    
    return `
        <section class="modal-section">
            <h2>🗺️ Continue Your Adventure</h2>
            <p>${attraction.nearby_attractions}</p>
        </section>
    `;
}

function generatePracticalInfoSection(attraction) {
    const hasInfo = attraction.entry_fee || attraction.accessibility || attraction.official_website;
    if (!hasInfo) return '';
    
    return `
        <section class="modal-section">
            <h2>ℹ️ Practical Information</h2>
            <div class="practical-info">
                ${attraction.entry_fee ? `<p><strong>Entry Fee:</strong> ${attraction.entry_fee}</p>` : ''}
                ${attraction.accessibility ? `<p><strong>Accessibility:</strong> ${attraction.accessibility}</p>` : ''}
                ${attraction.official_website ? `<p><strong>Website:</strong> <a href="${attraction.official_website}" target="_blank" rel="noopener">${attraction.official_website}</a></p>` : ''}
            </div>
        </section>
    `;
}

function parseSeasonGuide(bestExperienced) {
    if (!bestExperienced) return null;
    
    // Check if it contains seasonal information
    if (bestExperienced.includes('Spring') || bestExperienced.includes('Summer') || 
        bestExperienced.includes('Autumn') || bestExperienced.includes('Winter')) {
        // Return formatted season guide
        return `<div class="season-guide">${bestExperienced}</div>`;
    }
    
    return null;
}

// ========== Mobile Menu Toggle ==========
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav-zones');
    
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            toggle.classList.toggle('active');
        });
    }
}

// ========== Smooth Scroll for Anchor Links ==========
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========== Modal Event Listeners ==========
function initModalListeners() {
    const modal = document.getElementById('attractionModal');
    if (!modal) return;
    
    // Close on backdrop click
    const backdrop = modal.querySelector('.modal-backdrop');
    if (backdrop) {
        backdrop.addEventListener('click', closeAttractionModal);
    }
    
    // Close on close button click
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeAttractionModal);
    }
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && currentModal) {
            closeAttractionModal();
        }
    });
}

// ========== Image Lazy Loading Observer ==========
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ========== Scroll Animations ==========
function initScrollAnimations() {
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.zone-card, .attraction-card, .tip-card');
        
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.9;
            
            if (isVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initial check
    animateOnScroll();
    
    // Check on scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(animateOnScroll);
    });
}

// ========== Initialize Everything ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Tokyo Adventures - Initializing...');
    
    initMobileMenu();
    initSmoothScroll();
    initModalListeners();
    initLazyLoading();
    initScrollAnimations();
    
    console.log('✨ Tokyo Adventures - Ready for endless enchantment!');
});

// ========== Utility Functions ==========
function formatDistance(distance) {
    if (!distance) return '';
    return distance.replace('km', ' km').replace('min', ' min');
}

function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Make functions available globally
window.loadAttractions = loadAttractions;
window.openAttractionModal = openAttractionModal;
window.closeAttractionModal = closeAttractionModal;
