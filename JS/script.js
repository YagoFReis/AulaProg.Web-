
// Menu mobile
 
    const toggle = document.getElementById('menu-toggle');
    const menu = document.querySelector('nav ul');
    toggle.addEventListener('click', () => {
        menu.classList.toggle('open');
    });