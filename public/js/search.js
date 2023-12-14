const searchInput = document.getElementById('searchInput');
const suggestionsDropdown = document.getElementById('suggestions');

let typingTimer;

searchInput.addEventListener('input', function (event) {
    const searchTerm = event.target.value.trim();

    clearTimeout(typingTimer);
    if (searchTerm) {
        typingTimer = setTimeout(async () => {
            try {
                const response = await fetch(`/search?q=${searchTerm}`);
                const result = await response.json();

                displaySuggestions(result);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        }, 300); // Set a small delay (300ms) to avoid frequent API calls while typing
    } else {
        suggestionsDropdown.style.display = 'none'; // Hide suggestions if search input is empty
    }
});

function displaySuggestions(result) {
    suggestionsDropdown.innerHTML = ''; // Clear previous suggestions
    result.forEach(card => {
        const suggestion = document.createElement('div');
        suggestion.classList.add('suggestion');
        suggestion.textContent = card.title;

        suggestion.addEventListener('click', async () => {
            searchInput.value = card.title; // Set the selected suggestion in the input field
            suggestionsDropdown.style.display = 'none'; // Hide suggestions on selection

            // Perform search with the selected suggestion
            try {
                const response = await fetch(`/search?q=${card.title}`);
                const searchResult = await response.json();

                // Redirect to the page related to the selected suggestion
                window.location.href = `/listings/${encodeURIComponent(card._id)}`;

            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        });

        suggestionsDropdown.appendChild(suggestion);
    });

    if (result.length > 0) {
        suggestionsDropdown.style.display = 'block'; // Show the suggestions dropdown
    } else {
        suggestionsDropdown.style.display = 'none'; // Hide if there are no suggestions
    }
}

// Close suggestions when clicking outside the dropdown
document.addEventListener('click', function (event) {
    if (!event.target.closest('.search-container')) {
        suggestionsDropdown.style.display = 'none';
    }
});