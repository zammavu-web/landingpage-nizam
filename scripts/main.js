// Split-stage interactions: smooth anchors, staggered entrances,
// photo crossfade that follows the reading column.
document.documentElement.classList.add('js');

// Smooth scroll for internal links.
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Staggered entrance: heading, then text, then picture per section.
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.sheet section, .sheet .hero-block, .contact-field').forEach((section) => {
    section.querySelectorAll('[data-reveal]').forEach((el, i) => {
        el.style.setProperty('--d', `${Math.min(i, 5) * 80}ms`);
        revealObserver.observe(el);
    });
});
document.querySelectorAll('.hero-block > h1, .hero-block > .lede').forEach((el, i) => {
    el.setAttribute('data-reveal', '');
    el.style.setProperty('--d', `${i * 90}ms`);
    revealObserver.observe(el);
});

// Signature move: the fixed photo crossfades to the section's picture.
const photos = new Map(
    [...document.querySelectorAll('.stage-photo')].map((img) => [img.dataset.photo, img])
);

const photoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const key = entry.target.dataset.photoTarget;
        const next = photos.get(key) || photos.get('hero');
        const current = document.querySelector('.stage-photo.is-active');
        if (next && next !== current) {
            current?.classList.remove('is-active');
            next.classList.add('is-active');
        }
    });
}, { threshold: 0, rootMargin: '-45% 0px -45% 0px' });

document.querySelectorAll('[data-photo-target]').forEach((section) => {
    photoObserver.observe(section);
});

// Form handler: prevent reload, show confirmation.
document.querySelector('.contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nama = e.target.nama.value;
    alert(`Terima kasih ${nama}! Pesan kamu sudah diterima.`);
    e.target.reset();
});
