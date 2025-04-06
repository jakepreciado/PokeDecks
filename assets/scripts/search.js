// Fetch Pokémon data by name or ID
async function fetchPokemonData(query) {
    try {
        const response = await fetch(`${pokeBaseUrl}pokemon/${query}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch Pokémon:', error);
        return null;
    }
}

// Filter Pokémon by type
async function filterPokemonByType(type) {
    try {
        const response = await fetch(`${pokeBaseUrl}type/${type}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        return data.pokemon.map(pokemonInfo => pokemonInfo.pokemon.name);
    } catch (error) {
        console.error('Failed to fetch Pokémon by type:', error);
        return [];
    }
}

// Filter Pokémon by generation
async function filterPokemonByGeneration(generation) {
    try {
        const response = await fetch(`${pokeBaseUrl}generation/${generation}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        return data.pokemon_species.map(species => species.name);
    } catch (error) {
        console.error('Failed to fetch Pokémon by generation:', error);
        return [];
    }
}

// Search Pokémon by name or ID
async function searchPokemon(query) {
    const data = await fetchPokemonData(query);
    if (data) {
        displayPokemon(data);
    } else {
        console.error('No Pokémon found for the given query.');
    }
}

// Display Pokémon data
function displayPokemon(data) {
    const displayDiv = document.getElementById('pokemon-display');
    displayDiv.innerHTML = ''; // Clear previous content

    const container = document.createElement('div');
    container.classList.add('pokemon-container');

    const image = document.createElement('img');
    image.src = data.sprites.front_default;
    image.alt = data.name;
    container.appendChild(image);

    const name = document.createElement('h2');
    name.textContent = data.name.toUpperCase();
    container.appendChild(name);

    const stats = document.createElement('ul');
    stats.classList.add('stats-list');
    stats.textContent = 'BASE STATS';
    data.stats.forEach(stat => {
        const statItem = document.createElement('li');
        statItem.textContent = `${stat.stat.name.toUpperCase()}: ${stat.base_stat}`;
        stats.appendChild(statItem);
    });
    container.appendChild(stats);

    displayDiv.appendChild(container);
}

// Event listeners for search and filter
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const filterTypeSelect = document.getElementById('filter-type-select');
    const filterGenerationSelect = document.getElementById('filter-generation-select');

    // Search Pokémon on button click
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            searchPokemon(query);
        }
    });

    // Search Pokémon on pressing "Enter"
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                searchPokemon(query);
            }
        }
    });

    // Filter Pokémon by type
    filterTypeSelect.addEventListener('change', async () => {
        const type = filterTypeSelect.value;
        if (type) {
            const pokemonList = await filterPokemonByType(type);
            console.log(`Pokémon of type ${type}:`, pokemonList);
        }
    });

    // Filter Pokémon by generation
    filterGenerationSelect.addEventListener('change', async () => {
        const generation = filterGenerationSelect.value;
        if (generation) {
            const pokemonList = await filterPokemonByGeneration(generation);
            console.log(`Pokémon of generation ${generation}:`, pokemonList);
        }
    });
});