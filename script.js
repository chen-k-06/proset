let cards = []
const numDots = 6;
const numCards = 7;

document.addEventListener("DOMContentLoaded", function () {
    generateInitalCards();
});

/**
 * Populates the global `cards` array with `numCards` random binary arrays.
 *
 * Each generated card is an array of length `numDots`, containing 0s and 1s:
 * - 0 means no dot at that position.
 * - 1 means a dot is present.
 *
 * Relies on the global variables:
 * - `numCards` (number of cards to generate)
 * - `numDots` (number of positions in each card)
 * - `cards` (array that will be populated)
 *
 * @returns {void}
 */
function generateInitalCards() {
    for (let i = 0; i < numCards; i++) {
        let card = generateRandomCard();
        cards.push(card)
    }
    console.log(`Inital cards ${cards}`);

    // Create a div
    let newCard = document.createElement("div");
    newCard.classList.add(card);
    let parentElement = document.getElementById("card-container");
    parentElement.appendChild(newCard);
}

function checkProset() {

}

function giveHint() {

}

function updateCards() {

}

/**
* Generates a random binary array representing the presence or absence of dots.
*
* The array length is determined by the global `numDots` variable. 
* A value of 0 means no dot at that position, and a value of 1 means a dot is present.
*
* @returns {number[]} An array of 0s and 1s of length `numDots`.
*/
function generateRandomCard() {
    let card = [];
    for (let i = 0; i < numDots; i++) {
        let num = Math.floor(Math.random() * 2); // generates either 0 or 1
        card.push(num);
    }
    return card;
}
