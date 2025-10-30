document.addEventListener('DOMContentLoaded', () => {

// Seleciona o botão do menu e a lista de navegação
const toggle = document.getElementById('menu-toggle');
const menu = document.querySelector('nav ul');

// Adiciona evento de clique para abrir/fechar o menu
toggle.addEventListener('click', () => {
  menu.classList.toggle('open');
});

(function() {
  // ==========================
  // Navegação por teclado
  // ==========================
  const interactiveSelectors = 'a, button, input, textarea, select, [role="button"], .button';
  const interactiveElements = document.querySelectorAll(interactiveSelectors);

  interactiveElements.forEach(el => {
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    });
  });

  // ==========================
  // ARIA para modais
  // ==========================
  const modals = document.querySelectorAll('.modal, [role="dialog"]');
  modals.forEach(modal => {
    modal.setAttribute('role', 'dialog');
    if (!modal.hasAttribute('aria-hidden')) modal.setAttribute('aria-hidden', 'true');
  });

  function openModal(modal) { modal.setAttribute('aria-hidden', 'false'); modal.focus(); }
  function closeModal(modal) { modal.setAttribute('aria-hidden', 'true'); }

  // ==========================
  // Botão único para Contraste ou Modo Escuro
  // ==========================
  const modeButton = document.createElement('button');
  modeButton.textContent = 'Modo: Normal';
  modeButton.className = 'button';
  Object.assign(modeButton.style, {
    position: 'fixed', bottom: '10px', right: '10px', zIndex: '9999', transition: 'all 0.3s ease'
  });
  document.body.appendChild(modeButton);

  // Adiciona transição suave no CSS de elementos
  const style = document.createElement('style');
  style.textContent = `
    body, header, .card, form, .projeto-card, .button {
      transition: background-color 0.4s ease, color 0.4s ease, border 0.4s ease;
    }
  `;
  document.head.appendChild(style);

  // Estado cíclico: 0 = Normal, 1 = Alto Contraste, 2 = Modo Escuro
  let modeState = 0;

  function applyMode() {
    const highContrast = modeState === 1;
    const darkMode = modeState === 2;

    // Corpo da página
    document.body.style.backgroundColor = darkMode ? '#121212' : highContrast ? 'var(--cor-neutra-100)' : '';
    document.body.style.color = darkMode ? 'var(--cor-neutra-100)' : highContrast ? 'var(--cor-primaria)' : '';

    // Cabeçalho
    const header = document.querySelector('header');
    if (header) {
      header.style.background = darkMode ? '#1e1e1e' : highContrast ? 'var(--cor-neutra-300)' : '';
      header.style.color = darkMode ? 'var(--cor-neutra-100)' : highContrast ? 'var(--cor-primaria)' : '';
    }

    // Botões
    const buttons = document.querySelectorAll('.button');
    buttons.forEach(btn => {
      if (darkMode) {
        btn.style.backgroundColor = '#333';
        btn.style.color = 'var(--cor-neutra-100)';
        btn.style.border = '1px solid var(--cor-neutra-100)';
      } else if (highContrast) {
        btn.style.backgroundColor = 'var(--cor-primaria)';
        btn.style.color = 'var(--cor-neutra-100)';
        btn.style.border = '2px solid var(--cor-secundaria)';
      } else {
        btn.style.backgroundColor = '';
        btn.style.color = '';
        btn.style.border = '';
      }
    });

    // Cards, formulários e projetos
    const cards = document.querySelectorAll('.card, form, .projeto-card');
    cards.forEach(c => {
      if (darkMode) {
        c.style.backgroundColor = '#1f1f1f';
        c.style.color = 'var(--cor-neutra-100)';
        c.style.border = '1px solid var(--cor-neutra-100)';
      } else if (highContrast) {
        c.style.backgroundColor = 'var(--cor-neutra-100)';
        c.style.color = 'var(--cor-secundaria)';
        c.style.border = '2px solid var(--cor-primaria)';
      } else {
        c.style.backgroundColor = '';
        c.style.color = '';
        c.style.border = '';
      }
    });

    // Atualiza texto do botão
    const labels = ['Modo: Normal', 'Modo: Alto Contraste', 'Modo: Escuro'];
    modeButton.textContent = labels[modeState];
  }

  modeButton.addEventListener('click', () => {
    modeState = (modeState + 1) % 3; // ciclo entre os três modos
    applyMode();
  });

  // ==========================
  // Validação de formulários
  // ==========================
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', e => {
      let valid = true;
      let messages = [];
      const requiredFields = form.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          messages.push(`O campo "${field.name || field.id || 'não identificado'}" é obrigatório.`);
          field.style.border = '2px solid var(--cor-erro)';
        } else { field.style.border = '1px solid var(--cor-neutra-300)'; }
      });

      const emailFields = form.querySelectorAll('input[type="email"]');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      emailFields.forEach(field => {
        if (field.value && !emailRegex.test(field.value)) {
          valid = false;
          messages.push(`O campo "${field.name || field.id}" deve ser um email válido.`);
          field.style.border = '2px solid var(--cor-erro)';
        }
      });

      if (!valid) {
        e.preventDefault();
        let alertBox = document.createElement('div');
        alertBox.className = 'alert error';
        alertBox.innerHTML = messages.join('<br>');
        alertBox.style.position = 'fixed';
        alertBox.style.top = '80px';
        alertBox.style.right = '20px';
        alertBox.style.zIndex = '10000';
        document.body.appendChild(alertBox);
        setTimeout(() => alertBox.remove(), 5000);
      }
    });
  });

  // ==========================
  // Compressão automática de imagens
  // ==========================
  function compressImage(img, quality = 0.7, maxWidth = 1024) {
    const canvas = document.createElement('canvas');
    const scale = Math.min(maxWidth / img.naturalWidth, 1);
    canvas.width = img.naturalWidth * scale;
    canvas.height = img.naturalHeight * scale;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      img.src = url;
    }, 'image/jpeg', quality);
  }

  const allImages = document.querySelectorAll('img');
  allImages.forEach(img => {
    if (!img.dataset.compressed) {
      img.dataset.compressed = true;
      img.onload = () => compressImage(img);
      if (img.complete) compressImage(img);
    }
  });

})();



});
