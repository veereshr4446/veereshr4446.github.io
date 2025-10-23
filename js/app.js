// Enhanced Portfolio Application
class PortfolioApp {
    constructor() {
        this.currentSection = 'home';
        this.isScrolling = false;
        this.scrollDirection = 'down';
        this.sections = ['home', 'stats', 'skills', 'projects', 'education', 'achievements', 'testimonials', 'blog', 'contact'];
        this.scrollThreshold = 100;
        this.scrollTimeout = null;
        this.isDarkTheme = true;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.setupFormHandling();
        this.initializeAnimations();
        this.setupSmoothScroll();
        this.showSection('home');
        this.initializeTypingEffect();
        this.setupStatsCounter();
        this.hideLoadingScreen();
    }

    setupEventListeners() {
        // Desktop Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                this.navigateToSection(section);
                this.closeMobileMenu();
            });
        });

        // Mobile Navigation
        document.querySelectorAll('.mobile-nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                this.navigateToSection(section);
                this.closeMobileMenu();
            });
        });

        // Mobile menu buttons
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenuClose = document.querySelector('.mobile-menu-close');
        const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => this.openMobileMenu());
        }

        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', () => this.closeMobileMenu());
        }

        if (mobileMenuOverlay) {
            mobileMenuOverlay.addEventListener('click', (e) => {
                if (e.target === mobileMenuOverlay) {
                    this.closeMobileMenu();
                }
            });
        }

        // CTA button
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', () => {
                this.navigateToSection('projects');
            });
        }

        // Chat button
        const chatButton = document.querySelector('.chat-btn');
        if (chatButton) {
            chatButton.addEventListener('click', () => {
                this.openChat();
            });
        }

        // Theme toggle
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Back to top button
        const backToTop = document.querySelector('.back-to-top');
        if (backToTop) {
            backToTop.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToTop();
            });
        }

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });

        // Enhanced scroll effects
        window.addEventListener('scroll', () => {
            this.handleScroll();
            this.toggleBackToTop();
        });
    }

    setupSmoothScroll() {
        // Enable smooth scrolling between sections
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            this.scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
            lastScrollTop = scrollTop;

            // Update active navigation based on scroll position
            this.updateActiveNavOnScroll();
        });

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                this.scrollDirection = e.key === 'ArrowDown' ? 'down' : 'up';
                this.handleSmoothScroll();
            }
        });
    }

    updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('.section');
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        let currentSection = 'home';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // Check if section is in viewport
            if (scrollY >= sectionTop - windowHeight * 0.3 && 
                scrollY < sectionTop + sectionHeight - windowHeight * 0.3) {
                currentSection = section.id;
            }
        });

        this.updateActiveNav(currentSection);
    }

    openMobileMenu() {
        const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
        const body = document.body;
        
        mobileMenuOverlay.classList.add('active');
        body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
        const body = document.body;
        
        mobileMenuOverlay.classList.remove('active');
        body.style.overflow = '';
    }

    setupNavigation() {
        // Update active navigation item based on scroll position
        const sections = document.querySelectorAll('.section');
        const navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.updateActiveNav(sectionId);
                    this.currentSection = sectionId;
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '-50% 0px -50% 0px'
        });

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    updateActiveNav(sectionId) {
        // Update desktop nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === sectionId) {
                item.classList.add('active');
            }
        });

        // Update mobile nav
        document.querySelectorAll('.mobile-nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === sectionId) {
                item.classList.add('active');
            }
        });
    }

    navigateToSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            // Use smooth scroll with proper offset for fixed navigation
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            this.updateActiveNav(sectionId);
            this.showSection(sectionId);
        }
    }

    showSection(sectionId) {
        // Update current section
        this.currentSection = sectionId;
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    toggleBackToTop() {
        const backToTop = document.querySelector('.back-to-top');
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    openChat() {
        // Simple chat implementation
        const email = 'alex@example.com';
        const subject = 'Portfolio Inquiry';
        const body = 'Hello Alex! I would like to get in touch with you regarding...';
        
        const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoLink, '_blank');
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        const themeToggle = document.querySelector('.theme-toggle span');
        
        if (this.isDarkTheme) {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '🌙';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeToggle.textContent = '☀️';
        }
    }

    setupFormHandling() {
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(contactForm);
            });
        }
    }

    async handleFormSubmit(form) {
        const formData = new FormData(form);
        const submitButton = form.querySelector('.submit-btn');
        const originalText = submitButton.innerHTML;

        try {
            // Show loading state
            submitButton.innerHTML = 'Sending...';
            submitButton.disabled = true;

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success message
            this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();

        } catch (error) {
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 1rem;
            max-width: 400px;
        `;

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    initializeAnimations() {
        // Initialize any additional animations
        this.animateHeroSection();
    }

    animateHeroSection() {
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .social-links, .cta-button');
        heroElements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.2}s`;
        });
    }

    initializeTypingEffect() {
        const texts = [
            "Creative Developer",
            "UI/UX Enthusiast",
            "Problem Solver",
            "Tech Innovator"
        ];
        let count = 0;
        let index = 0;
        let currentText = '';
        let letter = '';

        (function type() {
            if (count === texts.length) {
                count = 0;
            }
            currentText = texts[count];
            letter = currentText.slice(0, ++index);

            document.querySelector('.typing-text').textContent = letter;
            if (letter.length === currentText.length) {
                setTimeout(() => {
                    index = 0;
                    count++;
                    setTimeout(type, 500);
                }, 2000);
            } else {
                setTimeout(type, 100);
            }
        }());
    }

    setupStatsCounter() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumber = entry.target;
                    const target = parseInt(statNumber.getAttribute('data-count'));
                    const duration = 2000; // 2 seconds
                    const step = target / (duration / 16); // 60fps
                    let current = 0;

                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        statNumber.textContent = Math.floor(current);
                    }, 16);
                    
                    // Stop observing after animation starts
                    observer.unobserve(statNumber);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 1500);
    }

    handleScroll() {
        // Enhanced scroll effects
        const sections = document.querySelectorAll('.section');
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // Check if section is in viewport
            if (scrollY > sectionTop - windowHeight * 0.7 && 
                scrollY < sectionTop + sectionHeight - windowHeight * 0.3) {
                
                // Add animation class
                if (!section.classList.contains('animate-in')) {
                    section.classList.add('animate-in');
                }
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const portfolioApp = new PortfolioApp();
    
    // Make app globally available for debugging
    window.portfolioApp = portfolioApp;
});