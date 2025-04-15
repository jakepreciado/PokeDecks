document.addEventListener('DOMContentLoaded', () => {
    const wishlist = JSON.parse(localStorage.getItem('myWishlist')) || [];
    const wishlistDisplayDiv = document.getElementById('wishlist-display');
    const sortingOptions = document.getElementById('sorting-options');

    if (wishlist.length === 0) {
        wishlistDisplayDiv.innerHTML = `<p class="empty-message">Your wishlist is empty!</p>`;
        return;
    } else {
        sortingOptions.style.display = 'flex';
    }

    calculateWishlistStats(wishlist);

    renderWishlist(wishlist);

    document.getElementById('sort-alphabetical').addEventListener('click', () => {
        const sortedWishlist = [...wishlist].sort((a, b) => a.name.localeCompare(b.name));
        renderWishlist(sortedWishlist);
    });

    document.getElementById('sort-value-asc').addEventListener('click', () => {
        const sortedCards = [...wishlist].sort((a, b) => {
            const valueA = a.cardmarket?.prices?.averageSellPrice || 0;
            const valueB = b.cardmarket?.prices?.averageSellPrice || 0;
            return valueA - valueB;
        });
        renderWishlist(sortedCards);
    });

    document.getElementById('sort-value-desc').addEventListener('click', () => {
        const sortedCards = [...wishlist].sort((a, b) => {
            const valueA = a.cardmarket?.prices?.averageSellPrice || 0;
            const valueB = b.cardmarket?.prices?.averageSellPrice || 0;
            return valueB - valueA;
        });
        renderWishlist(sortedCards);
    });
});

// Function to render the wishlist
function renderWishlist(wishlist) {
    const wishlistDisplayDiv = document.getElementById('wishlist-display');
    wishlistDisplayDiv.innerHTML = ''; 

    wishlist.forEach(card => {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container');

        const cardImage = document.createElement('img');
        cardImage.src = card.images.small;
        cardImage.alt = card.name;
        cardImage.setAttribute('loading', 'lazy');
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

        const addToCollectionButton = document.createElement('button');
        addToCollectionButton.classList.add('add-to-collection-button');
        addToCollectionButton.textContent = 'Add to Collection';
        addToCollectionButton.addEventListener('click', () => {
            let collection = JSON.parse(localStorage.getItem('myCollection')) || [];
            collection.push(card);
            localStorage.setItem('myCollection', JSON.stringify(collection));
            removeFromWishlist(card.id); 
            alert('Card added to your collection!');
        });

        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-button');
        removeButton.textContent = 'Remove from Wishlist';
        removeButton.addEventListener('click', () => {
            removeFromWishlist(card.id);
        });

        cardContainer.appendChild(addToCollectionButton);
        cardContainer.appendChild(removeButton);
        wishlistDisplayDiv.appendChild(cardContainer);
    });

    calculateWishlistStats(wishlist);
}

function calculateWishlistStats(wishlist) {
    const totalValue = wishlist.reduce((sum, card) => {
        const cardPrice = card.cardmarket?.prices?.averageSellPrice || 0;
        return sum + cardPrice;
    }, 0);

    const statsDiv = document.getElementById('wishlist-stats');
    if (statsDiv) {
        statsDiv.textContent = `Estimated Wishlist Value: $${totalValue.toFixed(2)} USD`;
    }

    const totalCards = wishlist.length;
    const totalCardsDiv = document.getElementById('total-cards');
    if (totalCardsDiv) {
        totalCardsDiv.textContent = `Total Cards in Wishlist: ${totalCards}`;
    }
}