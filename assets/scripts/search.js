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

// Fetch Pokémon of a specific type
async function fetchPokemonByType(type) {
    try {
        const response = await fetch(`${pokeBaseUrl}type/${type}`);
        const data = await response.json();
        displayPokemonType(data.pokemon); // Display Pokémon of the selected type
        // return data.pokemon.map(p => p.pokemon.name); // Return a list of Pokémon names

    } catch (error) {
        console.error(`Failed to fetch Pokémon of type ${type}:`, error);
        return [];
    }
}

function displayPokemonType(types) {
    const displayDiv = document.getElementById('pokemon-display');
    displayDiv.innerHTML = ''; // Clear previous content

    const container = document.createElement('div');
    container.classList.add('card-grid');

    types.forEach(async (typeEntry) => {
        try {
            const response = await fetch(typeEntry.pokemon.url);
            const data = await response.json();

            const card = document.createElement('div');
            card.classList.add('pokemon-sprite-card');

            // Pokémon image
            const image = document.createElement('img');
            image.src = data.sprites.front_default;
            image.alt = data.name;
            card.appendChild(image);

            // Pokémon name
            const name = document.createElement('h3');
            name.textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);
            card.appendChild(name);

            // Add click event to fetch and display Pokémon stats
            card.addEventListener('click', () => {
                fetchPokemon(data.name);
                fetchPokemonCard(data.name);
            });

            container.appendChild(card);
        } catch (error) {
            console.error(`Failed to fetch data for ${typeEntry.pokemon.name}:`, error);
        }
    });

    displayDiv.appendChild(container);
}

// Fetch Pokémon of a specific generation
async function fetchPokemonByGeneration(generation) {
    try {
        const response = await fetch(`${pokeBaseUrl}generation/${generation}`);
        const data = await response.json();
        return data.pokemon_species.map(p => p.name); // Return a list of Pokémon names
    } catch (error) {
        console.error(`Failed to fetch Pokémon of generation ${generation}:`, error);
        return [];
    }
}

// Populate dropdowns for types and generations
async function populateDropdowns() {
    try {
        // Populate types
        const typeResponse = await fetch(`${pokeBaseUrl}type/`);
        const typeData = await typeResponse.json();
        const typeDropdown = document.getElementById('type-dropdown');
        typeData.results.forEach(type => {
            const option = document.createElement('option');
            option.value = type.name;
            option.textContent = type.name.charAt(0).toUpperCase() + type.name.slice(1);
            typeDropdown.appendChild(option);
        });

        // Populate generations
        const generationResponse = await fetch(`${pokeBaseUrl}generation/`);
        const generationData = await generationResponse.json();
        const generationDropdown = document.getElementById('generation-dropdown');
        generationData.results.forEach((generation, index) => {
            const option = document.createElement('option');
            option.value = generation.name;
            option.textContent = `Generation ${index + 1}`;
            generationDropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to populate dropdowns:', error);
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

// Search Pokémon by name or ID
async function searchPokemon(query) {
    const data = await fetchPokemonData(query);
    if (data) {
        displayPokemon(data);
    } else {
        console.error('No Pokémon found for the given query.');
    }
}

// Event listeners for search and filter
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const filterTypeSelect = document.getElementById('type-dropdown');
    const filterGenerationSelect = document.getElementById('generation-dropdown');

    // Populate dropdowns
    populateDropdowns();

    // Search Pokémon on button click
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim().toLowerCase();
        if (query) {
            searchPokemon(query);
        }
    });

    // Search Pokémon on pressing "Enter"
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const query = searchInput.value.trim().toLowerCase();
            if (query) {
                searchPokemon(query);
            }
        }
    });

    // Filter Pokémon by type
    filterTypeSelect.addEventListener('change', async () => {
        const type = filterTypeSelect.value;
        if (type) {
            const pokemonList = await fetchPokemonByType(type);
            console.log(`Pokémon of type ${type}:`, pokemonList);
        }
    });

    // Filter Pokémon by generation
    filterGenerationSelect.addEventListener('change', async () => {
        const generation = filterGenerationSelect.value;
        if (generation) {
            const pokemonList = await fetchPokemonByGeneration(generation);
            console.log(`Pokémon of generation ${generation}:`, pokemonList);
        }
    });
});