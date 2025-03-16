// ------------------------Food Comparison Section---------------------------
document.addEventListener("DOMContentLoaded", function () {
    fetchProduct(1, "737628064502");  
    fetchProduct(2, "1234567890123"); 
});

function fetchProduct(productId, barcode) {
    let apiUrl = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.product) {
                updateProductCard(productId, data.product);
                localStorage.setItem("lastProduct" + productId, JSON.stringify(data.product));
            }
        })
        .catch(error => {
            console.error("Error fetching product:", error);
        });
}

// Update product card dynamically
function updateProductCard(productId, product) {
    document.getElementById(`product-image-${productId}`).src = product.image_url || "https://via.placeholder.com/100";
    document.getElementById(`product-name-${productId}`).textContent = product.product_name || "Unknown Product";
    document.getElementById(`product-ingredients-${productId}`).textContent = "Ingredients: " + (product.ingredients_text || "Not available");
    document.getElementById(`product-nutrition-${productId}`).textContent = "Nutritional Info: " +
        (product.nutriments["energy-kcal_100g"] ? product.nutriments["energy-kcal_100g"] + " kcal per 100g" : "Not available");
}

function searchProduct() {
    let query = document.getElementById("search-input").value.trim();

    if (!query) {
        alert("Please enter a product barcode or name.");
        return;
    }

    let searchUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&json=1`;

    fetch(searchUrl)
        .then(response => response.json())
        .then(data => {
            if (data.products && data.products.length > 0) {
                let foundProduct = data.products[0]; 
                let barcode = foundProduct.code; 
                fetchProduct(1, barcode);
            } else {
                alert("No product found. Try another search.");
            }
        })
        .catch(error => {
            console.error("Error fetching product:", error);
            alert("Failed to fetch product data.");
        });
}

// ------------------------Recipe slider Section---------------------------
document.addEventListener("DOMContentLoaded", function () {
    fetchRecipes();
    startAutoSlide();

    document.getElementById("recipe-slider").addEventListener("touchstart", function () {
        clearInterval(autoSlide);
    });
});

let autoSlide;

function fetchRecipes() {
    let apiUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s="; 
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.meals) {
                displayRecipes(data.meals.slice(0, 40)); 
            }
        })
        .catch(error => {
            console.error("Error fetching recipes:", error);
        });
}

function displayRecipes(recipes) {
    let slider = document.getElementById("recipe-slider");
    slider.innerHTML = "";

    recipes.forEach(recipe => {
        let recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");
        
        recipeCard.innerHTML = `
            <div class="image-container">
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
            </div>
            <h2>${recipe.strMeal}</h2>
            <p class="steps">Time: Approx 30-45 min</p>
            <p class="steps">Steps: ${recipe.strInstructions.substring(0, 100)}...</p>
        `;

        slider.appendChild(recipeCard);
    });
}

function scrollSlider(direction) {
    let slider = document.getElementById("recipe-slider");
    let scrollAmount = 300; 
    slider.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

function startAutoSlide() {
    autoSlide = setInterval(() => {
        scrollSlider(1);
    }, 5000);
}

document.getElementById('load-magic-recipe-btn').addEventListener('click', fetchRecipe);

// ------------------------Random Recipe Section---------------------------
function fetchRecipe() {
    const apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/random.php";

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const recipe = data.drinks[0];
            const recipeCard = createRecipeCard(recipe);
            document.querySelector('.recipee-section').appendChild(recipeCard);
            saveRecipeToLocalStorage(recipe);
        })
        .catch(error => console.error('Error fetching recipe:', error));
}

function createRecipeCard(recipe) {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipee-card');
    recipeCard.setAttribute('data-id', recipe.idDrink);
    const recipeContent = document.createElement('div');
    recipeContent.classList.add('recipee-content');

    const recipeImage = document.createElement('img');
    recipeImage.classList.add('recipee-image');
    recipeImage.src = recipe.strDrinkThumb;
    recipeImage.alt = recipe.strDrink;

    const recipeText = document.createElement('div');
    recipeText.classList.add('recipee-text');

    const recipeName = document.createElement('h2');
    recipeName.classList.add('recipee-name');
    recipeName.textContent = recipe.strDrink;

    const recipeInstructions = document.createElement('p');
    recipeInstructions.classList.add('recipee-instructions');
    recipeInstructions.textContent = recipe.strInstructions;

    const saveButton = document.createElement('button');
    saveButton.classList.add('save-recipee-btn');
    saveButton.textContent = 'Save Recipe';
    
    saveButton.addEventListener('click', () => {
        saveRecipeToLocalStorage(recipe);
        alert('Recipe saved successfully!');  
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-recipee-btn');
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>'; 

    deleteButton.addEventListener('click', () => {
        deleteRecipeFromLocalStorage(recipe.idDrink);
        recipeCard.remove();
    });

    recipeText.appendChild(recipeName);
    recipeText.appendChild(recipeInstructions);
    recipeText.appendChild(saveButton);

    recipeContent.appendChild(recipeImage);
    recipeContent.appendChild(recipeText);

    recipeCard.appendChild(recipeContent);
    recipeCard.appendChild(deleteButton);  
    return recipeCard;
}

function saveRecipeToLocalStorage(recipe) {
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    if (!savedRecipes.some(savedRecipe => savedRecipe.idDrink === recipe.idDrink)) {
        savedRecipes.push(recipe); 
        localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    }
}

function deleteRecipeFromLocalStorage(recipeId) {
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    const updatedRecipes = savedRecipes.filter(recipe => recipe.idDrink !== recipeId);
    localStorage.setItem('savedRecipes', JSON.stringify(updatedRecipes));
}

function loadSavedRecipes() {
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    savedRecipes.forEach(recipe => {
        const recipeCard = createRecipeCard(recipe);
        document.querySelector('.recipee-section').appendChild(recipeCard);
    });
}

window.onload = loadSavedRecipes;

// ------------------------Nav Bar---------------------------
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            mobileMenu.classList.toggle('active');
        });
    }
});

// ------------------------Dark/Light Mode---------------------------
document.addEventListener("DOMContentLoaded", function () {
    const toggleBtns = document.querySelectorAll("#theme-toggle");
    const body = document.body;
    
    toggleBtns.forEach(toggleBtn => {
        const icon = toggleBtn.querySelector("i");

        if (localStorage.getItem("theme") === "dark") {
            body.classList.add("dark-mode");
            toggleBtns.forEach(btn => btn.querySelector("i").classList.replace("fa-moon", "fa-sun"));
        }

        toggleBtn.addEventListener("click", function () {
            body.classList.toggle("dark-mode");

            if (body.classList.contains("dark-mode")) {
                localStorage.setItem("theme", "dark");
                toggleBtns.forEach(btn => btn.querySelector("i").classList.replace("fa-moon", "fa-sun"));
            } else {
                localStorage.setItem("theme", "light");
                toggleBtns.forEach(btn => btn.querySelector("i").classList.replace("fa-sun", "fa-moon"));
            }
        });
    });
});
