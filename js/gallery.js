/**
 * Gallery.js - Dynamic gallery generator based on filename parsing
 *
 * Filename format: category_order_description.jpg
 * Example: conference_01_ICML 2025 Poster Session.jpg
 *
 * Categories:
 * - conference: Conference Moments
 * - activity: Group Activities
 * - lablife: Lab Life
 * - campus: UNC Campus
 */

(function() {
    'use strict';

    // Category configuration
    const CATEGORIES = {
        conference: {
            title: 'Conference Moments',
            description: 'Snapshots from major AI/ML conferences where we present our research and connect with the community.',
            anchor: 'conferences'
        },
        activity: {
            title: 'Group Activities',
            description: 'Group meetings, seminars, and academic discussions that foster collaboration and learning.',
            anchor: 'group-activities'
        },
        lablife: {
            title: 'Lab Life',
            description: 'Beyond research - celebrations, team building, and the moments that make our lab feel like a family.',
            anchor: 'lab-life'
        },
        campus: {
            title: 'UNC Chapel Hill Campus',
            description: 'The beautiful University of North Carolina at Chapel Hill campus - our academic home. Go Tar Heels!',
            anchor: 'campus'
        }
    };

    // Image list - this will be populated by scanning the gallery folder
    // For GitHub Pages, we need to maintain this list manually or use a build script
    const GALLERY_IMAGES = [
        'conference_01_ICML 2025 Poster Session.jpg',
        'conference_02_NeurIPS 2024.jpg',
        'conference_03_AAAI 2025 Presentation.jpg',
        'conference_04_ICLR 2025 Workshop.jpg',
        'activity_01_Weekly Group Meeting.jpg',
        'activity_02_Research Seminar.jpg',
        'activity_03_Paper Reading Session.jpg',
        'lablife_01_Welcome Dinner 2024.jpg',
        'lablife_02_Lab Celebration.jpg',
        'lablife_03_Team Hiking Trip.jpg',
        'lablife_04_Birthday Party.jpg',
        'campus_01_Old Well.jpg',
        'campus_02_Wilson Library.jpg',
        'campus_03_Sitterson Hall.jpg',
        'campus_04_Campus in Fall.jpg'
    ];

    /**
     * Parse filename to extract category, order, and description
     * @param {string} filename - The image filename
     * @returns {Object|null} - Parsed info or null if invalid format
     */
    function parseFilename(filename) {
        // Remove extension
        const nameWithoutExt = filename.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');

        // Split by underscore (only first two underscores)
        const parts = nameWithoutExt.split('_');

        if (parts.length < 3) {
            console.warn('Invalid filename format:', filename);
            return null;
        }

        const category = parts[0].toLowerCase();
        const order = parseInt(parts[1], 10);
        const description = parts.slice(2).join('_'); // Rejoin in case description has underscores

        if (!CATEGORIES[category]) {
            console.warn('Unknown category:', category, 'in file:', filename);
            return null;
        }

        return {
            filename: filename,
            category: category,
            order: order,
            description: description
        };
    }

    /**
     * Group images by category
     * @param {Array} images - List of image filenames
     * @returns {Object} - Images grouped by category
     */
    function groupByCategory(images) {
        const grouped = {};

        // Initialize categories
        Object.keys(CATEGORIES).forEach(cat => {
            grouped[cat] = [];
        });

        // Parse and group
        images.forEach(filename => {
            const parsed = parseFilename(filename);
            if (parsed) {
                grouped[parsed.category].push(parsed);
            }
        });

        // Sort each category by order
        Object.keys(grouped).forEach(cat => {
            grouped[cat].sort((a, b) => a.order - b.order);
        });

        return grouped;
    }

    /**
     * Generate HTML for a single gallery item
     * @param {Object} item - Parsed image info
     * @param {string} category - Category key for fancybox grouping
     * @returns {string} - HTML string
     */
    function generateItemHTML(item, category) {
        const imagePath = 'gallery/' + item.filename;
        return `
            <div class="gallery-item">
                <a href="${imagePath}" data-fancybox="${category}" data-caption="${item.description}">
                    <img src="${imagePath}" alt="${item.description}" loading="lazy">
                </a>
                <p class="gallery-caption">${item.description}</p>
            </div>
        `;
    }

    /**
     * Generate HTML for a category section
     * @param {string} categoryKey - Category key
     * @param {Array} items - Parsed image items
     * @returns {string} - HTML string
     */
    function generateSectionHTML(categoryKey, items) {
        const config = CATEGORIES[categoryKey];

        if (items.length === 0) {
            return ''; // Skip empty categories
        }

        const itemsHTML = items.map(item => generateItemHTML(item, categoryKey)).join('');

        return `
            <div class="row" style="margin-top: 40px;">
                <div class="col-lg-12" id="${config.anchor}">
                    <div class="section-title" style="margin-bottom:20px">
                        <h2>${config.title}</h2>
                    </div>
                    <p class="gallery-section-desc">${config.description}</p>
                    <div class="gallery-grid">
                        ${itemsHTML}
                    </div>
                    <p class="back-to-top"><a href="#top">Back to Top</a></p>
                </div>
            </div>
        `;
    }

    /**
     * Generate quick navigation links
     * @param {Object} grouped - Grouped images
     * @returns {string} - HTML string
     */
    function generateQuickNav(grouped) {
        const links = [];

        Object.keys(CATEGORIES).forEach(cat => {
            if (grouped[cat] && grouped[cat].length > 0) {
                const config = CATEGORIES[cat];
                links.push(`<a href="#${config.anchor}">${config.title}</a>`);
            }
        });

        return links.join(' | ');
    }

    /**
     * Initialize the gallery
     */
    function initGallery() {
        const container = document.getElementById('gallery-container');
        const navContainer = document.getElementById('gallery-nav');

        if (!container) {
            console.error('Gallery container not found');
            return;
        }

        // Group images
        const grouped = groupByCategory(GALLERY_IMAGES);

        // Generate navigation
        if (navContainer) {
            navContainer.innerHTML = generateQuickNav(grouped);
        }

        // Generate sections
        let sectionsHTML = '';
        Object.keys(CATEGORIES).forEach(cat => {
            sectionsHTML += generateSectionHTML(cat, grouped[cat]);
        });

        container.innerHTML = sectionsHTML;

        // Initialize fancybox if available
        if (typeof $.fancybox !== 'undefined') {
            $('[data-fancybox]').fancybox({
                loop: true,
                buttons: ['zoom', 'close'],
                caption: function(instance, item) {
                    return $(this).data('caption') || '';
                }
            });
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGallery);
    } else {
        initGallery();
    }

    // Export for external use
    window.GalleryModule = {
        CATEGORIES: CATEGORIES,
        GALLERY_IMAGES: GALLERY_IMAGES,
        parseFilename: parseFilename,
        refresh: initGallery
    };

})();
