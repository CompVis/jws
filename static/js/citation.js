const citationButton = document.querySelector('.citation-field .copy-bibtex-btn');
const citationLabel = citationButton.querySelector('.citation-copy-label');
let citationResetTimer;

citationButton.addEventListener('click', async () => {
    clearTimeout(citationResetTimer);
    try {
        await navigator.clipboard.writeText(document.querySelector('.citation-field code').textContent);
        citationLabel.textContent = 'Copied!';
        citationButton.classList.add('copied');
    } catch {
        citationLabel.textContent = 'Copy failed';
        citationButton.classList.remove('copied');
    }
    citationResetTimer = setTimeout(() => {
        citationLabel.textContent = 'Copy';
        citationButton.classList.remove('copied');
    }, 2000);
});
