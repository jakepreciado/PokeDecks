const apiKey = '2dbd2739-5953-460a-b721-31d2c7bfb2a4';
const tcgBaseUrl = 'https://api.pokemontcg.io/v2/';

// Function to fetch Pokémon card data from the backend
async function fetchPokemonCard(pokemon) {
    try {
        const response = await fetch(`${tcgBaseUrl}cards?q=name:${pokemon}`, {
            headers: {
                'X-Api-Key': apiKey, // Add the API key in the headers
            },
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        displayPokemonCard(data.data); // Call function to display all card data
    } catch (error) {
        console.error('Failed to fetch Pokémon card:', error);
        const cardDisplayDiv = document.getElementById('card-display');
        cardDisplayDiv.innerHTML = `<p>Card not found. Please try again.</p>`;
    }
}

// Function to display Pokémon card data on the page
function displayPokemonCard(cards) {
    const cardDisplayDiv = document.getElementById('card-display');
    cardDisplayDiv.innerHTML = ''; // Clear previous content

    if (cards.length === 0) {
        cardDisplayDiv.innerHTML = `<p>No cards found for this Pokémon.</p>`;
        return;
    }

    cards.forEach(card => {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container');

        // Add card image
        const cardImage = document.createElement('img');
        cardImage.src = card.images.small; // Small card image
        cardImage.alt = card.name;
        cardContainer.appendChild(cardImage);

        // Append the card container to the card display div
        cardDisplayDiv.appendChild(cardContainer);
    });
}

// Export the functions if needed (for modularity in ES6+ environments)
export { fetchPokemonCard, displayPokemonCard };