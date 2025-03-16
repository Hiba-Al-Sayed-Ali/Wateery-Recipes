
//Page 2
// ------------------------Photo Section---------------------------
document.addEventListener("DOMContentLoaded", async function () {
    const container = document.getElementById("recipe-container");
    const mainTitle = document.getElementById("main-title");
    const description = document.getElementById("description");
    const button = document.getElementById("recipe-btn");

    let currentRecipeIndex = 0;

    async function fetchRecipes() {
        const apiKey = 'eb57c4edb02f476fa04fd2af6d431399';
        const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=10`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (!data.results || data.results.length === 0) {
                console.error("No recipes found.");
                return;
            }

            const recipes = data.results;

            function updateRecipe() {
                const recipe = recipes[currentRecipeIndex];

                if (!recipe || !recipe.image) {
                    console.error("Missing recipe data:", recipe);
                    return;
                }

                container.style.backgroundImage = `url(${recipe.image})`;
                mainTitle.textContent = recipe.title;
                description.textContent = `A delicious recipe for ${recipe.title}. Enjoy cooking!`;

                button.onclick = () => {
                    window.location.href = `https://spoonacular.com/recipes/${recipe.title}-${recipe.id}`;
                };

                currentRecipeIndex = (currentRecipeIndex + 1) % recipes.length;
            }

            updateRecipe(); // Show first recipe immediately
            setInterval(updateRecipe, 10000); // Update every 10 seconds

        } catch (error) {
            console.error("Error fetching recipes:", error);
        }
    }

    fetchRecipes();
});

// ------------------------Video Section---------------------------
const SPOONACULAR_API_KEY = "eb57c4edb02f476fa04fd2af6d431399";
const PEXELS_API_KEY = "pWUWap3rKFArESfWAiqcyQXykcNZ7RlfS5dFZLxsqT3JYWB5TSMuxHjo";

async function fetchRecipesH() {
    const spoonacularURL = `https://api.spoonacular.com/recipes/complexSearch?number=3&addRecipeInformation=true&apiKey=${SPOONACULAR_API_KEY}`;

    try {
        const response = await fetch(spoonacularURL);
        const data = await response.json();

        document.getElementById("recipeContainerH").innerHTML = "";

        if (data.results) {
            data.results.forEach((recipe, index) => {
                fetchRecipeVideoH(recipe, index + 1);
            });
        }
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }
}

async function fetchRecipeVideoH(recipe, index) {
    const pexelsURL = `https://api.pexels.com/videos/search?query=${recipe.title}&per_page=1`;

    try {
        const response = await fetch(pexelsURL, {
            headers: {
                Authorization: PEXELS_API_KEY
            }
        });
        const videoData = await response.json();

        let videoURL = videoData.videos.length > 0 ? videoData.videos[0].video_files[0].link : null;
        displayRecipeH(recipe, videoURL, index);
    } catch (error) {
        console.error("Error fetching video:", error);
    }
}

function displayRecipeH(recipe, videoURL, index) {
    const container = document.getElementById("recipeContainerH");

    const recipeElement = document.createElement("div");
    recipeElement.classList.add("recipe-item-h");
    recipeElement.id = `recipe-${index}-h`;

    recipeElement.innerHTML = `
        <div class="recipe-left-h">
            <h2>${recipe.title}</h2>
            <p>${recipe.summary.replace(/<[^>]+>/g, '').substring(0, 300)}...</p>
        </div>
        ${videoURL ? `<div class="recipe-right-h">
            <video controls>
                <source src="${videoURL}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>` : "<p>No video available</p>"}
    `;

    container.appendChild(recipeElement);
}

window.onload = fetchRecipesH;

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
