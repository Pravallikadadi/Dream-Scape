const ACCESS_KEY = 'z-GznD9KMG_PsVgLdvBxCirlR5o8kpXZ7adhCqvNBvY';

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const imageGrid = document.getElementById('imageGrid');
const loader = document.getElementById('loader');
const statusInfo = document.getElementById('statusInfo');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxDetails = document.querySelector('.lightbox-details');
const closeLightbox = document.querySelector('.close-lightbox');

let currentQuery = '';
let page = 1;
let isSearching = false;

// Search function
async function searchImages(isNewSearch = true) {
    if (isSearching) return;

    if (isNewSearch) {
        page = 1;
        imageGrid.innerHTML = '';
        currentQuery = searchInput.value.trim();
        if (!currentQuery) return;
        statusInfo.textContent = `Searching for "${currentQuery}"...`;
    }

    isSearching = true;
    loader.classList.remove('hidden');

    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${currentQuery}&page=${page}&per_page=12&client_id=${ACCESS_KEY}`);
        const data = await response.json();

        if (data.results.length === 0 && isNewSearch) {
            statusInfo.textContent = 'No results found. Try another keyword.';
            loader.classList.add('hidden');
            isSearching = false;
            return;
        }

        displayImages(data.results);
        statusInfo.textContent = `Showing results for "${currentQuery}"`;
        page++;
    } catch (error) {
        console.error('Error fetching images:', error);
        statusInfo.textContent = 'Error fetching images. Please check your API key.';
    } finally {
        loader.classList.add('hidden');
        isSearching = false;
    }
}

function displayImages(images) {
    images.forEach(img => {
        const card = document.createElement('div');
        card.className = 'image-card';

        const imageElement = document.createElement('img');
        imageElement.src = img.urls.small;
        imageElement.alt = img.alt_description || 'Unsplash Image';

        const info = document.createElement('div');
        info.className = 'image-info';
        info.innerHTML = `<p>by ${img.user.name}</p>`;

        card.appendChild(imageElement);
        card.appendChild(info);

        imageElement.onload = () => card.classList.add('loaded');

        card.addEventListener('click', () => openLightbox(img));

        imageGrid.appendChild(card);
    });
}

// Lightbox logic
function openLightbox(img) {
    lightboxImg.src = img.urls.regular;
    lightboxImg.alt = img.alt_description;

    document.getElementById('imageTitle').textContent = img.description || img.alt_description || 'Beautiful Photography';
    document.getElementById('imageAuthor').textContent = `Captured by ${img.user.name}`;
    document.getElementById('downloadBtn').href = img.links.html;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

closeLightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Event Listeners
searchBtn.addEventListener('click', () => searchImages(true));
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchImages(true);
});

// Infinite Scroll logic
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !isSearching) {
        if (currentQuery) {
            searchImages(false);
        }
    }
});
