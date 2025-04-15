import { removeFromCollection } from './removeFromCollection.js';

document.addEventListener('DOMContentLoaded', () => {
    const collection = JSON.parse(localStorage.getItem('myCollection')) || [];
    const collectionDisplayDiv = document.getElementById('collection-display');
    const sortingOptions = document.getElementById('sorting-options');

    if (collection.length === 0) {
        collectionDisplayDiv.innerHTML = `<p class="empty-message">Your collection is empty!</p>`;
        return;
    } else {
        sortingOptions.style.display = 'flex';
    }


    // Display collection stats
    calculateCollectionStats(collection);

    // Render the collection
    renderCollection(collection);

    // Add event listeners for sorting buttons
    document.getElementById('sort-alphabetical').addEventListener('click', () => {
        const sortedCollection = [...collection].sort((a, b) => a.name.localeCompare(b.name));
        renderCollection(sortedCollection);
    });

    document.getElementById('sort-value-asc').addEventListener('click', () => {
        console.log("ascending");
        const sortedCards = [...collection].sort((a, b) => {
            const valueA = a.cardmarket?.prices?.averageSellPrice || 0;
            const valueB = b.cardmarket?.prices?.averageSellPrice || 0;
            return valueA - valueB;
        });
        renderCollection(sortedCards);
    });


    document.getElementById('sort-value-desc').addEventListener('click', () => {
        console.log("descending");
        const sortedCards = [...collection].sort((a, b) => {
            const valueA = a.cardmarket?.prices?.averageSellPrice || 0;
            const valueB = b.cardmarket?.prices?.averageSellPrice || 0;
            return valueB - valueA;
        });
        renderCollection(sortedCards);
    });
});

// Function to render the collection
function renderCollection(collection) {
    const collectionDisplayDiv = document.getElementById('collection-display');
    collectionDisplayDiv.innerHTML = ''; // Clear the current display

    collection.forEach(card => {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container');

        const cardImage = document.createElement('img');
        cardImage.src = card.images.small;
        cardImage.alt = card.name;
        cardImage.setAttribute('loading', 'lazy'); // Lazy load the image
        cardImage.setAttribute('width', '240px');
        cardImage.setAttribute('height', '330px');
        cardImage.classList.add('pokemon-card-image');

        const cardInfo = document.createElement('div');
        cardInfo.classList.add('card-info');

        const nameElement = document.createElement('h3');
        nameElement.textContent = card.name;

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
        cardContainer.appendChild(cardImage);
        cardContainer.appendChild(cardInfo);

        // Add remove button
        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-button');
        removeButton.textContent = 'Remove from Collection';
        removeButton.addEventListener('click', () => {
            removeFromCollection(card.id);
        });

        cardContainer.appendChild(removeButton);
        collectionDisplayDiv.appendChild(cardContainer);
    });

    calculateCollectionStats(collection);
}

function calculateCollectionStats(collection) {
    const totalValue = collection.reduce((sum, card) => {
        const cardPrice = card.cardmarket?.prices?.averageSellPrice || 0;
        return sum + cardPrice;
    }, 0);

    const statsDiv = document.getElementById('collection-stats');
    if (statsDiv) {
        statsDiv.textContent = `Estimated Collection Value: $${totalValue.toFixed(2)} USD`;
    }

    const totalCards = collection.length;
    const totalCardsDiv = document.getElementById('total-cards');
    if (totalCardsDiv) {
        totalCardsDiv.textContent = `Total Cards in Collection: ${totalCards}`;
    }
}