function toggleMenu(){
    const menu = document.querySelector(".mobile__menu_links");
    const icon = document.querySelector(".mobile__menu_icon");

    menu.classList.toggle("open");
    icon.classList.toggle("open");

}