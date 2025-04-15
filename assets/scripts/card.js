const apiKey = '2dbd2739-5953-460a-b721-31d2c7bfb2a4';
const tcgBaseUrl = 'https://api.pokemontcg.io/v2/';

let loadedCards = [];
let isSetSearchGlobal = false;

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
        cardDisplayDiv.innerHTML = `<p class="empty-message">Card not found. Please try again.</p>`;
    }
}

// Function to display Pokémon card data on the page
export function displayPokemonCard(cards, isSetSearch = false) {
    const collection = JSON.parse(localStorage.getItem('myCollection')) || [];
    const wishlist = JSON.parse(localStorage.getItem('myWishlist')) || [];

    loadedCards = cards;
    isSetSearchGlobal = isSetSearch;

    const displayDivHeader = document.getElementById('card-display-header');
    if (displayDivHeader) {
        displayDivHeader.textContent = `Displaying ${cards.length} Cards`;
    }

    const cardDisplayDiv = document.getElementById('card-display');
    if (cardDisplayDiv) {
        cardDisplayDiv.innerHTML = '';
    }

    const sortingOptions = document.getElementById('sorting-options');

    if (cardDisplayDiv && cards.length === 0) {
        cardDisplayDiv.innerHTML = `<p class="empty-message">No cards found for this Pokémon.</p>`;
        return;
    }

    sortingOptions.style.display = 'flex';

    cards.forEach(card => {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container');

        // Add card image
        const cardImage = document.createElement('img');
        cardImage.src = card.images.small;
        cardImage.onerror = () => {
            cardImage.src = '../images/card-placeholder.png'; // Fallback to placeholder image
        };
        cardImage.alt = card.name;
        cardImage.setAttribute('loading', 'lazy'); 
        cardImage.setAttribute('width', '240px');
        cardImage.setAttribute('height', '330px');
        cardImage.classList.add('pokemon-card-image');
        const isInCollection = collection.some(item => item.id === card.id);
        const isInWishlist = wishlist.some(item => item.id === card.id);
        if (isInWishlist) {
            cardImage.classList.add('added-to-wishlist'); // Add the class if the card is in the wishlist
        }
        if (isInCollection) {
            cardImage.classList.add('added-to-collection'); // Add the class if the card is in the collection
        }

        cardContainer.appendChild(cardImage);

        // Add card information
        const cardInfo = document.createElement('div');
        cardInfo.classList.add('card-info');

        const nameElement = document.createElement('h3');
        nameElement.textContent = isSetSearch ? card.name : card.set.name; // Use Pokémon name if searching by set

        const rarity = document.createElement('p');
        rarity.textContent = `Rarity: ${card.rarity}`;

        const cardValue = document.createElement('p');
        const cardPrice = card.cardmarket?.prices?.averageSellPrice;
        cardValue.textContent = cardPrice
            ? `Value: $${cardPrice.toFixed(2)} USD`
            : `Value: Not available`;

        cardInfo.appendChild(nameElement);
        cardInfo.appendChild(rarity);
        cardInfo.appendChild(cardValue);

        cardContainer.appendChild(cardInfo);

        cardContainer.addEventListener('click', () => {
            showModal(card);
        });

        cardDisplayDiv.appendChild(cardContainer);
    });
}





