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
        console.log(data); // Log the card data for debugging
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
        cardImage.setAttribute('loading', 'lazy'); // Lazy load the image
        cardImage.setAttribute('width', '240'); // Set width for the image
        cardImage.setAttribute('height', '330'); // Set height for the image
        cardImage.classList.add('pokemon-card-image');

        // cardImage.onerror = () => {
        //     cardImage.src = '/path/to/placeholder-image.png'; // Replace with the actual path to your placeholder image
        // };

        cardContainer.appendChild(cardImage);

        // Add card information
        const cardInfo = document.createElement('div');
        cardInfo.classList.add('card-info');
        const setName = document.createElement('h3');
        setName.textContent = card.set.name; // Set name
        const rarity = document.createElement('p');
        rarity.textContent = `Rarity: ${card.rarity}`; // Card rarity
        const cardValue = document.createElement('p');
        const cardPrice = card.cardmarket?.prices?.averageSellPrice;
        cardValue.textContent = cardPrice
            ? `Value: $${cardPrice.toFixed(2)} USD`
            : `Value: Not available`;

        cardInfo.appendChild(setName);
        cardInfo.appendChild(rarity);
        cardInfo.appendChild(cardValue);
        cardContainer.appendChild(cardInfo);

        cardDisplayDiv.appendChild(cardContainer);

    });
}

// Export the functions if needed (for modularity in ES6+ environments)
export { fetchPokemonCard, displayPokemonCard };