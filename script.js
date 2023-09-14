function toggleMenu(){
    const menu = document.querySelector(".mobile__menu-links");
    const icon = document.querySelector(".mobile__menu-icon");

    const barProgress = document.querySelector(".bar");

    menu.classList.toggle("open");
    icon.classList.toggle("open");
}