
const apiKey = "f531333d637d0c44abc85b3e74db2186";


// Function to fetch movie data
async function fetchMovies() {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`
        );
        const data = await response.json();
    
        // return data.results;
        moviesData = data.results; // Store the fetched movies data
        return moviesData;
        
    } catch (error) {
        console.error("Error fetching movies:", error);
        return [];
    }
}
let favoriteMovies = [];
function updateLocalStorage() {
    localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
}
// Function to check if a movie is already in the favorites
function isMovieInFavorites(movie) {
    return favoriteMovies.some((favMovie) => favMovie.id === movie.id);
}

function addToFavorites(movie) {
    if (!isMovieInFavorites(movie)) {
        favoriteMovies.push(movie);
        updateLocalStorage();
        updateFavoritesTabButton();
        // Re-render the favorite movies when adding a new one
        if (document.getElementById("favorites-tab-button").classList.contains("active-tab"))
         {
            renderFavoriteMovies();
        }
    }
}


// Function to remove a movie from favorites
function removeFromFavorites(movie) {
    favoriteMovies = favoriteMovies.filter((favMovie) => favMovie.id !== movie.id);
    updateLocalStorage();
    updateFavoritesTabButton();
    
}
function updateFavoritesTabButton() {
    const favoritesTabButton = document.getElementById("favorites-tab-button");
    if (favoriteMovies.length > 0) {
        favoritesTabButton.textContent = `Favorites (${favoriteMovies.length})`;
    } else {
        favoritesTabButton.textContent = "Favorites";
    }
}

// // Function to load favorite movies from local storage
function loadFavoriteMovies() {
    const storedFavorites = localStorage.getItem("favoriteMovies");
    if (storedFavorites) {
        favoriteMovies = JSON.parse(storedFavorites);
        updateFavoritesTabButton();
        
    }
}

function renderFavoriteMovies() {
    renderMovies(favoriteMovies);
}

function removeFromFavorites(movie) {
    favoriteMovies = favoriteMovies.filter((favMovie) => favMovie.id !== movie.id);
    updateLocalStorage();
    updateFavoritesTabButton();
    // Re-render the favorite movies when removing one
    // if (document.getElementById("favorites-tab-button").classList.contains("active-tab")) {
    //     renderFavoriteMovies();
    // }
}


// Function to render movie cards
function renderMovies(movies) {
    const movieList = document.querySelector(".movie-list");
    movieList.innerHTML = "";

    movies.forEach((movie) => {
        const card = document.createElement("li");
        card.classList.add("movie-card");

        const title = document.createElement("h2");
        title.textContent = movie.title;

        const voteCount = document.createElement("p");
        voteCount.textContent = `Votes: ${movie.vote_count}`;
        
        const voteAverage = document.createElement("p");
        voteAverage.textContent = `Average Rating: ${movie.vote_average}`;

        const poster = document.createElement("img");
        poster.src = `https://image.tmdb.org/t/p/original/${movie.poster_path}`;
        poster.alt = movie.title;

        const favBtn=document.createElement("button");
        favBtn.classList.add("fav-button");
        

        // const favButton=document.getElementById('favBtn');
        favBtn.textContent="❤️";
        favBtn.addEventListener("click", () => {
            addToFavorites(movie);
        });
        

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        // removeBtn.classList.add("remove-button");
        removeBtn.addEventListener("click", () => {
            removeFromFavorites(movie);
            renderFavoriteMovies(); // Re-render the favorite movies after removal
        });
        
        
       
        card.appendChild(poster);
        card.appendChild(title);
        card.appendChild(voteCount);
        card.appendChild(voteAverage);
        card.appendChild(favBtn);
        card.appendChild(removeBtn);

        movieList.appendChild(card);
    });
}


// Function to sort movies by date
let moviesData = []; // Store the fetched movies data
let sortByDateAscending = true; // Track sorting order for date
let sortByRatingAscending = true; // Track sorting order for rating

