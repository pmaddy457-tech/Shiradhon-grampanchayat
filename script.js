const categoryNames = {
    'solar': 'सौर उर्जा प्रकल्प',
    'waste': 'कचरा कुंडी वाटप',
    'health': 'आरोग्य शिबीर',
    'water': 'जल तारा कामे',
    'area-clean': 'परिसर स्वच्छता',
    'library': 'लोकसहभागातून वाचनालय',
    'tree': 'वृक्ष लागवड व संगोपन',
    'constitution': 'संविधान दिन',
    'office': 'ग्रामपंचायत कार्यालय',
    'school': 'जिल्हा परिषद शाळा',
    'lakhpati': 'लखपती दिदी उपक्रम',
    'samples': 'ग्रा.पं. ०१ ते ३३ नमुने अद्यावत'
};

const folderMapping = {
    'solar': 'और उर्जा प्रकल्प',
    'waste': 'कचरा कुंडी वाटप',
    'health': 'आरोग्य शिबीर',
    'water': 'जल तारा कामे',
    'area-clean': 'परिसर स्वच्छता',
    'library': 'लोकसहभागातून वाचनालय',
    'tree': 'वृक्ष लागवड व संगोपन',
    'constitution': 'संविधान दिन',
    'office': 'ग्रामपंचायत कार्यालय',
    'school': 'जि.प. शाळा शिराढोण',
    'lakhpati': 'लखपती दिदी उपक्रम',
    'samples': 'ग्रा.पं. ०१ ते ३३ नमुने अद्यावत'
};

let galleryImagesData = {};

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initProgressBar();
    initBackToTop();
    initMobileMenu();
    
    if (document.getElementById('galleryGrid')) {
        initGallery();
    }
    
    if (document.querySelector('.stat-number')) {
        initCounters();
    }
    
    if (document.getElementById('heroBg')) {
        initParallax();
    }
});

function initNavigation() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function initProgressBar() {
    const progressBar = document.getElementById('progressBar');
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    
    toggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

async function loadImages(category) {
    const folderName = folderMapping[category];
    
    try {
        const response = await fetch(`images/${folderName}/`);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const links = Array.from(doc.querySelectorAll('a'));
        const images = links
            .map(link => link.getAttribute('href'))
            .filter(href => href && /\.(jpg|jpeg|png|gif|webp)$/i.test(href));
        
        return images;
    } catch (error) {
        console.log(`Could not load images for ${category}`);
        return [];
    }
}

function initGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    const filterPills = document.querySelectorAll('.filter-pill');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    
    let allImages = [];
    
    function getAllImagesFromDOM() {
        const galleryItems = document.querySelectorAll('.gallery-item[data-category]');
        allImages = Array.from(galleryItems).map(item => ({
            category: item.getAttribute('data-category'),
            img: item.querySelector('img').src,
            alt: item.querySelector('img').alt
        }));
    }
    
    getAllImagesFromDOM();
    
    function renderGallery(images) {
        if (images.length === 0) {
            galleryGrid.innerHTML = '<p style="text-align: center; width: 100%; color: #666;">कोणतेही फोटो सापडले नाहीत</p>';
            return;
        }
        
        galleryGrid.innerHTML = '';
        
        images.forEach(({ category, img, alt }) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.setAttribute('data-category', category);
            
            item.innerHTML = `
                <img src="${img}" alt="${alt}" loading="lazy">
                <div class="gallery-overlay">
                    <h3>${alt}</h3>
                </div>
            `;
            
            item.addEventListener('click', () => {
                lightboxImg.src = img;
                lightbox.classList.add('active');
            });
            
            galleryGrid.appendChild(item);
        });
    }
    
    function attachLightboxHandlers() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            const img = item.querySelector('img');
            if (img && !item.hasAttribute('data-lightbox-attached')) {
                item.addEventListener('click', () => {
                    lightboxImg.src = img.src;
                    lightbox.classList.add('active');
                });
                item.setAttribute('data-lightbox-attached', 'true');
            }
        });
    }
    
    renderGallery(allImages);
    
    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            
            const category = pill.getAttribute('data-category');
            
            if (category === 'all') {
                renderGallery(allImages);
            } else {
                const filtered = allImages.filter(item => item.category === category);
                renderGallery(filtered);
            }
        });
    });
    
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });
}

function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;
    
    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => animateCounter(counter), 10);
        } else {
            counter.innerText = target;
        }
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function initParallax() {
    const heroBg = document.getElementById('heroBg');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.timeline-item, .gallery-item, .leader-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    items.forEach(item => {
        observer.observe(item);
    });
});
