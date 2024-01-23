// script.js
const imageViewer = document.getElementById('imageViewer');
let currentIndex = 0;
let images = [];
let intervalId;
let canChangeImage = true;

// Define the debounce function
function debounce(func, wait) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, arguments), wait);
  };
}

function changeImage() {
    currentIndex = (currentIndex + 1) % images.length;
    imageViewer.src = images[currentIndex];

    // Genaktiver skift, når det sidste billede nås
    if (currentIndex === images.length - 1) {
        setTimeout(() => {
            canChangeImage = true;
        }, 1000);
    }
}

function startAutoChange() {
    intervalId = setInterval(() => {
        if (canChangeImage) {
            changeImage();
        }
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

      // Skift billede ved klik (desktop) with debounce
      imageViewer.addEventListener('click', debounce(() => {
        if (canChangeImage) {
          canChangeImage = false;
          clearInterval(intervalId); // Stop den automatiske skift, når der klikkes
          changeImage();
          startAutoChange(); // Start den automatiske skift igen
        }
      }, 1000)); // Adjust the wait time as needed

      // Skift billede ved tryk (touch) på mobile enheder with debounce
      imageViewer.addEventListener('touchend', debounce(() => {
        if (canChangeImage) {
          canChangeImage = false;
          clearInterval(intervalId); // Stop den automatiske skift ved tryk
          changeImage();
          startAutoChange(); // Start den automatiske skift igen
        }
      }, 1000)); // Adjust the wait time as needed
    } else {
      console.error('Ingen billeder blev fundet i mappen "images".');
    }
  })
  .catch(error => {
    console.error('Fejl ved indlæsning af billeder:', error);
  });
