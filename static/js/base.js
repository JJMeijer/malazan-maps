(function wrapper() {
    const setupSearch = () => {
        const searchResultsBox = document.getElementById('search-results');
        const searchBox = document.getElementById('search');

        searchBox.addEventListener('focus', () => {
            searchResultsBox.classList.remove('hidden');
        });

        searchBox.addEventListener('blur', () => {
            searchResultsBox.classList.add('hidden');
        });
    };

    setupSearch();
}());