// Function to toggle sorting order and update button text
function toggleSort(option) {
    if (option === "date") {
        sortByDateAscending = !sortByDateAscending;
        const buttonText = sortByDateAscending
            ? "Sort by date (oldest to latest)"
            : "Sort by date (latest to oldest)";
        document.querySelector(".sorting-options button:first-child").textContent = buttonText;
        sortByDate(sortByDateAscending);
    } else if (option === "rating") {
        sortByRatingAscending = !sortByRatingAscending;
        const buttonText = sortByRatingAscending
            ? "Sort by rating (least to most)"
            : "Sort by rating (most to least)";
        document.querySelector(".sorting-options button:last-child").textContent = buttonText;
        sortByRating(sortByRatingAscending);
    }
}

// Function to sort movies by date
function sortByDate(ascending) {
    const sortedMovies = [...moviesData]; // Create a copy of the original data
    sortedMovies.sort((a, b) => {
        const dateA = new Date(a.release_date);
        const dateB = new Date(b.release_date);
        if (ascending) {
            return dateA - dateB;
        } else {
            return dateB - dateA;
        }
    });
    renderMovies(sortedMovies); // Render the sorted movies
}

function sortByRating(ascending) {
    const sortedMovies = [...moviesData]; // Create a copy of the original data
    sortedMovies.sort((a, b) => {
        if (ascending) {
            return a.vote_average - b.vote_average;
        } else {
            return b.vote_average - a.vote_average;
        }
    });
    renderMovies(sortedMovies); // Render the sorted movies
}


function toggleRemoveButtons() {
    const removeButtons = document.querySelectorAll(".remove-button");

    removeButtons.forEach((button) => {
        if (button.style.display === "none") {
            button.style.display = "block";
        } else {
            button.style.display = "block";
        }
    });
}

// ================================Render all movies==============================
function showAllMovies() {
    renderMovies(moviesData); 
}

// ===========================Function to handle search============================
async function searchMovies() {
    const searchInput = document.getElementById("search-input");
    const searchTerm = searchInput.value.trim();

    if (searchTerm === "") {
        alert("Please enter a search term.");
        return;
    }

    const movies = await fetchMovies();
    const searchResults = movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    renderMovies(searchResults);
}


document.addEventListener("DOMContentLoaded", async () => {
   

// ========================================================================================

    const movies = await fetchMovies();
    renderMovies(movies);
    loadFavoriteMovies();
    showAllMovies(); 


    document.getElementById("favorites-tab-button").addEventListener("click", () => {
        renderFavoriteMovies();
        // toggleRemoveButtons();
        
    });

    document.querySelector(".sort-by-date-button").addEventListener("click", () => {
        const sortedMovies = sortByDate(movies, true);
        renderMovies(sortedMovies);
        
    });

    document.querySelector(".sort-by-rating-button").addEventListener("click", () => {
        const sortedMovies = sortByRating(movies, true);
        renderMovies(sortedMovies);
    });

    document.querySelector(".search-bar").addEventListener("click", searchMovies);

    document.getElementById("next-button").addEventListener("click", nextPage);

    // Event listener for the "Previous" button
    document.getElementById("prev-button").addEventListener("click", prevPage);
});

// Function to fetch movies by page number
async function fetchMoviesByPage(page) {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=${page}`
        );
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error",error);
        return [];
    }
}
let currentPage = 1;
const totalPages = 3;
async function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        document.getElementById("prev-button").removeAttribute("disabled");
        document.getElementById("current-page").textContent = currentPage;
        const movies = await fetchMoviesByPage(currentPage);
        renderMovies(movies);
        if (currentPage === totalPages) {
            document.getElementById("next-button").setAttribute("disabled", "true");
        }
    }
}

// Function to load the previous page of movies
async function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        document.getElementById("next-button").removeAttribute("disabled");
        document.getElementById("current-page").textContent = currentPage;
        const movies = await fetchMoviesByPage(currentPage);
        renderMovies(movies);
        if (currentPage === 1) {
            document.getElementById("prev-button").setAttribute("disabled", "true");
        }
    }
}



