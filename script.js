/* ============================================
   PORTFOLIO - JAVASCRIPT
   ============================================ */

// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: false,
    mirror: true
});

// ============================================
// Menu Toggle
// ============================================

const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ============================================
// Smooth Scroll for Navigation
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// Navbar Background on Scroll
// ============================================

const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'linear-gradient(180deg, rgba(15, 15, 30, 0.98) 0%, rgba(15, 15, 30, 0.92) 100%)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.4)';
    } else {
        navbar.style.background = 'linear-gradient(180deg, rgba(15, 15, 30, 0.95) 0%, rgba(15, 15, 30, 0.85) 100%)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    }
});

// ============================================
// Canvas Background Animation (3D Effect)
// ============================================

class CanvasBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;
        this.mouse = { x: 0, y: 0 };
        
        this.resizeCanvas();
        this.initParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    resizeCanvas() {
        const heroSection = document.querySelector('.hero');
        this.canvas.width = window.innerWidth;
        this.canvas.height = heroSection.offsetHeight;
    }

    initParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    onMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw particles
        this.particles.forEach((particle, index) => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Bounce off walls
            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;

            // Keep in bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));

            // Draw particle
            this.ctx.fillStyle = `rgba(124, 58, 237, ${particle.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Draw connections between particles
        this.particles.forEach((particle, index) => {
            for (let i = index + 1; i < this.particles.length; i++) {
                const other = this.particles[i];
                const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
                
                if (distance < 100) {
                    this.ctx.strokeStyle = `rgba(124, 58, 237, ${(1 - distance / 100) * 0.2})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.stroke();
                }
            }
        });

        // Attract particles to mouse
        this.particles.forEach(particle => {
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.hypot(dx, dy);
            
            if (distance < 200) {
                const force = (1 - distance / 200) * 0.002;
                particle.speedX += (dx / distance) * force;
                particle.speedY += (dy / distance) * force;
                particle.opacity = Math.min(0.8, particle.opacity + 0.05);
            } else {
                particle.opacity *= 0.95;
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize canvas background
document.addEventListener('DOMContentLoaded', () => {
    new CanvasBackground('canvas-background');
});

// ============================================
// Scroll Parallax Effect
// ============================================

class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('[data-parallax]');
        window.addEventListener('scroll', () => this.update());
    }

    update() {
        this.elements.forEach(element => {
            const scrollPosition = window.scrollY;
            const elementOffset = element.offsetTop;
            const distance = scrollPosition - elementOffset;
            const parallaxValue = distance * 0.5;
            
            element.style.transform = `translateY(${parallaxValue}px)`;
        });
    }
}

// ============================================
// Animated Numbers Counter
// ============================================

class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.sections = document.querySelectorAll('section');
        this.intersectionObserver = new IntersectionObserver(
            (entries) => this.onIntersection(entries),
            { threshold: 0.5 }
        );
        
        this.counters.forEach(counter => {
            this.intersectionObserver.observe(counter.parentElement);
        });
    }

    onIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const counter = entry.target.querySelector('.stat-number');
                if (counter) {
                    this.animateCounter(counter);
                    entry.target.dataset.animated = 'true';
                }
            }
        });
    }

    animateCounter(element) {
        const finalValue = parseInt(element.textContent);
        const duration = 2000;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (easeOutQuad)
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(finalValue * eased);
            
            element.textContent = value + '+';
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CounterAnimation();
});

// ============================================
// Skill Level Animation
// ============================================

class SkillAnimation {
    constructor() {
        this.skillCards = document.querySelectorAll('.skill-card');
        this.intersectionObserver = new IntersectionObserver(
            (entries) => this.onIntersection(entries),
            { threshold: 0.3 }
        );
        
        this.skillCards.forEach(card => {
            this.intersectionObserver.observe(card);
        });
    }

    onIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const levelFill = entry.target.querySelector('.level-fill');
                if (levelFill) {
                    const width = levelFill.style.width;
                    levelFill.style.width = '0';
                    
                    setTimeout(() => {
                        levelFill.style.width = width;
                    }, 100);
                    
                    entry.target.dataset.animated = 'true';
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SkillAnimation();
});

// ============================================
// 3D Hover Effect on Cards (Tilt Effect)
// ============================================

class TiltEffect {
    constructor() {
        this.cards = document.querySelectorAll('.skill-card, .project-card, .formation-card');
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.onMouseMove(e, card));
            card.addEventListener('mouseleave', (e) => this.onMouseLeave(e, card));
        });
    }

    onMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    onMouseLeave(e, card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TiltEffect();
});

// ============================================
// Timeline Animation
// ============================================

