document.addEventListener('DOMContentLoaded', () => {
    function applyFallback(img) {
        img.addEventListener('error', () => {
            img.src = '/images/placeholder.svg';
        });
    }

    const images = document.querySelectorAll('img');
    images.forEach(applyFallback);

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'IMG') {
                    applyFallback(node);
                } else if (node.querySelectorAll) {
                    const nestedImages = node.querySelectorAll('img');
                    nestedImages.forEach(applyFallback);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
});
