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

/**
 * Bootstraps the app on DOM ready: generates the initial cards and binds a
 * delegated click handler on `#card-container`.
 * Clicking a `.card` toggles its "selected" class, updates the `selected` Set
 * with the card’s index, and calls `updateHelper(selected)`.
 * Event delegation ensures newly replaced cards work without rebinding.
 * Depends on globals: `cards`, `cardContainer`, `selected`,
 * `generateInitalCards`, `updateHelper`.
 * Side effects: mutates DOM, toggles classes, logs to console.
 * @returns {void}
 */
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
 * Generate a random 6-bit card as an array of 0/1, rejecting duplicates and all-zero.
 * @returns {number[]} e.g., [1,0,1,0,1,0]
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

/**
 * Create a single `.card` element for `cards[index]` and append to #card-container.
 * Each of the 6 positions maps to one of: red, orange, yellow, green, blue, purple.
 * @param {number} index - Index into `cards`.
 * @returns {HTMLDivElement} The appended card element.
 */
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

/**
 * Check if `b` already exists in array `a` (deep equality on 0/1 arrays).
 * @param {number[][]} a
 * @param {number[]} b
 * @returns {boolean}
 */
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


/**
 * Strictly compares two arrays (same length, same order, elements with `===`).
 * Note: for primitives; `NaN` !== `NaN` under `===`.
 * @param {any[]} a
 * @param {any[]} b
 * @returns {boolean} True if equal, else false.
 * @example arraysEqual([1,2,3], [1,2,3]); // true
 */
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

/**
 * Validates the currently selected cards as a Proset and updates UI/game state.
 *
 * If valid:
 *    - Increment the score by the size of the selected subset.
 *    - Show "Correct!" feedback.
 *    - Replace those cards in place via `updateCards(proset)`.
 * 4) If invalid: show "Try again :(" feedback.
 * 5) Clear the feedback message after 1500 ms.
 *
 * - Mutates DOM (`scoreTracker.textContent`, `feedbackDiv.textContent`).
 * - Triggers card replacement and selection reset indirectly via `updateCards`.
 *
 * @returns {void}
 * @see isValidProset
 * @see updateCards
 */
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
 * True if `proset` is non-empty and every color's parity is even.
 * @param {number[]} proset - indices into `cards`
 * @returns {boolean}
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

/**
 * Compute per-color parity (sum mod 2) for a selected subset.
 * @param {number[]} proset - indices into `cards`
 * @returns {number[]} length-6 array of 0/1 (0=even, 1=odd)
 */
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

/**
 * Replace each selected index with a fresh random card and swap its DOM node in place.
 * Preserves the ordering of non-selected cards.
 * @param {number[]} previous - indices to replace
 */
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

/**
 * Show a valid solution visually: clear selection, select solution indices,
 * and update the guide card accordingly.
 */
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

/**
 * Find any valid proset on the current board.
 * Searches combinations of size 1..numCards, returns the first valid combo (indices).
 * @returns {number[]} indices or []
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

/**
 * Build all k-combinations from `array`. Current implementation returns strings,
 * then caller splits them; prefer returning arrays of numbers.
 * @param {number[]} array
 * @param {number} amt
 * @returns {Array<string>|Array<number[]>}
 */
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

/**
 * Update the "guide card" visualization.
 * Colored dot = odd parity remaining (needs one more of that color); clear = even.
 * @param {Set<number>|number[]} selected - selected indices
 */
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