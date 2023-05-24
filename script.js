// API endpoint
const apiUrl = 'https://www.themealdb.com/api/json/v1/1';

// Function to search meals based on a query
async function searchMeals(query) {
  const response = await fetch(`${apiUrl}/search.php?s=${query}`);
  const data = await response.json();
  return data.meals || [];
}

// Function to get meal details by ID
async function getMealById(mealId) {
  const response = await fetch(`${apiUrl}/lookup.php?i=${mealId}`);
  const data = await response.json();
  return data.meals[0];
}

// Function to display search results
function displaySearchResults(results) {
  const searchResults = document.getElementById('search-results');
  searchResults.innerHTML = '';

  results.forEach((meal) => {
    const li = document.createElement('li');
    li.textContent = meal.strMeal;
    li.addEventListener('click', () => {
      showMealDetails(meal.idMeal);
    });

    const button = document.createElement('button');
    button.textContent = 'Add to Favorites';
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      addToFavorites(meal);
    });

    li.appendChild(button);
    searchResults.appendChild(li);
  });
}

// Function to display favorite meals
function displayFavorites() {
  const favoritesList = document.getElementById('favorites-list');
  favoritesList.innerHTML = '';

  const favorites = getFavorites();

  favorites.forEach((meal) => {
    const li = document.createElement('li');
    li.textContent = meal.strMeal;

    const button = document.createElement('button');
    button.textContent = 'Remove from Favorites';
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      removeFromFavorites(meal);
    });

    li.appendChild(button);
    favoritesList.appendChild(li);
  });
}

// Function to add a meal to favorites
function addToFavorites(meal) {
  const favorites = getFavorites();
  favorites.push(meal);
  saveFavorites(favorites);
  displayFavorites();
}

// Function to remove a meal from favorites
function removeFromFavorites(meal) {
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter((favMeal) => favMeal.idMeal !== meal.idMeal);
  saveFavorites(updatedFavorites);
  displayFavorites();
}

// Function to show meal details
async function showMealDetails(mealId) {
  const mealDetailsContainer = document.getElementById('meal-details-container');
  const mealName = document.getElementById('meal-name');
  const mealImage = document.getElementById('meal-image');
  const mealInstructions = document.getElementById('meal-instructions');
  const addToFavoritesBtn = document.getElementById('add-to-favorites-btn');
  const removeFromFavoritesBtn = document.getElementById('remove-from-favorites-btn');

  const meal = await getMealById(mealId);

  if (meal) {
    mealName.textContent = meal.strMeal;
    mealImage.src = meal.strMealThumb;
    mealInstructions.textContent = meal.strInstructions;

    mealDetailsContainer.style.display = 'block';

    if (isMealFavorite(meal)) {
      addToFavoritesBtn.style.display = 'none';
      removeFromFavoritesBtn.style.display = 'inline-block';
    } else {
      addToFavoritesBtn.style.display = 'inline-block';
      removeFromFavoritesBtn.style.display = 'none';
    }
  }
}

// Function to save favorites to localStorage
function saveFavorites(favorites) {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Function to retrieve favorites from localStorage
function getFavorites() {
  const favoritesString = localStorage.getItem('favorites');
  return favoritesString ? JSON.parse(favoritesString) : [];
}

// Function to check if a meal is a favorite
function isMealFavorite(meal) {
  const favorites = getFavorites();
  return favorites.some((favMeal) => favMeal.idMeal === meal.idMeal);
}

// Function to handle search input
function handleSearchInput(event) {
  const query = event.target.value;
  if (query.length >= 1) {
    searchMeals(query)
      .then((results) => {
        displaySearchResults(results);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  } else {
    document.getElementById('search-results').innerHTML = '';
  }
}

// Event listener for search input
document.getElementById('search-input').addEventListener('input', handleSearchInput);

// Initial setup
displayFavorites();
