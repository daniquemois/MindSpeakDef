document.addEventListener('DOMContentLoaded', () => {
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
