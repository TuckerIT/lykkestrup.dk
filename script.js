// script.js
const imageViewer = document.getElementById('imageViewer');
const images = ['billede1.jpg', 'billede2.jpg', 'billede3.jpg']; // Tilføj flere billeder efter behov
let currentIndex = 0;

imageViewer.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    imageViewer.src = images[currentIndex];
});