class TimelineAnimation {
    constructor() {
        this.timelineItems = document.querySelectorAll('.timeline-item');
        this.intersectionObserver = new IntersectionObserver(
            (entries) => this.onIntersection(entries),
            { threshold: 0.3 }
        );
        
        this.timelineItems.forEach(item => {
            this.intersectionObserver.observe(item);
        });
    }

    onIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TimelineAnimation();
});

// ============================================
// Floating Animation Enhancement
// ============================================

function enhanceFloatingAnimations() {
    const floatingBoxes = document.querySelectorAll('.floating-box');
    
    floatingBoxes.forEach((box, index) => {
        const delay = index * 0.5;
        box.style.animationDelay = `${delay}s`;
    });
}

document.addEventListener('DOMContentLoaded', enhanceFloatingAnimations);

// ============================================
// Scroll Reveal Effect
// ============================================

class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('[data-aos]');
        this.intersectionObserver = new IntersectionObserver(
            (entries) => this.onIntersection(entries),
            { threshold: 0.1 }
        );
        
        this.elements.forEach(element => {
            this.intersectionObserver.observe(element);
        });
    }

    onIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ScrollReveal();
});

// ============================================
// Section Background Animation
// ============================================

function createBackgroundGradient() {
    const sections = document.querySelectorAll('section');
    let scrollPosition = 0;

    window.addEventListener('scroll', () => {
        scrollPosition = window.scrollY;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop - window.innerHeight && scrollPosition <= sectionBottom) {
                const progress = (scrollPosition - sectionTop) / section.offsetHeight;
                const rotation = progress * 360;
                
                section.style.setProperty('--rotation', rotation + 'deg');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', createBackgroundGradient);

// ============================================
// Performance Optimization - Debounce
// ============================================

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

// ============================================
// Contact Button Interactions
// ============================================

class ContactButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.contact-btn');
        this.buttons.forEach(btn => {
            btn.addEventListener('click', (e) => this.onButtonClick(e));
            btn.addEventListener('mouseenter', (e) => this.onHover(e));
        });
    }

    onButtonClick(e) {
        const btn = e.currentTarget;
        btn.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            btn.style.transform = '';
        }, 100);
    }

    onHover(e) {
        const btn = e.currentTarget;
        btn.style.animation = 'none';
        setTimeout(() => {
            btn.style.animation = '';
        }, 10);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ContactButtons();
});

// ============================================
// Typing Animation Effect
// ============================================

class TypingEffect {
    constructor(element, text, speed = 50) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.index = 0;
        this.isTyping = false;
    }

    start() {
        if (this.isTyping) return;
        this.isTyping = true;
        this.element.textContent = '';
        this.type();
    }

    type() {
        if (this.index < this.text.length) {
            this.element.textContent += this.text.charAt(this.index);
            this.index++;
            setTimeout(() => this.type(), this.speed);
        }
    }
}

// ============================================
// Form or Input Interactions (if needed)
// ============================================

function setupInputAnimations() {
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', (e) => {
            e.target.parentElement?.classList.add('focused');
        });
        
        input.addEventListener('blur', (e) => {
            if (!e.target.value) {
                e.target.parentElement?.classList.remove('focused');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', setupInputAnimations);

// ============================================
// Smooth Scroll Behavior
// ============================================

document.addEventListener('wheel', (e) => {
    // Can add custom scroll behavior here if needed
    // For now, using native smooth scroll
}, { passive: true });

// ============================================
// Page Load Animation
// ============================================

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    
    // Add loaded class to trigger animations
    document.querySelectorAll('[data-aos]').forEach(element => {
        element.style.opacity = '0';
    });
});

// ============================================
// Back to Top Button
// ============================================

const backToTopButton = document.getElementById('backToTop');

if (backToTopButton) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// Intersection Observer for Scroll Animations
// ============================================

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

// Observe all elements with data-aos
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-aos]').forEach(element => {
        observer.observe(element);
    });
});

// ============================================
// Custom Cursor (Optional Enhancement)
// ============================================

class CustomCursor {
    constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.isMoving = false;
        this.setupCursor();
    }

    setupCursor() {
        // You can add custom cursor CSS here
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.isMoving = true;
        });

        document.addEventListener('mouseleave', () => {
            this.isMoving = false;
        });
    }
}

// ============================================
// Performance Monitoring
// ============================================

function logPerformance() {
    if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Page Load Time:', pageLoadTime + 'ms');
    }
}

window.addEventListener('load', logPerformance);

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio loaded successfully!');
    
    // Initialize all features
    AOS.refresh();
});

// ============================================
// Error Boundary for Better Stability
// ============================================

window.addEventListener('error', (e) => {
    console.error('Error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled rejection:', e.reason);
});
