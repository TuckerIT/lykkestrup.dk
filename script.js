// script.js
const imageViewer = document.getElementById('imageViewer');
let currentIndex = 0;
let images = [];
let intervalId;
let canChangeImage = true;

function changeImage(forward = true) {
    if (forward) {
        currentIndex = (currentIndex + 1) % images.length;
    } else {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
    }

    imageViewer.src = images[currentIndex];

    // Genaktiver skift, når der skiftes billede
    setTimeout(() => {
        canChangeImage = true;
    }, 1000);
}

function startAutoChange() {
    intervalId = setInterval(() => {
        if (canChangeImage) {
            changeImage();
        }
    }, 10000);
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
      imageViewer.addEventListener('click', (event) => {
        if (canChangeImage) {
            clearInterval(intervalId); // Stop den automatiske skift, når der klikkes

            // Beregn klikpositionen i forhold til billedets bredde
            const clickPosition = event.clientX - imageViewer.getBoundingClientRect().left;
            const imageWidth = imageViewer.offsetWidth;

            // Skift billede baseret på klikposition
            if (clickPosition > 0.9 * imageWidth) {
                changeImage(true);  // Næste billede ved at trykke på 90% af højre side
            } else if (clickPosition < 0.1 * imageWidth) {
                changeImage(false);  // Forrige billede ved at trykke på 10% af venstre side
            }

            startAutoChange(); // Start den automatiske skift igen
        }
      });

      // Skift billede ved tryk (touch) på mobile enheder
      imageViewer.addEventListener('touchend', (event) => {
        if (canChangeImage) {
            clearInterval(intervalId); // Stop den automatiske skift ved tryk

            // Beregn trykpositionen i forhold til billedets bredde
            const touchPosition = event.touches[0].clientX - imageViewer.getBoundingClientRect().left;
            const imageWidth = imageViewer.offsetWidth;

            // Skift billede baseret på trykposition
            if (touchPosition > 0.9 * imageWidth) {
                changeImage(true);  // Næste billede ved at trykke på 90% af højre side
            } else if (touchPosition < 0.1 * imageWidth) {
                changeImage(false);  // Forrige billede ved at trykke på 10% af venstre side
            }

            startAutoChange(); // Start den automatiske skift igen
        }
      });
    } else {
      console.error('Ingen billeder blev fundet i mappen "images".');
    }
  })
  .catch(error => {
    console.error('Fejl ved indlæsning af billeder:', error);
  });
