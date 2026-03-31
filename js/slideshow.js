function scrollGallery(trackId, dir) {
    var track = document.getElementById(trackId);
    if (!track) return;
    var card = track.querySelector('.gallery-card, .gallery-card-pair');
    var gap = parseInt(getComputedStyle(track).gap) || 16;
    var step = card ? card.offsetWidth + gap : 200;
    track.scrollBy({ left: dir * step * 2, behavior: 'smooth' });
}

function initAutoScroll() {
    document.querySelectorAll('.gallery-track.auto-scroll').forEach(function(track) {
        var speed = 0.6;
        var hovered = false;
        var visible = false;
        var dir = track.dataset.dir === 'rtl' ? -1 : 1;
        var rafId = 0;

        if (dir === -1) track.scrollLeft = track.scrollWidth;

        function tick() {
            rafId = 0;
            if (!visible || hovered) return;
            track.scrollLeft += speed * dir;
            var max = track.scrollWidth - track.clientWidth;
            if (dir === 1 && track.scrollLeft >= max) track.scrollLeft = 0;
            if (dir === -1 && track.scrollLeft <= 0) track.scrollLeft = max;
            rafId = requestAnimationFrame(tick);
        }

        function startLoop() { if (!rafId && visible && !hovered) rafId = requestAnimationFrame(tick); }

        var obs = new IntersectionObserver(function(entries) {
            visible = entries[0].isIntersecting;
            if (visible) startLoop();
        }, { threshold: 0.05 });
        obs.observe(track);

        track.addEventListener('mouseenter', function() { hovered = true; });
        track.addEventListener('mouseleave', function() { hovered = false; startLoop(); });
    });
}

document.addEventListener('DOMContentLoaded', initAutoScroll);

function initSlideshow(containerId, intervalMs) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const images = container.querySelectorAll('img');
    const dots = container.parentElement.querySelectorAll('.slideshow-dot[data-show="' + containerId + '"]');
    if (images.length === 0) return;

    let current = 0;
    images[0].classList.add('active');
    if (dots.length > 0) dots[0].classList.add('active');

    function show(idx) {
        images[current].classList.remove('active');
        if (dots.length > current) dots[current].classList.remove('active');
        current = idx % images.length;
        images[current].classList.add('active');
        if (dots.length > current) dots[current].classList.add('active');
    }

    setInterval(() => show(current + 1), intervalMs || 3000);

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => show(i));
    });
}
