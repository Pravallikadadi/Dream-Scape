const ACCESS_KEY = 'z-GznD9KMG_PsVgLdvBxCirlR5o8kpXZ7adhCqvNBvY';

const searchInput  = document.getElementById('searchInput');
const perPageInput = document.getElementById('perPageInput');
const searchBtn    = document.getElementById('searchBtn');
const imageGrid    = document.getElementById('imageGrid');
const statusInfo   = document.getElementById('statusInfo');
const loader       = document.getElementById('loader');

let isLoading = false;

function parsePrompt(prompt) {
  // Extract number
  const numberMatch = prompt.match(/\d+/);
  const count = numberMatch ? parseInt(numberMatch[0], 10) : 5;

  // Remove number + common words
  const query = prompt
    .replace(/\d+/g, '')
    .replace(/images?|photos?|pictures?|of|i want|show/gi, '')
    .trim();

  return {
    count,
    query: query || prompt
  };
}


async function loadImages() {
  if (isLoading) return;

  const prompt = searchInput.value.trim();
  if (!prompt) {
    statusInfo.textContent = 'Please enter a prompt';
    return;
  }

  const { count, query } = parsePrompt(prompt);

  imageGrid.innerHTML = '';
  isLoading = true;

  statusInfo.textContent =
    `Searching "${query}" | Count: ${count}`;

  loader.classList.remove('hidden');

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?` +
      `query=${encodeURIComponent(query)}` +
      `&page=1` +
      `&per_page=${count}` +
      `&client_id=${ACCESS_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      statusInfo.textContent = `No images found for "${query}"`;
      return;
    }

    displayImages(data.results);

    statusInfo.textContent =
      `Showing ${data.results.length} images for "${query}"`;

  } catch (err) {
    console.error(err);
    statusInfo.textContent = err.message;
  } finally {
    loader.classList.add('hidden');
    isLoading = false;
  }
}
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
