// script.js
const imageViewer = document.getElementById('imageViewer');
let currentIndex = 0;

function changeImage() {
    currentIndex = (currentIndex + 1) % images.length;
    imageViewer.src = images[currentIndex];
}

// Hent en liste over billeder fra mappen "images"
fetch('https://api.github.com/repos/tuckerit/lykkestrup.dk/contents/images')
  .then(response => response.json())
  .then(data => {
    const images = data.filter(item => item.type === 'file' && item.name.match(/\.(png|jpg|jpeg|gif)$/)).map(item => item.download_url);
    
    // Hvis der er billeder, start billedviseren
    if (images.length > 0) {
      imageViewer.src = images[currentIndex];
      
      // Skift billede ved klik
      imageViewer.addEventListener('click', changeImage);

      // Skift automatisk billede efter 10 sekunder
      setInterval(changeImage, 10000);
    } else {
      console.error('Ingen billeder blev fundet i mappen "images".');
    }
  })
  .catch(error => {
    console.error('Fejl ved indlæsning af billeder:', error);
  });
