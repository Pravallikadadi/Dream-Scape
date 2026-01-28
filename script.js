// Unsplash Image Search Gallery
// Always shows MAX 5 images per search – one request only

const ACCESS_KEY = 'z-GznD9KMG_PsVgLdvBxCirlR5o8kpXZ7adhCqvNBvY';

const searchInput  = document.getElementById('searchInput');
const searchBtn    = document.getElementById('searchBtn');
const imageGrid    = document.getElementById('imageGrid');
const loader       = document.getElementById('loader');
const statusInfo   = document.getElementById('statusInfo');
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightboxImg');

let isLoading = false;

// ────────────────────────────────────────────────
// Perform search – fetches exactly up to 5 images
async function searchImages() {
  if (isLoading) return;

  const query = searchInput.value.trim();
  if (!query) {
    statusInfo.textContent = 'Please enter a search keyword';
    return;
  }

  // Reset previous results
  imageGrid.innerHTML = '';
  statusInfo.textContent = `Searching for "${query}"...`;
  loader.classList.remove('hidden');
  isLoading = true;

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?` +
      `query=${encodeURIComponent(query)}` +
      `&page=1` +
      `&per_page=5` +
      `&client_id=${ACCESS_KEY}`
    );

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit reached. Please wait a while.');
      }
      if (response.status === 401 || response.status === 403) {
        throw new Error('API key problem – check your key.');
      }
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      statusInfo.textContent = 'No images found.';
    } else {
      displayImages(data.results);
      const count = data.results.length;
      statusInfo.textContent = `Showing ${count} image${count !== 1 ? 's' : ''} for "${query}"`;
    }

  } catch (error) {
    console.error('Error:', error);
    statusInfo.textContent = error.message || 'Failed to load images. Try again.';
  } finally {
    loader.classList.add('hidden');
    isLoading = false;
  }
}

// ────────────────────────────────────────────────
// Display the images (max 5)
function displayImages(photos) {
  photos.forEach(photo => {
    const card = document.createElement('div');
    card.className = 'image-card';

    const img = document.createElement('img');
    img.src = photo.urls?.small || '';
    img.alt = photo.alt_description || 'Unsplash image';
    img.loading = 'lazy';

    const info = document.createElement('div');
    info.className = 'image-info';
    info.innerHTML = `<p>© ${photo.user?.name || 'Unknown'}</p>`;

    card.appendChild(img);
    card.appendChild(info);

    // Open lightbox on click
    card.addEventListener('click', () => openLightbox(photo));

    // Optional fade-in effect
    img.onload = () => card.classList.add('loaded');

    imageGrid.appendChild(card);
  });
}

// ────────────────────────────────────────────────
// Lightbox functionality
function openLightbox(photo) {
  if (!photo?.urls?.regular) return;

  lightboxImg.src = photo.urls.regular;
  lightboxImg.alt = photo.alt_description || 'Enlarged photo';

  document.getElementById('imageTitle').textContent =
    photo.description || photo.alt_description || 'Photo from Unsplash';

  document.getElementById('imageAuthor').textContent =
    `By ${photo.user?.name || 'Anonymous'}`;

  const downloadLink = document.getElementById('downloadBtn');
  if (downloadLink) {
    downloadLink.href = photo.links?.html 
      ? photo.links.html + '?utm_source=your_app&utm_medium=referral'
      : '#';
  }

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

// ────────────────────────────────────────────────
// Event Listeners
searchBtn.addEventListener('click', searchImages);

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    searchImages();
  }
});

document.querySelector('.close-lightbox')?.addEventListener('click', closeLightbox);

lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Clear results when input is emptied
searchInput.addEventListener('input', () => {
  if (!searchInput.value.trim() && imageGrid.children.length > 0) {
    imageGrid.innerHTML = '';
    statusInfo.textContent = 'Enter a keyword to begin';
  }
});
