/**
 * animations.js - Site-wide scroll animation handler
 * Automatically injects AOS (Animate On Scroll) attributes to elements
 */

(function() {
    'use strict';

    /**
     * Animation configuration for different element types
     */
    const ANIMATION_CONFIG = {
        // Section titles
        sectionTitle: {
            selector: '.section-title',
            aos: 'fade-up',
            duration: 300
        },

        // Member cards (group.html)
        memberCard: {
            selector: '.member-card',
            aos: 'fade-up',
            duration: 300,
            stagger: true,
            staggerDelay: 50,
            staggerReset: 4  // Reset delay every 4 items (per row)
        },

        // News entries (index.html)
        newsEntry: {
            selector: '.trend-contents > b, .trend-contents > ul',
            aos: 'fade-up',
            duration: 250,
            stagger: true,
            staggerDelay: 30,
            staggerReset: 0  // No reset
        },

        // Sponsor section
        sponsorSection: {
            selector: '.sponsor-section',
            aos: 'fade-up',
            duration: 350
        },

        // Sponsor logos
        sponsorLogo: {
            selector: '.sponsor-logo',
            aos: 'fade-up',
            duration: 250,
            stagger: true,
            staggerDelay: 30,
            staggerReset: 0
        },

        // Publication sections
        publicationSection: {
            selector: '.trend-entry',
            aos: 'fade-up',
            duration: 300,
            stagger: true,
            staggerDelay: 60,
            staggerReset: 0
        },

        // Research area cards
        researchCard: {
            selector: '.research-card, .site-section .row > .col-lg-6',
            aos: 'fade-up',
            duration: 300,
            stagger: true,
            staggerDelay: 60,
            staggerReset: 2
        },

        // Quick navigation
        quickNav: {
            selector: '.publication-nav, [href^="#"]:not(.back-to-top a)',
            aos: 'fade-up',
            duration: 250,
            delay: 50
        },

        // Generic list items in site sections
        listItems: {
            selector: '.site-section ul:not(.site-menu) > li',
            aos: 'fade-up',
            duration: 200,
            stagger: true,
            staggerDelay: 20,
            staggerReset: 0,
            maxItems: 20  // Limit to avoid too many animations
        }
    };

    /**
     * Apply AOS attributes to elements matching a config
     * @param {Object} config - Animation configuration object
     */
    function applyAnimation(config) {
        const elements = document.querySelectorAll(config.selector);

        if (elements.length === 0) return;

        // Limit items if maxItems is set
        const maxItems = config.maxItems || elements.length;

        elements.forEach((el, index) => {
            // Skip if already has AOS attribute
            if (el.hasAttribute('data-aos')) return;

            // Skip if beyond max items
            if (index >= maxItems) return;

            // Set base animation
            el.setAttribute('data-aos', config.aos);

            // Set duration
            if (config.duration) {
                el.setAttribute('data-aos-duration', config.duration);
            }

            // Calculate delay
            let delay = config.delay || 0;

            if (config.stagger) {
                const staggerIndex = config.staggerReset > 0
                    ? index % config.staggerReset
                    : index;
                delay += staggerIndex * config.staggerDelay;
            }

            if (delay > 0) {
                el.setAttribute('data-aos-delay', delay);
            }

            // Set once (animate only once)
            el.setAttribute('data-aos-once', 'true');
        });
    }

    /**
     * Initialize all animations
     */
    function initAnimations() {
        // Apply each animation config
        Object.values(ANIMATION_CONFIG).forEach(config => {
            applyAnimation(config);
        });

        // Refresh AOS to recognize new attributes
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    /**
     * Initialize AOS with custom settings if not already initialized
     */
    function initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 300,
                easing: 'ease-out-cubic',
                once: true,  // Only animate once
                offset: 30,  // Offset from viewport
                disable: 'mobile'  // Disable on mobile for performance
            });
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initAOS();
            initAnimations();
        });
    } else {
        initAOS();
        initAnimations();
    }

    // Export for external use
    window.SiteAnimations = {
        config: ANIMATION_CONFIG,
        refresh: initAnimations
    };

})();
