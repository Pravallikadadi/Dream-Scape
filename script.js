const ACCESS_KEY = 'z-GznD9KMG_PsVgLdvBxCirlR5o8kpXZ7adhCqvNBvY';

const searchInput  = document.getElementById('searchInput');
const perPageInput = document.getElementById('perPageInput');
const searchBtn    = document.getElementById('searchBtn');
const imageGrid    = document.getElementById('imageGrid');
const statusInfo   = document.getElementById('statusInfo');
const loader       = document.getElementById('loader');

let isLoading = false;

/* DEBUG – MUST NOT BE NULL */
console.log({ searchInput, perPageInput, searchBtn, imageGrid });

function getImagesPerPage() {
  if (!perPageInput) return 5;

  const count = Number(perPageInput.value);
  return Number.isInteger(count) && count > 0 ? count : 5;
}

async function loadImages() {
  if (isLoading) return;

  const query = searchInput.value.trim();
  if (!query) {
    statusInfo.textContent = 'Please enter a search term';
    return;
  }

  const perPage = getImagesPerPage();
  imageGrid.innerHTML = '';

  statusInfo.textContent = `Loading ${perPage} images...`;
  loader.classList.remove('hidden');
  isLoading = true;

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&page=1&per_page=${perPage}&client_id=${ACCESS_KEY}`
    );

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      statusInfo.textContent = 'No images found';
      return;
    }

    data.results.forEach(photo => {
      const img = document.createElement('img');
      img.src = photo.urls.small;
      img.style.width = '200px';
      img.style.margin = '10px';
      imageGrid.appendChild(img);
    });

    statusInfo.textContent = `Showing ${data.results.length} images`;

  } catch (err) {
    console.error(err);
    statusInfo.textContent = err.message;
  } finally {
    loader.classList.add('hidden');
    isLoading = false;
  }
}

searchBtn.addEventListener('click', loadImages);
