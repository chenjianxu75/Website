/* ========================================
   JavaScript - Academic Homepage
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ========== Particle Background ==========
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = isDark
                ? `rgba(96, 165, 250, ${this.opacity})`
                : `rgba(37, 99, 235, ${this.opacity * 0.5})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const maxDist = 150;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDist) {
                    const opacity = (1 - dist / maxDist) * 0.15;
                    ctx.beginPath();
                    ctx.strokeStyle = isDark
                        ? `rgba(96, 165, 250, ${opacity})`
                        : `rgba(37, 99, 235, ${opacity * 0.5})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        animationId = requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });


    // ========== Theme Toggle ==========
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);

        // Add rotation animation
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 500);
    });


    // ========== Navigation ==========
    const topNav = document.getElementById('topNav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const backToTop = document.getElementById('backToTop');

    // Scroll behavior for nav
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        // Add scrolled class for shadow
        if (currentScroll > 20) {
            topNav.classList.add('scrolled');
        } else {
            topNav.classList.remove('scrolled');
        }

        // Back to top button
        if (currentScroll > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active nav link based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });

        lastScroll = currentScroll;
    });

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Back to top click
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    // ========== Mobile Menu ==========
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : '';
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);

            mobileMenuBtn.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';

            if (target) {
                setTimeout(() => {
                    target.scrollIntoView({ behavior: 'smooth' });
                }, 300);
            }
        });
    });

    // Close mobile menu on overlay click
    mobileMenuOverlay.addEventListener('click', (e) => {
        if (e.target === mobileMenuOverlay) {
            mobileMenuBtn.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });


    // ========== Scroll Animations (Intersection Observer) ==========
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });


    // ========== Counter Animation ==========
    const statNumbers = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    function animateCounter(el, target) {
        let current = 0;
        const increment = target / 50;
        const duration = 1500;
        const stepTime = duration / 50;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current) + (target >= 100 ? '+' : '');
        }, stepTime);
    }


    // ========== Profile Photo Tilt Effect ==========
    const profilePhoto = document.getElementById('profilePhoto');
    if (profilePhoto) {
        const wrapper = profilePhoto.closest('.profile-photo-wrapper');
        wrapper.addEventListener('mousemove', (e) => {
            const rect = wrapper.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            profilePhoto.style.transform = `
                perspective(500px)
                rotateY(${x * 10}deg)
                rotateX(${-y * 10}deg)
                scale(1.05)
            `;
        });

        wrapper.addEventListener('mouseleave', () => {
            profilePhoto.style.transform = '';
        });
    }


    // ========== Show More News ==========
    const showMoreBtn = document.getElementById('showMoreNews');
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', () => {
            const newsItems = document.querySelectorAll('.news-item');
            const isExpanded = showMoreBtn.classList.contains('expanded');

            if (isExpanded) {
                newsItems.forEach((item, index) => {
                    if (index >= 3) {
                        item.style.maxHeight = '0';
                        item.style.opacity = '0';
                        item.style.overflow = 'hidden';
                        item.style.padding = '0';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
                showMoreBtn.querySelector('span').textContent = 'Show More';
                showMoreBtn.querySelector('i').style.transform = '';
                showMoreBtn.classList.remove('expanded');
            } else {
                newsItems.forEach((item, index) => {
                    if (index >= 3) {
                        item.style.display = 'flex';
                        setTimeout(() => {
                            item.style.maxHeight = '100px';
                            item.style.opacity = '1';
                            item.style.overflow = 'visible';
                            item.style.padding = '14px 0';
                        }, 10);
                    }
                });
                showMoreBtn.querySelector('span').textContent = 'Show Less';
                showMoreBtn.querySelector('i').style.transform = 'rotate(180deg)';
                showMoreBtn.classList.add('expanded');
            }
        });
    }
});


// ========== Global Functions ==========

// Show/hide citation box with animation
function showCitation(button) {
    const card = button.closest('.publication-card');
    const citationBox = card.querySelector('.citation-box');

    if (citationBox.style.display === 'none' || !citationBox.style.display) {
        citationBox.style.display = 'block';
        button.style.background = 'var(--accent-soft)';
        button.style.color = 'var(--accent-primary)';
        button.style.borderColor = 'var(--accent-primary)';
    } else {
        citationBox.style.animation = 'none';
        citationBox.style.opacity = '0';
        citationBox.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            citationBox.style.display = 'none';
            citationBox.style.animation = '';
            citationBox.style.opacity = '';
            citationBox.style.transform = '';
            button.style.background = '';
            button.style.color = '';
            button.style.borderColor = '';
        }, 200);
    }
}

// Copy citation to clipboard
function copyCitation(button) {
    const code = button.closest('.citation-box').querySelector('code').textContent;
    navigator.clipboard.writeText(code).then(() => {
        showToast('BibTeX copied to clipboard!');
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-copy"></i> Copy';
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('BibTeX copied to clipboard!');
    });
}

// Toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.querySelector('span').textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}
