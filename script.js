let cards = [];
let cardDivs = [];
let selected = new Set();
let score = 0;
let helperCard = document.getElementById("helper-card");
let guideToggleValue = false;
const feedbackDiv = document.getElementById("feedback");
const submitButton = document.getElementById("submit");
const scoreTracker = document.getElementById("score-value");
const cardContainer = document.getElementById("card-container");
const guideToggle = document.getElementById("helper");
const cheatButton = document.getElementById("hint");
const numDots = 6;
const numCards = 7;
const colors = ["red", "orange", "yellow", "green", "blue", "purple"];

document.addEventListener("DOMContentLoaded", function () {
    generateInitalCards();
    cardDivs = document.querySelectorAll(".card");

    cardContainer.addEventListener("click", (event) => {
        const card = event.target.closest(".card");
        if (!card || !cardContainer.contains(card)) return;

        const index = [...cardContainer.children].indexOf(card);
        console.log(index + ' card clicked');
        if (card.classList.contains("selected")) {
            card.classList.remove("selected");
            selected.delete(index);
        }
        else {
            card.classList.add("selected");
            selected.add(index);
        }

        console.log(selected);
        updateHelper(selected);
    });
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
        cards.push(card);
    }
    console.log(`Inital cards:`);
    console.table(cards);
    console.log(JSON.stringify(cards));

    // create new divs for new cards
    for (let i = 0; i < numCards; i++) {
        createNewCardDiv(i);
    }
}

/**
* Generates a random binary array representing the presence or absence of dots.
* Guarentees the array is not already present in global var `cards`
*
* The array length is determined by the global `numDots` variable. 
* A value of 0 means no dot at that position, and a value of 1 means a dot is present.
*
* @returns {number[]} An array of 0s and 1s of length `numDots`.
*/
function generateRandomCard() {
    let card = [];
    do {
        card = [];
        for (let i = 0; i < numDots; i++) {
            let num = Math.floor(Math.random() * 2); // generates either 0 or 1
            card.push(num);
        }
    }
    while (cardsOverlap(cards, card) == true || arraysEqual(card, [0, 0, 0, 0, 0, 0]));
    console.log(`Random card ${card} generated`)
    return card;
}

