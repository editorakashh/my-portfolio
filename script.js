document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor
    const cursor = document.getElementById('cursor-glow');
    
    const moveCursor = (e) => {
        const x = e.clientX || (e.touches && e.touches[0].clientX);
        const y = e.clientY || (e.touches && e.touches[0].clientY);
        if (x !== undefined && y !== undefined) {
            cursor.style.left = x + 'px';
            cursor.style.top = y + 'px';
        }
    };

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('touchmove', moveCursor, { passive: true });
    document.addEventListener('touchstart', (e) => {
        cursor.style.opacity = '1';
        moveCursor(e);
    }, { passive: true });
    document.addEventListener('touchend', () => {
        // Optional: keep it visible or fade out
        // cursor.style.opacity = '0';
    });

    // Expand cursor on clickable elements
    const clickables = document.querySelectorAll('a, button, input, textarea');
    clickables.forEach(el => {
        const expandCursor = () => {
            cursor.style.width = '600px';
            cursor.style.height = '600px';
            cursor.style.background = 'radial-gradient(circle, var(--accent-glow) 0%, transparent 60%)';
        };
        const shrinkCursor = () => {
            cursor.style.width = '400px';
            cursor.style.height = '400px';
            cursor.style.background = 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)';
        };

        el.addEventListener('mouseenter', expandCursor);
        el.addEventListener('mouseleave', shrinkCursor);
        el.addEventListener('touchstart', expandCursor, { passive: true });
        el.addEventListener('touchend', shrinkCursor, { passive: true });
    });

    // 2. Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Animate hamburger lines (optional simple effect)
        const spans = hamburger.querySelectorAll('span');
        if(navLinks.classList.contains('active')) {
            spans[0].style.transform = 'translateY(7px) rotate(45deg)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // 3. Removed Lenis

    // 4. GSAP Animations
    gsap.registerPlugin(ScrollTrigger);

    // Hero Reveal
    gsap.from(".greeting, .glitch-text, .role, .hero-desc, .cta-group", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2
    });

    gsap.from(".hero-visual", {
        scale: 0.8,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.5
    });

    // Section Reveals
    const animateSections = document.querySelectorAll('section:not(#home)');
    animateSections.forEach((section) => {
        const elements = section.querySelectorAll('.section-header, .about-text, .about-image-placeholder, .project-card, .contact-container');
        if (elements.length > 0) {
            gsap.from(elements, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%", // trigger slightly earlier
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out"
            });
        }
    });

    // Magnetic Buttons
    const magneticElements = document.querySelectorAll('.btn');
    magneticElements.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
            const position = el.getBoundingClientRect();
            const x = e.clientX - position.left - position.width / 2;
            const y = e.clientY - position.top - position.height / 2;
            
            gsap.to(el, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });

    // 4. Active Navigation Link Highlighting on Scroll
    const navItems = document.querySelectorAll('.nav-links a');
    const sectionsObj = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.pageYOffset;

        sectionsObj.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100; // Adjust for navbar height
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
        
        // Navbar background effect on scroll
        const navbar = document.querySelector('.navbar');
        if (scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });

    // 5. Form submission handling (prevent default)
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';
            btn.style.opacity = '0.8';
            
            // Simulate network request
            setTimeout(() => {
                btn.innerText = 'Message Sent!';
                btn.style.background = '#10b981'; // Green success
                form.reset();
                
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = 'var(--gradient-primary)';
                    btn.style.opacity = '1';
                }, 3000);
            }, 1500);
        });
    }
});
