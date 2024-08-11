document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname.split('/').pop(); // Haal de huidige bestandsnaam op
    const navLinks = document.querySelectorAll('.nav-left a');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');

        if (linkPath === currentPath) {
            link.classList.add('active'); // Voeg de 'active' class toe aan de juiste link
        }
    });

    const aiToggle = document.getElementById('aiToggle');
    const fieldset = aiToggle.closest('fieldset');

    // Controleer de huidige status bij het laden van de pagina
    if (aiToggle.checked) {
        fieldset.classList.add('active');
    } else {
        fieldset.classList.remove('active');
    }

    // Luister naar veranderingen in de checkbox
    aiToggle.addEventListener('change', () => {
        if (aiToggle.checked) {
            fieldset.classList.add('active');
        } else {
            fieldset.classList.remove('active');
        }
    });
});
