// ----- MENU BURGER -----
const burgerBtn = document.getElementById("burger-btn");
const nav = document.getElementById("nav");

burgerBtn.addEventListener("click", () => {
  nav.classList.toggle("open");
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
  });
});

// ----- ANNÉE AUTO -----
document.getElementById("year").textContent = new Date().getFullYear();
