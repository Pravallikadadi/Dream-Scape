// Unsplash Gallery – NO LIMIT on images per page/load
// User can enter any number via input field

const ACCESS_KEY = 'z-GznD9KMG_PsVgLdvBxCirlR5o8kpXZ7adhCqvNBvY';

const searchInput     = document.getElementById('searchInput');
const searchBtn       = document.getElementById('searchBtn');
const imageGrid       = document.getElementById('imageGrid');
const loader          = document.getElementById('loader');
const statusInfo      = document.getElementById('statusInfo');
const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightboxImg');
const perPageInput    = document.getElementById('perPageInput');

let currentQuery = '';
let page = 1;
let isLoading = false;

// Get number of images per page from user input (no upper limit)
function getImagesPerPage() {
  const count = Number(perPageInput.value);
  return Number.isInteger(count) && count > 0 ? count : 5;
}

// ────────────────────────────────────────────────
async function loadImages() {
  if (isLoading) return;

  currentQuery = searchInput.value.trim();
  if (!currentQuery) {
    statusInfo.textContent = 'Please enter a search term';
    return;
  }

  imageGrid.innerHTML = '';
  isLoading = true;

  const perPage = getImagesPerPage();

  statusInfo.textContent =
    `Loading ${perPage} images for "${currentQuery}"...`;

  loader.classList.remove('hidden');

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?` +
      `query=${encodeURIComponent(currentQuery)}` +
      `&page=1` +
      `&per_page=${perPage}` +
      `&client_id=${ACCESS_KEY}`
    );

    if (!response.ok) throw new Error('Failed to load images');

    const data = await response.json();

    if (data.results.length === 0) {
      statusInfo.textContent = 'No images found';
    } else {
      displayImages(data.results);
      statusInfo.textContent =
        `Showing ${data.results.length} images`;
    }

  } catch (err) {
    console.error(err);
    statusInfo.textContent = err.message;
  } finally {
    loader.classList.add('hidden');
    isLoading = false;
  }
}


    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit reached – please wait');
      }
      if (response.status === 401 || response.status === 403) {
        throw new Error('Invalid API key');
      }
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();

    if (data.results?.length === 0 && isNewSearch) {
      statusInfo.textContent = 'No images found.';
    } else if (data.results?.length > 0) {
      displayImages(data.results);

      const total = imageGrid.children.length;
      statusInfo.textContent = 
        `Search: "${currentQuery}" • Page ${page} • ${total} images (${perPage} per page)`;

      page++;
    }

  } catch (error) {
    console.error('Error:', error);
    statusInfo.textContent = error.message || 'Failed to load images';
  } finally {
    loader.classList.add('hidden');
    isLoading = false;
  }
}

// ────────────────────────────────────────────────
// Display images
function displayImages(photos) {
  photos.forEach(photo => {
    const card = document.createElement('div');
    card.className = 'image-card';

    const img = document.createElement('img');
    img.src = photo.urls?.small || '';
    img.alt = photo.alt_description || 'photo';
    img.loading = 'lazy';

    const info = document.createElement('div');
    info.className = 'image-info';
    info.innerHTML = `<p>© ${photo.user?.name || 'Unknown'}</p>`;

    card.appendChild(img);
    card.appendChild(info);

    card.addEventListener('click', () => openLightbox(photo));
    img.onload = () => card.classList.add('loaded');

    imageGrid.appendChild(card);
  });
}

// ────────────────────────────────────────────────
// Lightbox (minimal version)
function openLightbox(photo) {
  if (!photo?.urls?.regular) return;
  lightboxImg.src = photo.urls.regular;
  document.getElementById('imageTitle').textContent = 
    photo.description || photo.alt_description || 'Photo';
  document.getElementById('imageAuthor').textContent = 
    `By ${photo.user?.name || 'Unknown'}`;
  document.getElementById('downloadBtn').href = 
    photo.links?.html + '?utm_source=your_app' || '#';

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

// ────────────────────────────────────────────────
// Event Listeners
searchBtn.addEventListener('click', loadImages);

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') loadImages();
});

perPageInput.addEventListener('change', () => {
  if (searchInput.value.trim()) loadImages();
});


document.querySelector('.close-lightbox')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});



// Optional: restart search when user changes the number
perPageInput?.addEventListener('change', () => {
  if (currentQuery && imageGrid.children.length > 0) {
    loadImages(true);
  }
});
