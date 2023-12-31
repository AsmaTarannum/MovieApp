const KEY = "3fd2be6f0c70a2a598f084ddfb75487c";
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${KEY}&query=`;

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

const getClassByRate = (vote) => {
  if (vote >= 7.5) return "green";
  else if (vote >= 7) return "orange";
  else return "red";
};

const showMovies = (movies) => {
  main.innerHTML = "";
  movies.forEach((movie) => {
    const { title, poster_path, vote_average, overview } = movie;
    const movieElement = document.createElement("div");
    movieElement.classList.add("movie");
    movieElement.innerHTML = `
    <img
      src="${IMG_PATH + poster_path}"
      alt="${title}"
    />
    <div class="movie-info">
      <h3>${title}</h3>
      <span class="${getClassByRate(vote_average)}">${vote_average}</span>
    </div>
    <div class="overview">
      <h3>Overview</h3>
      ${overview}
    </div>
  `;
    main.appendChild(movieElement);
  });
};

const getMovies = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  showMovies(data.results);
};

// Function to get the language parameter from the URL
const getLanguageFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("language") || "en"; // Default to English if language is not specified
};

// Function to update the API URL with the language parameter
const updateApiUrlWithLanguage = (language) => {
  const API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&with_original_language=${language}&api_key=${KEY}&page=1`;
  return API_URL;
};

// Initial load with default language
const initialLanguage = getLanguageFromURL();
const initialApiUrl = updateApiUrlWithLanguage(initialLanguage);
getMovies(initialApiUrl);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value;
  if (searchTerm && searchTerm !== "") {
    getMovies(SEARCH_API + searchTerm);
    search.value = "";
  } else {
    // Reload with the current language when the form is submitted without a search term
    const currentLanguage = getLanguageFromURL();
    const apiUrl = updateApiUrlWithLanguage(currentLanguage);
    getMovies(apiUrl);
  }
});
