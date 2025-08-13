let cards = []
let cardDivs = []
const numDots = 6;
const numCards = 7;

document.addEventListener("DOMContentLoaded", function () {
    generateInitalCards();
});

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
    console.log(`Random card ${card} generated`)
    return card;
}

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
        // if card in cards, try again
        while (cardsOverlap(cards, card) == true) {
            card = generateRandomCard();
        }
        cards.push(card)
    }
    console.log(`Inital cards:`);
    console.table(cards);
    console.log(JSON.stringify(cards));

    // create new divs for new cards
    for (let i = 0; i < numCards; i++) {
        let newCard = document.createElement("div");
        newCard.classList.add("card");
        let parentElement = document.getElementById("card-container");
        parentElement.appendChild(newCard);
        cardDivs.push(newCard);
    }
}

function cardsOverlap(a, b) {
    // a is an array of cards
    // b is one card, that needs to be checked against each card in a
    for (let i = 0; i < a.length; i++) {
        let currCard = a[i];
        let identical = true;

        // check one card against b
        for (let j = 0; j < b.length; j++) {
            if (currCard[j] != b[j]) {
                identical = false;
                break;
            }
        }
        if (identical == true) {
            return true
        }
    }
    return false;
}

function checkProset() {

}

function giveHint() {

}

function updateCards() {

}

function showHelper() {

}
