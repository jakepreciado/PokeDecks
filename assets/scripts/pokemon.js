const pokeBaseUrl = 'https://pokeapi.co/api/v2/';

async function fetchPokemon(pokemon) {
    try {
        const response = await fetch(`${pokeBaseUrl}pokemon/${pokemon}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        console.log(data); // Log the Pokémon data
        displayPokemon(data); // Call the function to display the Pokémon data
    } catch (error) {
        console.error('Failed to fetch Pokémon:', error);
    }
}


// Function to display Pokémon data on the page
function displayPokemon(data) {
    const container = document.createElement('div');
    container.classList.add('pokemon-container');

    // Add Pokémon image
    const image = document.createElement('img');
    image.src = data.sprites.front_default; // Front-facing sprite
    image.alt = data.name;
    container.appendChild(image);

    const pokemonInfo = document.createElement('div');
    pokemonInfo.classList.add('pokemon-info');

    // Add Pokémon name
    const name = document.createElement('h2');
    name.textContent = data.name.toUpperCase();
    pokemonInfo.appendChild(name);

    // // Add base stats
    // const stats = document.createElement('div');
    // stats.classList.add('stats-list');
    // const pokemonTypes = document.createElement('div');
    // pokemonTypes.classList.add('pokemon-types');
    // data.types.forEach(typeInfo => {
    //     const pokemonType = document.createElement('p');
    //     pokemonType.textContent = `${typeInfo.type.name}`;
    //     pokemonTypes.appendChild(pokemonType);
    // });
    // pokemonInfo.appendChild(pokemonTypes);


    // data.stats.forEach(stat => {
    //     const statItem = document.createElement('p');
    //     statItem.textContent = `${stat.stat.name.toUpperCase()}: ${stat.base_stat}`;
    //     stats.appendChild(statItem);
    // });
    // pokemonInfo.appendChild(stats);

    container.appendChild(pokemonInfo);

    // Append the container to the #pokemon-display div
    const displayDiv = document.getElementById('pokemon-display');
    displayDiv.innerHTML = ''; // Clear previous content
    displayDiv.appendChild(container);
}


document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    // Trigger search on button click
    searchButton.addEventListener('click', () => {
        const pokemon = searchInput.value.trim();
        if (pokemon) {
            fetchPokemon(pokemon);
            fetchPokemonCard(pokemon);
        }
    });

    // Trigger search on pressing "Enter"
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const pokemon = searchInput.value.trim();
            if (pokemon) {
                fetchPokemon(pokemon);
                fetchPokemonCard(pokemon);
            }
        }
    });
});

// Example usage: Fetch data for Pikachu
