// script.js
const imageViewer = document.getElementById('imageViewer');
let currentIndex = 0;
let images = [];
let intervalId;

function changeImage() {
    currentIndex = (currentIndex + 1) % images.length;
    imageViewer.src = images[currentIndex];
}

function startAutoChange() {
    intervalId = setInterval(() => {
    
            changeImage();
        
    }, 20000);
}

// Hent en liste over billeder fra mappen "images"
fetch('https://api.github.com/repos/tuckerit/lykkestrup.dk/contents/images')
  .then(response => response.json())
  .then(data => {
    images = data.filter(item => item.type === 'file' && item.name.match(/\.(png|jpg|jpeg|gif)$/)).map(item => item.download_url);
    
    // Hvis der er billeder, start billedviseren
    if (images.length > 0) {
      imageViewer.src = images[currentIndex];
      
      // Skift automatisk billede efter 10 sekunder
      startAutoChange();

      // Skift billede ved klik (desktop)
      imageViewer.addEventListener('click', () => {
    
            clearInterval(intervalId); // Stop den automatiske skift, når der klikkes
            changeImage();
            startAutoChange(); // Start den automatiske skift igen
        
      });

     
    } else {
      console.error('Ingen billeder blev fundet i mappen "images".');
    }
  })
  .catch(error => {
    console.error('Fejl ved indlæsning af billeder:', error);
  });
