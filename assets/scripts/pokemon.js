const pokeBaseUrl = 'https://pokeapi.co/api/v2/';

// Fetch Pokémon data from the API
async function fetchPokemon(pokemon) {
    try {
        const response = await fetch(`${pokeBaseUrl}pokemon/${pokemon}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        displayPokemon(data);
    } catch (error) {
        console.error('Failed to fetch Pokémon:', error);
        displayErrorMessage('Pokémon not found. Please try again.');
    }
}

// Display Pokémon data on the page
function displayPokemon(data) {
    const displayDiv = document.getElementById('pokemon-display');
    displayDiv.innerHTML = ''; // Clear previous content

    const container = createElement('div', 'pokemon-container');

    // Pokémon image
    const image = createElement('img');
    image.src = data.sprites.front_default;
    image.alt = data.name;
    container.appendChild(image);

    // Pokémon info
    const pokemonInfo = createElement('div', 'pokemon-info');

    // Name
    const name = createElement('h2');
    name.textContent = data.name.toUpperCase();
    pokemonInfo.appendChild(name);

    // Types
    const pokemonTypes = createElement('div', 'pokemon-types');
    data.types.forEach((typeInfo, index) => {
        const type = createElement('span');
        type.textContent = typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1);

        if (index < data.types.length - 1) {
            type.textContent += ' /';
        }
        pokemonTypes.appendChild(type);
    });
    pokemonInfo.appendChild(pokemonTypes);

    // Stats
    const statsTable = createElement('table', 'stats-table'); // Create a table for stats

    // Add table headers
    const tableHeader = createElement('tr');
    statsTable.appendChild(tableHeader);

    // Add table rows for each stat
    data.stats.forEach(stat => {
        const tableRow = createElement('tr');

        const statNameCell = createElement('td');
        statNameCell.textContent = stat.stat.name.toUpperCase();

        const statValueCell = createElement('td');
        statValueCell.textContent = stat.base_stat;

        tableRow.appendChild(statNameCell);
        tableRow.appendChild(statValueCell);
        statsTable.appendChild(tableRow);
        console.log(stat.stat.name, stat.base_stat); // Log each stat name and value
    });

    pokemonInfo.appendChild(statsTable);

    container.appendChild(pokemonInfo);
    displayDiv.appendChild(container);
}

// Display an error message
function displayErrorMessage(message) {
    const displayDiv = document.getElementById('pokemon-diplay');
    displayDiv.innerHTML = `<p class="error-message">${message}</p>`;
}

// Utility function to create an element with optional class
function createElement(tag, className = '') {
    const element = document.createElement(tag);
    if (className) {
        element.classList.add(className);
    }
    return element;
}

// Event listeners for search functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    // Trigger search on button click
    searchButton.addEventListener('click', () => {
        const pokemon = searchInput.value.trim().toLowerCase();
        if (pokemon) {
            // Navigate to the new page with the search query as a URL parameter
            window.location.href = `pokemon.html?query=${encodeURIComponent(pokemon)}`;
        }
    });

    // Trigger search on pressing "Enter"
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const pokemon = searchInput.value.trim().toLowerCase();
            if (pokemon) {
                // Navigate to the new page with the search query as a URL parameter
                window.location.href = `pokemon.html?query=${encodeURIComponent(pokemon)}`;
            }
        }
    });
});

// Check if we're on the pokemon.html page and handle query parameters
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('pokemon.html')) {
        // Extract the query parameter from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('query');

        if (query) {
            // Fetch and display the Pokémon data
            fetchPokemon(query);
        }
    }
});