function createNewCardDiv(index) {
    let newCard = document.createElement("div");
    newCard.classList.add("card");

    // color the dots
    for (let j = 0; j < numDots / 2; j++) {
        let newDotBar = document.createElement("div");
        newDotBar.classList.add("dot-bar");
        newCard.appendChild(newDotBar);

        for (let k = 0; k < 2; k++) {
            let newDot = document.createElement("div");
            newDot.classList.add("dot");

            if (cards[index][j * 2 + k] == 1) {
                newDot.classList.add(colors[j * 2 + k]);
            }
            else {
                newDot.classList.add("clear");
            }
            newDotBar.appendChild(newDot);
        }
    }
    let parentElement = document.getElementById("card-container");
    parentElement.appendChild(newCard);

    return newCard;
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

function arraysEqual(a, b) {
    if (a === b) return true;
    if (!a || !b || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

submitButton.addEventListener(("click"), () => {
    console.log("Submit button clicked.");
    checkProset();
});

function checkProset() {
    let this_proset = Array.from(selected);
    console.log(`Selected proset: ${this_proset}`);
    let isProset = isValidProset(this_proset);
    console.log("Result: ", isProset);
    if (isProset) {
        scoreTracker.textContent = Number(scoreTracker.textContent) + Number(this_proset.length);
        feedbackDiv.textContent = "Correct!";
        // remove the selected cards and add new ones
        updateCards(this_proset);
    }
    else {
        feedbackDiv.textContent = "Try again :(";
    }

    const t = setTimeout(() => {
        feedbackDiv.textContent = '';
    }, 1500);
}

/**
 * Checks whether the selected cards form a valid Proset.
 *
 * A Proset is a non-empty subset of cards such that, for each dot/color position,
 * the total number of present dots across the selection is even (parity ≡ 0 mod 2).
 *
 * @param {number[]} proset - Indices of selected cards in the global `cards` array.
 * @returns {boolean} True if every dot/color has even parity; otherwise, false.
 *
 * @example
 * // Suppose cards = [
 * //   [1,0,1,0,0,0],
 * //   [1,1,0,0,0,0],
 * //   [0,1,1,0,0,0]
 * // ];
 * // Each color appears 0 or 2 times across indices [0,1,2]:
 * isValidProset([0, 1, 2]); // → true
 *
 * // Empty selection is not a Proset:
 * isValidProset([]); // → false
 */
function isValidProset(proset) {
    if (!proset || proset.length === 0) return false;
    let parity = getParity(proset);

    for (let i = 0; i < parity.length; i++) {
        if (parity[i] != 0) {
            return false;
        }
    }
    return true;
}

function getParity(proset) {
    let parity = Array(numDots).fill(0);
    // sum all dots across all cards
    for (let i = 0; i < proset.length; i++) {
        let this_card = cards[proset[i]];
        // j is the color -> index in counts
        for (let j = 0; j < numDots; j++) {
            parity[j] = (parity[j] + this_card[j]) % 2;
        }
    }
    return parity;
}

function updateCards(previous) {
    const container = document.getElementById("card-container");
    let indexes = [...previous].sort((a, b) => a - b);

    for (let i of indexes) {
        cards[i] = generateRandomCard();

        const replacement = createNewCardDiv(i);
        const old = container.children[i];
        container.replaceChild(replacement, old);
    }

    selected.clear();
    updateHelper(selected);

    console.log(`Updated cards array: ${cards}`)
    cardDivs = document.querySelectorAll(".card");
}

cheatButton.addEventListener(("click"), () => {
    console.log("Cheat button pressed");
    displaySolution();
});

function displaySolution() {
    let answer = getAProset(); // calls isValidProset, which calls getParity,
    // which uses global cards var

    // deselect all cards 
    for (let i = 0; i < cardDivs.length; i++) {
        let thisCardDiv = cardDivs[i];

        if (thisCardDiv.classList.contains("selected")) {
            thisCardDiv.classList.remove("selected");
        }
    }

    selected.clear();

    // select all cards in answer
    for (let i = 0; i < answer.length; i++) {
        let thisCardDiv = cardDivs[answer[i]];
        thisCardDiv.classList.add("selected");
        selected.add(Number(answer[i]));
    }
    updateHelper(answer);
}

/*
* Returns the indexes of a valid proset on the board, 
* given the current cards. If no valid proset, returns []
*
* 
*/
function getAProset() {
    // check increasingly large combinations of cards until 1 is a proset
    let idxs = [0, 1, 2, 3, 4, 5, 6];
    for (let i = 0; i < numCards; i++) {
        let combos = getCombinations(idxs, i);

        for (let j = 0; j < combos.length; j++) {
            combo = Array.from(combos[j]);
            let result = isValidProset(combo);
            if (result) {
                console.log(`Solution found ${combo}`);
                return combo;
            }
        }
    }
    return [];
}

function getCombinations(array, amt) {
    const arr = Array.from(array), n = arr.length;

    let combos = [];
    if (amt <= 0 || amt > n) {
        return combos;
    }
    // create amt number of loops
    combos = combinationsHelper(arr, amt, "", []);
    return combos;
}

function combinationsHelper(array, amt, baseStr, combos) {
    if (baseStr.length === amt) {
        combos.push(baseStr);
        return;
    }

    for (let i = 0; i < array.length; i++) {
        let newStr = baseStr + array[i];
        let newarr = array.toSpliced(i, 1);
        combinationsHelper(newarr, amt, newStr, combos);
    }
    return combos
}

guideToggle.addEventListener(("click"), () => {
    guideToggleValue = !guideToggleValue;

    if (guideToggleValue) {
        console.log("Guide card actived")
        helperCard.classList.remove("hidden");
        updateHelper(selected);
    }
    else {
        console.log("Guide card deactivated")
        helperCard.classList.add("hidden");
    }
});

function updateHelper(selected) {
    let this_proset = Array.from(selected);
    let parity = getParity(this_proset);
    helperCard.replaceChildren();

    // color the dots
    for (let j = 0; j < numDots / 2; j++) {
        let newDotBar = document.createElement("div");
        newDotBar.classList.add("dot-bar");
        helperCard.appendChild(newDotBar);

        for (let k = 0; k < 2; k++) {
            let newDot = document.createElement("div");
            newDot.classList.add("dot");

            if (parity[j * 2 + k] == 1) {
                newDot.classList.add(colors[j * 2 + k]);
            }
            else {
                newDot.classList.add("clear");
            }
            newDotBar.appendChild(newDot);
        }
    }
}