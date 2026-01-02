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
        // Conference photos
        'conference_01_NeurIPS 2024 - Xinyu, Pingzhi with Prof Ang Li and Students.jpg',
        'conference_02_NeurIPS 2024 - Xinyu, Sukwon, Pingzhi with Prof Xia Hu.jpg',
        'conference_03_NeurIPS 2024 - Xinyu, Pingzhi, Sukwon with Prof Ying Ding and Yuli Wang.jpg',
        'conference_04_Dec 2024 - Pingzhi, Xinyu Presenting Model GLUE at NeurIPS 2024.jpg',
        'conference_05_Dec 2025 - Pingzhi Presenting Mozart at NeurIPS 2025.jpg',
        'conference_06_Dec 2025 - Huaizhi Presenting BetaConform at NeurIPS 2025.jpeg',
        // Activity photos
        'activity_01_Feb 2025 - Prof Chen Presenting C2R Paper.jpg',
        // Lab Life photos
        'lablife_01_Aug 2024 - First PhD Cohort at Welcome Ceremony.jpg',
        'lablife_02_Aug 2024 - First Lab Lunch, Texas Style BBQ.jpg',
        'lablife_03_Oct 2024 - Matcha Cake for September Birthdays.jpg',
        'lablife_04_Oct 2024 - Meetup with NCSU Prof Kaixiong Zhou at Mr Tokyo.jpg',
        'lablife_05_Oct 2024 - Hiking After Meetup.jpg',
        'lablife_06_Nov 2024 - Lab T-Shirt Design Draft.png',
        'lablife_07_Jan 2025 - Lunch at So Hot Pot.jpg',
        'lablife_08_Apr 2025 - Mango Cake for April Birthdays.jpg',
        'lablife_09_Apr 2025 - Hotpot Lab Lunch.jpg',
        'lablife_10_Aug 2025 - Board Games After Lunch.jpg',
        'lablife_11_Sep 2025 - Dinner with HireEZ CEO at Szechuan Village.jpg',
        "lablife_12_Sep 2025 - Close Collaborator Zhen Tan's Job Talk Visit.jpg",
        'lablife_13_Oct 2025 - First Dinner with Zhen Tan and New Students.jpg',
        'lablife_14_Nov 2025 - Group Meeting Dinner.jpg',
        'lablife_15_Dec 2025 - Dinner with Collaborators from China.jpg',
        // Campus photos
        'campus_01_Old Well - UNC Landmark.jpg',
        'campus_02_Wilson Library.jpg'
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
     * @param {number} index - Item index for staggered animation delay
     * @returns {string} - HTML string
     */
    function generateItemHTML(item, category, index) {
        const imagePath = 'gallery/' + item.filename;
        const delay = (index % 4) * 50; // Stagger by column position (0, 50, 100, 150ms)
        return `
            <div class="gallery-item" data-aos="fade-up" data-aos-delay="${delay}" data-aos-duration="300">
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

        const itemsHTML = items.map((item, index) => generateItemHTML(item, categoryKey, index)).join('');

        return `
            <div class="row" style="margin-top: 40px;">
                <div class="col-lg-12" id="${config.anchor}">
                    <div class="section-title" style="margin-bottom:20px" data-aos="fade-up" data-aos-duration="300">
                        <h2>${config.title}</h2>
                    </div>
                    <p class="gallery-section-desc" data-aos="fade-up" data-aos-duration="300" data-aos-delay="50">${config.description}</p>
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

        // Add timeline link
        links.push('<a href="#timeline">Timeline</a>');

        return links.join(' | ');
    }

    // Month names for timeline
    const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const MONTH_MAP = {
        'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
        'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
    };

    /**
     * Parse date from description (e.g., "Aug 2024 - First Lab Dinner")
     * @param {string} description - The image description
     * @returns {Object|null} - {year, month, monthName, event} or null
     */
    function parseDateFromDescription(description) {
        // Match patterns like "Aug 2024", "Dec 2025", etc.
        const match = description.match(/^([A-Za-z]{3})\s+(\d{4})\s*-\s*(.+)$/);
        if (!match) return null;

        const monthStr = match[1].toLowerCase();
        const year = parseInt(match[2], 10);
        const event = match[3].trim();
        const month = MONTH_MAP[monthStr];

        if (month === undefined) return null;

        return {
            year: year,
            month: month,
            monthName: MONTH_NAMES[month],
            event: event
        };
    }

    /**
     * Group images by year and month for timeline
     * @param {Array} images - List of image filenames
     * @returns {Object} - {year: {month: [items]}}
     */
    function groupByYearMonth(images) {
        const grouped = {};

        images.forEach(filename => {
            const parsed = parseFilename(filename);
            if (!parsed) return;

            const dateInfo = parseDateFromDescription(parsed.description);
            if (!dateInfo) return;

            const { year, month } = dateInfo;

            if (!grouped[year]) {
                grouped[year] = {};
            }
            if (!grouped[year][month]) {
                grouped[year][month] = [];
            }

            grouped[year][month].push({
                ...parsed,
                dateInfo: dateInfo
            });
        });

        return grouped;
    }

    /**
     * Generate HTML for timeline photo item
     * @param {Object} item - Parsed image info with dateInfo
     * @returns {string} - HTML string
     */
    function generateTimelinePhotoHTML(item) {
        const imagePath = 'gallery/' + item.filename;
        // Use full description instead of just event
        return `
            <div class="timeline-photo">
                <a href="${imagePath}" data-fancybox="timeline" data-caption="${item.description}">
                    <img src="${imagePath}" alt="${item.description}" loading="lazy">
                </a>
                <span class="timeline-photo-caption">${item.description}</span>
            </div>
        `;
    }

    /**
     * Generate HTML for a month entry in timeline
     * @param {number} month - Month index (0-11)
     * @param {Array} items - Items for this month
     * @param {number} index - Index for animation delay
     * @returns {string} - HTML string
     */
    function generateTimelineMonthHTML(month, items, index) {
        const monthName = MONTH_NAMES[month];
        const photosHTML = items.map(item => generateTimelinePhotoHTML(item)).join('');
        const delay = (index % 6) * 30;

        return `
            <div class="timeline-entry" data-aos="fade-up" data-aos-delay="${delay}" data-aos-duration="300">
                <div class="timeline-month">${monthName}</div>
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <div class="timeline-photos">
                        ${photosHTML}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Generate HTML for a year section in timeline
     * @param {number} year - The year
     * @param {Object} months - {month: [items]}
     * @returns {string} - HTML string
     */
    function generateTimelineYearHTML(year, months) {
        // Sort months in ascending order (Jan to Dec)
        const sortedMonths = Object.keys(months)
            .map(m => parseInt(m, 10))
            .sort((a, b) => a - b);

        let monthsHTML = '';
        sortedMonths.forEach((month, index) => {
            monthsHTML += generateTimelineMonthHTML(month, months[month], index);
        });

        return `
            <div class="timeline-year-section">
                <div class="timeline-year" data-aos="fade-up" data-aos-duration="300">${year}</div>
                <div class="timeline-line">
                    ${monthsHTML}
                </div>
            </div>
        `;
    }

    /**
     * Generate the complete timeline HTML
     * @param {Object} grouped - Images grouped by year and month
     * @returns {string} - HTML string
     */
    function generateTimelineHTML(grouped) {
        // Sort years in ascending order (earlier first)
        const sortedYears = Object.keys(grouped)
            .map(y => parseInt(y, 10))
            .sort((a, b) => a - b);

        if (sortedYears.length === 0) {
            return '';
        }

        let yearsHTML = '';
        sortedYears.forEach(year => {
            yearsHTML += generateTimelineYearHTML(year, grouped[year]);
        });

        return `
            <div class="row" style="margin-top: 40px;">
                <div class="col-lg-12" id="timeline">
                    <div class="section-title" style="margin-bottom:20px" data-aos="fade-up" data-aos-duration="300">
                        <h2>Timeline</h2>
                    </div>
                    <p class="gallery-section-desc" data-aos="fade-up" data-aos-duration="300" data-aos-delay="50">A chronological journey through our lab's memorable moments.</p>
                    <div class="timeline-container">
                        ${yearsHTML}
                    </div>
                    <p class="back-to-top"><a href="#top">Back to Top</a></p>
                </div>
            </div>
        `;
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

        // Group images by category
        const grouped = groupByCategory(GALLERY_IMAGES);

        // Group images by year/month for timeline
        const timelineGrouped = groupByYearMonth(GALLERY_IMAGES);

        // Generate navigation
        if (navContainer) {
            navContainer.innerHTML = generateQuickNav(grouped);
        }

        // Generate category sections
        let sectionsHTML = '';
        Object.keys(CATEGORIES).forEach(cat => {
            sectionsHTML += generateSectionHTML(cat, grouped[cat]);
        });

        // Generate timeline section
        sectionsHTML += generateTimelineHTML(timelineGrouped);

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

        // Refresh AOS after dynamic content is loaded
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
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
