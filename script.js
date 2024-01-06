// script.js
const imageViewer = document.getElementById('imageViewer');
let currentIndex = 0;

// Hent en liste over billeder fra mappen "images"
fetch('images')
  .then(response => response.json())
  .then(data => {
    const images = data.tree.filter(item => item.type === 'blob' && item.path.match(/\.(png|jpg|jpeg|gif)$/)).map(item => item.path);
    
    // Hvis der er billeder, start billedviseren
    if (images.length > 0) {
      imageViewer.src = `images/${images[currentIndex]}`;
      
      // Skift billede ved klik
      imageViewer.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        imageViewer.src = `images/${images[currentIndex]}`;
      });
    } else {
      console.error('Ingen billeder blev fundet i mappen "images".');
    }
  })
  .catch(error => {
    console.error('Fejl ved indlæsning af billeder:', error);
  });
