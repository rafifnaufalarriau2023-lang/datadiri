document.addEventListener('DOMContentLoaded', () => {
    // 0. Global Mobile Check
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 768);
    
    // 1. Custom Cursor Logic (Only Desktop)
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (!isTouchDevice && cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 300, fill: "forwards" });
        });

        // Hover effect
        const interactables = document.querySelectorAll('.bento-item, .magic-btn, .skill-tag, .view-btn, .nav-links a, .nav-contact-btn, .fs-cert-item');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
                cursorOutline.style.backgroundColor = 'rgba(216, 255, 0, 0.1)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '40px';
                cursorOutline.style.height = '40px';
                cursorOutline.style.backgroundColor = 'transparent';
            });
        });
    } else {
        if(cursorDot) cursorDot.style.display = 'none';
        if(cursorOutline) cursorOutline.style.display = 'none';
        document.body.style.cursor = 'auto';
    }

    // 2. Bento Item Mouse Tracking (Only Desktop)
    if (!isTouchDevice) {
        document.addEventListener('mousemove', (e) => {
            document.querySelectorAll('.bento-item').forEach(card => {
                const rect = card.getBoundingClientRect();
                if(rect.top < window.innerHeight && rect.bottom > 0) {
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    card.style.setProperty("--mouse-x", `${x}px`);
                    card.style.setProperty("--mouse-y", `${y}px`);
                }
            });
        });
    }

    // 3. Reveal Animations
    const bentoContainer = document.querySelector('.bento-container');
    if(bentoContainer) {
        setTimeout(() => {
            bentoContainer.style.opacity = '1';
            bentoContainer.style.transform = 'translateY(0)';
        }, 150);
    }

    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });
    
    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Navbar Sticky (Simplified for Performance)
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // 5. Contact Button
    const magicBtn = document.querySelector('.magic-btn');
    if(magicBtn) {
        magicBtn.addEventListener('click', function() {
            const text = this.querySelector('span');
            const icon = this.querySelector('i');
            text.innerText = 'Menuju WhatsApp...';
            icon.className = 'fas fa-check-circle';
            this.style.background = '#10b981';
            setTimeout(() => {
                text.innerText = 'Mulai Proyek';
                icon.className = 'fas fa-arrow-right';
                this.style.background = '';
            }, 2000);
        });
    }

    // 6. Dynamic Greeting
    const greetings = ["Halo", "Hello", "Hola", "مرحباً", "こんにちは", "Bonjour"];
    let currentGreetingIndex = 0;
    const greetingElement = document.getElementById('dynamicGreeting');
    if (greetingElement) {
        setInterval(() => {
            greetingElement.classList.add('is-hidden');
            setTimeout(() => {
                currentGreetingIndex = (currentGreetingIndex + 1) % greetings.length;
                greetingElement.innerText = greetings[currentGreetingIndex];
                greetingElement.classList.remove('is-hidden');
            }, 400);
        }, 3000);
    }

    // 8. Portfolio Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');
            portfolioCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 400);
                }
            });
        });
    });

    const portfolioGrid = document.querySelector('.portfolio-grid');
    if (portfolioGrid) {
        let isDragging = false;
        let startX;
        let scrollStart;

        portfolioGrid.addEventListener('pointerdown', (e) => {
            isDragging = true;
            portfolioGrid.classList.add('dragging');
            startX = e.pageX - portfolioGrid.offsetLeft;
            scrollStart = portfolioGrid.scrollLeft;
            portfolioGrid.setPointerCapture(e.pointerId);
        });

        portfolioGrid.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - portfolioGrid.offsetLeft;
            const walk = (x - startX) * 1.4;
            portfolioGrid.scrollLeft = scrollStart - walk;
        });

        const stopDragging = (e) => {
            isDragging = false;
            portfolioGrid.classList.remove('dragging');
            if (e.pointerId) portfolioGrid.releasePointerCapture(e.pointerId);
        };

        portfolioGrid.addEventListener('pointerup', stopDragging);
        portfolioGrid.addEventListener('pointerleave', stopDragging);
        portfolioGrid.addEventListener('pointercancel', stopDragging);
    }

    // 9. Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 10. Mouse Move Parallax (Only Desktop)
    if (!isTouchDevice) {
        const certBoard = document.querySelector('.fs-cert-board');
        const certItems = document.querySelectorAll('.fs-cert-item');
        if (certBoard) {
            certBoard.addEventListener('mousemove', (e) => {
                const rect = certBoard.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                certItems.forEach((item, index) => {
                    const speed = (index + 1) * 0.05;
                    item.style.setProperty('--move-x', `${x * speed}px`);
                    item.style.setProperty('--move-y', `${y * speed}px`);
                });
            });
            certBoard.addEventListener('mouseleave', () => {
                certItems.forEach(item => {
                    item.style.setProperty('--move-x', `0px`);
                    item.style.setProperty('--move-y', `0px`);
                });
            });
        }
    }

    // 11. Typewriter Effect
    const fsName = document.querySelector('.fs-name');
    if (fsName) {
        const text = fsName.textContent;
        fsName.textContent = '';
        let i = 0;
        let isTyping = false;
        const nameObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isTyping) {
                isTyping = true;
                const typeWriter = setInterval(() => {
                    fsName.textContent += text.charAt(i);
                    i++;
                    if (i >= text.length) {
                        clearInterval(typeWriter);
                        setTimeout(() => fsName.classList.add('glitch-text'), 500);
                    }
                }, 100);
            }
        }, { threshold: 0.5 });
        nameObserver.observe(fsName);
    // 12. Bottom Nav Active State on Scroll
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    const sections = document.querySelectorAll('section');
    
    const navObserverOptions = {
        threshold: 0.4
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                bottomNavItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => navObserver.observe(section));
    }
});