// File: assets/js/gallery.js

document.addEventListener('DOMContentLoaded', () => {
  const albums = document.querySelectorAll('.album');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxVideo = document.querySelector('.lightbox-video');
  const closeBtn = document.querySelector('.close');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');

  let currentAlbum = '';
  let currentIndex = 0;
  let mediaItems = [];

  // Smooth fade utility
  const fadeIn = (el) => {
    el.style.display = 'flex';
    el.animate([{ opacity: 0, filter: 'blur(8px)' }, { opacity: 1, filter: 'blur(0)' }], {
      duration: 500,
      easing: 'ease-out',
      fill: 'forwards'
    });
  };

  const fadeOut = (el) => {
    const anim = el.animate([{ opacity: 1, filter: 'blur(0)' }, { opacity: 0, filter: 'blur(8px)' }], {
      duration: 400,
      easing: 'ease-in',
      fill: 'forwards'
    });
    anim.onfinish = () => { el.style.display = 'none'; };
  };

  // Preload function for smoother transitions
  const preloadMedia = (src) => {
    if (src.endsWith('.mp4')) return; // skip video preload
    const img = new Image();
    img.src = src;
  };

  // Load images/videos dynamically from folder
  const loadMedia = (category) => {
    // You can expand this array or auto-generate in backend
    const basePath = `assets/gallery/${category}/`;
    const items = [];

    for (let i = 1; i <= 20; i++) {
      const imagePath = `${basePath}${category}${i}.jpg`;
      const videoPath = `${basePath}${category}${i}.mp4`;
      items.push({ type: 'image', src: imagePath });
      preloadMedia(imagePath);
      // If video exists, include as well
      items.push({ type: 'video', src: videoPath });
    }
    return items;
  };

  const showMedia = (index) => {
    const item = mediaItems[index];
    if (!item) return;

    lightboxImg.style.display = 'none';
    lightboxVideo.style.display = 'none';

    if (item.type === 'image' && item.src.endsWith('.jpg')) {
      lightboxImg.src = item.src;
      lightboxImg.style.display = 'block';
    } else if (item.type === 'video' && item.src.endsWith('.mp4')) {
      lightboxVideo.src = item.src;
      lightboxVideo.style.display = 'block';
    }
  };

  albums.forEach(album => {
    album.addEventListener('click', () => {
      currentAlbum = album.dataset.category;
      mediaItems = loadMedia(currentAlbum).filter(m => m.src && m.src.length > 0);
      currentIndex = 0;
      showMedia(currentIndex);
      fadeIn(lightbox);
      document.body.style.overflow = 'hidden';
    });
  });

  // Navigation
  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
    showMedia(currentIndex);
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % mediaItems.length;
    showMedia(currentIndex);
  });

  // Close
  closeBtn.addEventListener('click', () => {
    fadeOut(lightbox);
    document.body.style.overflow = 'auto';
    if (lightboxVideo) lightboxVideo.pause();
  });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (lightbox.style.display !== 'flex') return;
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
    if (e.key === 'Escape') closeBtn.click();
  });

  // Close when clicking outside
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      fadeOut(lightbox);
      document.body.style.overflow = 'auto';
      if (lightboxVideo) lightboxVideo.pause();
    }
  });
});
