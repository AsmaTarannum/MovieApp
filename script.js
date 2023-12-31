const KEY = "3fd2be6f0c70a2a598f084ddfb75487c";
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${KEY}&query=`;

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const GENRE_SELECT = document.getElementById("genre"); // Add this line

let currentPage = 1;

const getClassByRate = (vote) => {
  if (vote >= 7.5) return "green";
  else if (vote >= 7) return "orange";
  else return "red";
};

const showMovies = (movies) => {
  movies.forEach((movie) => {
    const {
      title,
      poster_path,
      vote_average,
      overview,
      release_date,
      original_language,
      genre_ids,
      adult,
      id,
      video,
      vote_count,
      popularity,
    } = movie;

    const movieElement = document.createElement("div");
    movieElement.classList.add("movie");

    // Set the poster path or use a placeholder if not available
    const posterSrc = poster_path
      ? IMG_PATH + poster_path
      : "https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg";

    movieElement.innerHTML = `
      <img src="${posterSrc}" alt="${title}" />
      <div class="movie-info">
        <h3>${title}</h3>
        <span class="${getClassByRate(vote_average)}">${vote_average}</span>
      </div>
      <div class="overview">
        <h3>Overview</h3>
        <p><strong>Release Date:</strong> ${release_date}</p>
        <p><strong>Vote Count:</strong> ${vote_count}</p>
        <p><strong>Popularity:</strong> ${popularity}</p>
        <p><strong>Plot:</strong>${overview}</p>
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

const getLanguageFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("language") || "en";
};

const updateApiUrlWithLanguageAndPage = (language, page, genre) => {
  console.log("page number:", page);
  const genreParam = genre ? `&with_genres=${genre}` : '';
  const API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=release_date.desc&with_original_language=${language}${genreParam}&api_key=${KEY}&page=${page}`;
  return API_URL;
};

const initialLanguage = getLanguageFromURL();
const initialApiUrl = updateApiUrlWithLanguageAndPage(initialLanguage, currentPage, ""); // Add an empty string as the initial genre
getMovies(initialApiUrl);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value;
  const selectedGenre = GENRE_SELECT.value;
  if ((searchTerm && searchTerm !== "") || selectedGenre !== "") {
    getMovies(SEARCH_API + searchTerm + `&with_genres=${selectedGenre}`);
    search.value = "";
  } else {
    const currentLanguage = getLanguageFromURL();
    const apiUrl = updateApiUrlWithLanguageAndPage(currentLanguage, currentPage, selectedGenre);
    getMovies(apiUrl);
  }
});

window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    currentPage++;
    const currentLanguage = getLanguageFromURL();
    const selectedGenre = GENRE_SELECT.value;
    const apiUrl = updateApiUrlWithLanguageAndPage(currentLanguage, currentPage, selectedGenre);
    getMovies(apiUrl);
  }
});

const fetchGenres = async () => {
  const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${KEY}`);
  const data = await res.json();
  const genres = data.genres;

  genres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre.id;
    option.text = genre.name;
    GENRE_SELECT.appendChild(option);
  });
};
// Event listener for the genre selection
GENRE_SELECT.addEventListener("change", () => {
  currentPage = 1; // Reset the page when the genre changes
  const currentLanguage = getLanguageFromURL();
  const selectedGenre = GENRE_SELECT.value;
  const apiUrl = updateApiUrlWithLanguageAndPage(currentLanguage, currentPage, selectedGenre);
  main.innerHTML = ""; // Clear existing movies
  getMovies(apiUrl);
});
fetchGenres();
