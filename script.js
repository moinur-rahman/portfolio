/**
 * Portfolio — Swiss Brutalist Editorial
 * Refined interactions & scroll animations
 */

(() => {
    // === DOM ===
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav__link');
    const contactForm = document.getElementById('contactForm');

    // === Typing Animation ===
    const roles = [
        'Full-Stack Engineer',
        'Problem Solver',
        'TypeScript Enthusiast',
        'Backend Developer',
        'Frontend Developer'
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;
    const typingEl = document.getElementById('typingText');

    function type() {
        const current = roles[roleIdx];

        if (deleting) {
            charIdx--;
            typingEl.textContent = current.substring(0, charIdx);
        } else {
            charIdx++;
            typingEl.textContent = current.substring(0, charIdx);
        }

        if (!deleting && charIdx === current.length) {
            setTimeout(() => { deleting = true; type(); }, 2200);
            return;
        }

        if (deleting && charIdx === 0) {
            deleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
        }

        setTimeout(type, deleting ? 40 : 90);
    }

    setTimeout(type, 1200);

    // === Navbar Scroll ===
    let lastScroll = 0;

    function onScroll() {
        const y = window.scrollY;

        // Scrolled style
        navbar.classList.toggle('nav--scrolled', y > 60);

        lastScroll = y;
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // === Mobile Menu ===
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // === Smooth Scroll ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = navbar.offsetHeight + 20;
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // === Active Nav Link ===
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const y = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (y >= top && y < top + height) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // === Scroll Reveal ===
    const revealElements = document.querySelectorAll(
        '.about__headline, .about__text, .about__stats, .skills__category, ' +
        '.exp__card, .exp__education, .project, .contact__left, .contact__form'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    // Stagger skills lists
    document.querySelectorAll('.skills__list').forEach(el => el.classList.add('reveal-stagger'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add(
                    entry.target.classList.contains('reveal-stagger') ? 'reveal-stagger--visible' : 'reveal--visible'
                );
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
    document.querySelectorAll('.reveal-stagger').forEach(el => revealObserver.observe(el));

    // === Stat Counter Animation ===
    const statNumbers = document.querySelectorAll('.stat__number');

    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                animateCount(el, target);
                statObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statObserver.observe(stat));

    function animateCount(el, target) {
        const duration = 1200;
        const start = performance.now();

        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);

            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        }

        requestAnimationFrame(tick);
    }

    // === Contact Form ===
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<span>Sending...</span>';
            btn.disabled = true;

            setTimeout(() => {
                showNotification('Message sent successfully!', 'success');
                contactForm.reset();
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }, 1500);
        });
    }

    // === Notification ===
    function showNotification(message, type = 'info') {
        const note = document.createElement('div');
        note.className = `notification${type === 'success' ? ' notification--success' : ''}`;
        note.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification__close" aria-label="Close"><i class="fas fa-times"></i></button>
        `;

        document.body.appendChild(note);

        note.querySelector('.notification__close').addEventListener('click', () => removeNotification(note));
        setTimeout(() => removeNotification(note), 4000);
    }

    function removeNotification(note) {
        if (!note.parentNode) return;
        note.style.opacity = '0';
        note.style.transform = 'translateY(20px)';
        note.style.transition = 'all 0.3s ease';
        setTimeout(() => note.remove(), 300);
    }

    // === Copy Email ===
    document.querySelectorAll('.contact__item[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const email = link.getAttribute('href').replace('mailto:', '');
            navigator.clipboard.writeText(email).then(() => {
                showNotification('Email copied to clipboard!', 'success');
            });
        });
    });

    // === Reduced Motion ===
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.reveal').forEach(el => {
            el.classList.add('reveal--visible');
        });
        document.querySelectorAll('.reveal-stagger').forEach(el => {
            el.classList.add('reveal-stagger--visible');
        });
    }
})();
