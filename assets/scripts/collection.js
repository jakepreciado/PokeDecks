document.addEventListener('DOMContentLoaded', () => {
    const collection = JSON.parse(localStorage.getItem('myCollection')) || [];
    const collectionDisplayDiv = document.getElementById('collection-display');

    if (collection.length === 0) {
        collectionDisplayDiv.innerHTML = `<p>Your collection is empty.</p>`;
        return;
    }

    collection.forEach(card => {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container');

        const cardImage = document.createElement('img');
        cardImage.src = card.images.small;
        cardImage.alt = card.name;

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
        removeButton.textContent = 'Remove from Collection';
        removeButton.addEventListener('click', () => {
            removeFromCollection(card.id);
        });

        cardContainer.appendChild(removeButton);
        collectionDisplayDiv.appendChild(cardContainer);
    });
});

// Function to remove a card from the collection
function removeFromCollection(cardId) {
    let collection = JSON.parse(localStorage.getItem('myCollection')) || [];
    collection = collection.filter(card => card.id !== cardId);
    localStorage.setItem('myCollection', JSON.stringify(collection));
    alert('Card removed from your collection.');
    location.reload(); // Reload the page to update the collection display
}