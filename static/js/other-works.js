const worksContainer = document.querySelector('.more-works-container');
const worksButton = worksContainer.querySelector('.more-works-btn');
const worksDropdown = document.getElementById('moreWorksDropdown');

function setWorksOpen(isOpen) {
    worksDropdown.classList.toggle('show', isOpen);
    worksButton.classList.toggle('active', isOpen);
    worksButton.setAttribute('aria-expanded', String(isOpen));
    worksDropdown.setAttribute('aria-hidden', String(!isOpen));
}

function updateWorksVisibility() {
    const isScrolled = window.scrollY > 24;
    worksContainer.classList.toggle('is-scrolled', isScrolled);
    worksContainer.inert = isScrolled;
    if (isScrolled) setWorksOpen(false);
}

window.addEventListener('scroll', updateWorksVisibility, { passive: true });
updateWorksVisibility();

worksButton.addEventListener('click', () => {
    setWorksOpen(worksButton.getAttribute('aria-expanded') !== 'true');
});

worksContainer.querySelector('.close-btn').addEventListener('click', () => {
    setWorksOpen(false);
    worksButton.focus();
});

document.addEventListener('click', (event) => {
    if (!worksContainer.contains(event.target)) setWorksOpen(false);
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && worksButton.getAttribute('aria-expanded') === 'true') {
        setWorksOpen(false);
        worksButton.focus();
    }
});