// Function to show the modal
function showModal(card) {
    const modal = document.getElementById('card-modal');
    const modalCardName = document.getElementById('modal-card-name');
    const modalCardDescription = document.getElementById('modal-card-description');
    const modalCardImage = document.getElementById('modal-card-image'); 
    const modalButtonsContainer = document.getElementById('modal-buttons'); 
    const closeModalButton = document.getElementById('close-modal');

    const collection = JSON.parse(localStorage.getItem('myCollection')) || [];
    const wishlist = JSON.parse(localStorage.getItem('myWishlist')) || [];
    const isInCollection = collection.some(item => item.id === card.id);
    const isInWishlist = wishlist.some(item => item.id === card.id);

    modalCardName.textContent = card.name;
    modalCardDescription.textContent = '';
    modalCardImage.src = card.images.small; 

    modalButtonsContainer.innerHTML = '';

    if (isInCollection) {
        // If in collection
        modalCardDescription.textContent = "Card is in your collection."; 
        const removeFromCollectionButton = document.createElement('button');
        removeFromCollectionButton.classList.add('remove-button');
        removeFromCollectionButton.textContent = 'Remove from Collection';
        removeFromCollectionButton.onclick = () => {
            removeFromCollection(card.id);
            modal.style.display = 'none'; 
        };
        modalButtonsContainer.appendChild(removeFromCollectionButton);
    } else if (isInWishlist) {
        // If in wishlist
        modalCardDescription.textContent = "Card is in your wishlist."; 
        const addToCollectionButton = document.createElement('button');
        addToCollectionButton.classList.add('add-to-collection-button');
        addToCollectionButton.textContent = 'Add to Collection';
        addToCollectionButton.onclick = () => {
            addToCollection(card);
            modal.style.display = 'none'; 
        };

        const removeFromWishlistButton = document.createElement('button');
        removeFromWishlistButton.classList.add('remove-button');
        removeFromWishlistButton.textContent = 'Remove from Wishlist';
        removeFromWishlistButton.onclick = () => {
            removeFromWishlist(card.id);
            modal.style.display = 'none'; 
        };

        modalButtonsContainer.appendChild(addToCollectionButton);
        modalButtonsContainer.appendChild(removeFromWishlistButton);
    } else {
        // If the card is neither list
        const addToCollectionButton = document.createElement('button');
        addToCollectionButton.classList.add('add-to-collection-button');
        addToCollectionButton.textContent = 'Add to Collection';
        addToCollectionButton.onclick = () => {
            addToCollection(card);
            modal.style.display = 'none'; 
        };

        const addToWishlistButton = document.createElement('button');
        addToWishlistButton.classList.add('add-to-wishlist-button');
        addToWishlistButton.textContent = 'Add to Wishlist';
        addToWishlistButton.onclick = () => {
            addToWishlist(card);
            modal.style.display = 'none'; 
        };

        modalButtonsContainer.appendChild(addToCollectionButton);
        modalButtonsContainer.appendChild(addToWishlistButton);
    }

    modal.style.display = 'block';

    closeModalButton.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}






// add a card to the collection in local storage
export function addToCollection(card) {
    const collection = JSON.parse(localStorage.getItem('myCollection')) || [];
    const wishlist = JSON.parse(localStorage.getItem('myWishlist')) || [];
    const isAlreadyInCollection = collection.some(item => item.id === card.id);
    const isInWishlist = wishlist.some(item => item.id === card.id);

    if (isAlreadyInCollection) {
        alert(`${card.name} is already in your collection.`);
        return;
    }

    // Remove the card from the wishlist if it exists
    if (isInWishlist) {
        const updatedWishlist = wishlist.filter(item => item.id !== card.id);
        localStorage.setItem('myWishlist', JSON.stringify(updatedWishlist));
    }

    collection.push(card);
    localStorage.setItem('myCollection', JSON.stringify(collection));
    alert(`${card.name} has been added to your collection!`);
    location.reload();
}

// remove a card from the collection
export function removeFromCollection(cardId) {
    let collection = JSON.parse(localStorage.getItem('myCollection')) || [];
    collection = collection.filter(card => card.id !== cardId);
    localStorage.setItem('myCollection', JSON.stringify(collection));
    alert('Card removed from your collection.');
    location.reload(); // Reload the page to update the collection display
}

