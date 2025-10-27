// Seleciona o botão do menu e a lista de navegação
const toggle = document.getElementById('menu-toggle');
const menu = document.querySelector('nav ul');

// Adiciona evento de clique para abrir/fechar o menu
toggle.addEventListener('click', () => {
  menu.classList.toggle('open');
});
