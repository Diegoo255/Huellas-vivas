// --- LÓGICA DE INICIALIZACIÓN Y EVENTOS ---
document.addEventListener('DOMContentLoaded', function() {
    
    // --- LÓGICA DEL SIDEBAR ---
    const menuToggle = document.getElementById('menu');
    const sidebar = document.getElementById('sidebar');
    const body = document.body;
    const closeBtn = document.getElementById('close-sidebar'); 
    
    function toggleMenu() {
        if (sidebar) {
            sidebar.classList.toggle('open');
            body.classList.toggle('menu-open');
            sidebar.style.left = ''; 
        }
    }
    // ... (otras funciones del sidebar: closeMenu, showMenuHover, hideMenuHover) ...
    function closeMenu() {
        if (sidebar) {
            sidebar.classList.remove('open');
            body.classList.remove('menu-open');
            sidebar.style.left= '-250px';
        }
    }

    function showMenuHover() {
        if (sidebar && !sidebar.classList.contains('open')) {
            sidebar.style.left = '0';
        }
    }

    function hideMenuHover() {
        if (sidebar && !sidebar.classList.contains('open')) {
            sidebar.style.left = '-250px';
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
        menuToggle.addEventListener('mouseenter', showMenuHover);
        menuToggle.addEventListener('mouseleave', hideMenuHover);
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu); 
    }

    if (sidebar) {
        sidebar.addEventListener('mouseenter', showMenuHover);
        sidebar.addEventListener('mouseleave', hideMenuHover);
    }
    // --- FIN LÓGICA DEL SIDEBAR ---

});