// add a card to the wishlist
export function addToWishlist(card) {
    const wishlist = JSON.parse(localStorage.getItem('myWishlist')) || [];
    const isAlreadyInWishlist = wishlist.some(item => item.id === card.id);

    if (isAlreadyInWishlist) {
        alert(`${card.name} is already in your wishlist.`);
        return;
    }

    wishlist.push(card);
    localStorage.setItem('myWishlist', JSON.stringify(wishlist));
    alert(`${card.name} has been added to your wishlist!`);
    location.reload();
}

// Function to remove a card from the wishlist
export function removeFromWishlist(cardId) {
    let wishlist = JSON.parse(localStorage.getItem('myWishlist')) || [];
    wishlist = wishlist.filter(card => card.id !== cardId);
    localStorage.setItem('myWishlist', JSON.stringify(wishlist));
    alert('Card removed from your wishlist.');
    location.reload(); // Reload the page to update the wishlist display
}





export async function fetchCardSets() {
    try {
        const response = await fetch(`${tcgBaseUrl}sets`, {
            headers: {
                'X-Api-Key': apiKey,
            },
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        return data.data; // Return the sets data
    } catch (error) {
        console.error('Failed to fetch sets:', error);
    }
}

// Function to fetch all cards from a specific set
export async function fetchCardsBySet(setId) {
    try {
        const response = await fetch(`${tcgBaseUrl}cards?q=set.id:${setId}`, {
            headers: {
                'X-Api-Key': apiKey,
            },
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        displayPokemonCard(data.data, true); // Display the cards
    } catch (error) {
        console.error('Failed to fetch cards for set:', error);
        const cardDisplayDiv = document.getElementById('card-display');
        cardDisplayDiv.innerHTML = `<p>Failed to fetch cards for the selected set. Please try again.</p>`;
    }
}







// Event listeners for search functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    // Trigger search on button click
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const pokemon = searchInput.value.trim().toLowerCase();
            console.log(`Searching for ${pokemon} cards...`);
            if (pokemon) {
                // Redirect to the new page with the search query as a URL parameter
                window.location.href = `pokemon.html?query=${encodeURIComponent(pokemon)}`;
            }
        });
    }

    // Trigger search on pressing "Enter"
    if (searchInput) {
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                const pokemon = searchInput.value.trim().toLowerCase();
                console.log(`Searching for ${pokemon} cards...`);
                if (pokemon) {
                    // Redirect to the new page with the search query as a URL parameter
                    window.location.href = `pokemon.html?query=${encodeURIComponent(pokemon)}`;
                }
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('pokemon.html')) {
        // Extract the query parameter from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('query');
        if (query) {
            // Fetch and display the Pokémon card data
            fetchPokemonCard(query);
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {

    const sortAlphabeticalButton = document.getElementById('sort-alphabetical');
    if (sortAlphabeticalButton) {
        sortAlphabeticalButton.addEventListener('click', () => {
            const sortedCards = [...loadedCards].sort((a, b) => a.name.localeCompare(b.name));
            displayPokemonCard(sortedCards);
        });
    }

    const sortValueAscButton = document.getElementById('sort-value-asc');
    if (sortValueAscButton) {
        sortValueAscButton.addEventListener('click', () => {
            const sortedCards = [...loadedCards].sort((a, b) => {
                const valueA = a.cardmarket?.prices?.averageSellPrice || 0;
                const valueB = b.cardmarket?.prices?.averageSellPrice || 0;
                return valueA - valueB;
            });
            displayPokemonCard(sortedCards);
        });
    }

    const sortValueDescButton = document.getElementById('sort-value-desc');
    if (sortValueDescButton) {
        sortValueDescButton.addEventListener('click', () => {
            const sortedCards = [...loadedCards].sort((a, b) => {
                const valueA = a.cardmarket?.prices?.averageSellPrice || 0;
                const valueB = b.cardmarket?.prices?.averageSellPrice || 0;
                return valueB - valueA;
            });
            displayPokemonCard(sortedCards, isSetSearchGlobal);
        });
    }
});

