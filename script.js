const ACCESS_KEY = 'z-GznD9KMG_PsVgLdvBxCirlR5o8kpXZ7adhCqvNBvY';

const searchInput = document.getElementById('searchInput');
const searchBtn   = document.getElementById('searchBtn');
const imageGrid   = document.getElementById('imageGrid');
const statusInfo  = document.getElementById('statusInfo');
const loader      = document.getElementById('loader');

let isLoading = false;

/* 🔹 PARSE PROMPT */
function parsePrompt(text) {
  const numberMatch = text.match(/\d+/);
  const count = numberMatch ? parseInt(numberMatch[0], 10) : 5;

  let query = text
    .toLowerCase()
    .replace(/\d+/g, '')
    .replace(/images?|photos?|pictures?|i want|show|of|me|please/g, '')
    .trim();

  if (!query) query = text.replace(/\d+/g, '').trim();

  return { count, query };
}

/* 🔹 DISPLAY IMAGES */
function displayImages(photos) {
  imageGrid.innerHTML = '';
  photos.forEach(photo => {
    const img = document.createElement('img');
    img.src = photo.urls.small;
    img.style.width = '200px';
    img.style.margin = '10px';
    imageGrid.appendChild(img);
  });
}

/* 🔹 LOAD IMAGES */
async function loadImages() {
  if (isLoading) return;

  const prompt = searchInput.value.trim();
  if (!prompt) {
    statusInfo.textContent = 'Enter something like: 5 dress images';
    return;
  }

  const { count, query } = parsePrompt(prompt);
  console.log('PARSED:', { count, query });

  if (!query) {
    statusInfo.textContent = 'Could not understand query';
    return;
  }

  statusInfo.textContent = `Searching "${query}" | Count: ${count}`;
  loader.style.display = 'block';
  isLoading = true;

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=1&per_page=${count}&client_id=${ACCESS_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Unsplash error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      statusInfo.textContent = 'No images found';
      return;
    }

    displayImages(data.results);
    statusInfo.textContent = `Showing ${data.results.length} images`;

  } catch (err) {
    console.error(err);
    statusInfo.textContent = err.message;
  } finally {
    loader.style.display = 'none';
    isLoading = false;
  }
}

/* 🔹 EVENT */
searchBtn.addEventListener('click', loadImages);
