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
