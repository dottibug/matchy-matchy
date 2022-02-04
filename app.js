let cardDeck = [
  { name: "bee", imgFile: "bee.png" },
  { name: "bee", imgFile: "bee.png" },
  { name: "hearts", imgFile: "hearts.png" },
  { name: "hearts", imgFile: "hearts.png" },
  { name: "house", imgFile: "house.png" },
  { name: "house", imgFile: "house.png" },
  { name: "mountain", imgFile: "mountain.png" },
  { name: "mountain", imgFile: "mountain.png" },
  { name: "pine_tree", imgFile: "pine_tree.png" },
  { name: "pine_tree", imgFile: "pine_tree.png" },
  { name: "rain_cloud", imgFile: "rain_cloud.png" },
  { name: "rain_cloud", imgFile: "rain_cloud.png" },
  { name: "rainbow", imgFile: "rainbow.png" },
  { name: "rainbow", imgFile: "rainbow.png" },
  { name: "sunshine_smile", imgFile: "sunshine_smile.png" },
  { name: "sunshine_smile", imgFile: "sunshine_smile.png" },
  { name: "sunshine", imgFile: "sunshine.png" },
  { name: "sunshine", imgFile: "sunshine.png" },
  { name: "tree", imgFile: "tree.png" },
  { name: "tree", imgFile: "tree.png" },
];

let gameboard = document.querySelector(".gameboard");
let cardsClicked = [];
let winBox = document.querySelector(".win-box");

//set up the gameboard when the html has loaded
document.addEventListener("DOMContentLoaded", function () {
  //createBoard function
  createBoard(gameboard, shuffleDeck(cardDeck));

  //add click event listener for each image
  let cards = document.querySelectorAll(".card");
  cards.forEach((card) => card.addEventListener("click", flipCards));
});

//Fisher-Yates shuffle cards (https://bost.ocks.org/mike/shuffle/)
function shuffleDeck(cardDeck) {
  for (let i = cardDeck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    let tempCard = cardDeck[i];
    cardDeck[i] = cardDeck[j];
    cardDeck[j] = tempCard;
  }
  return cardDeck;
}

//create cards and gameboard from shuffled deck
function createBoard(gameboard, cardDeck) {
  for (let i = 0; i < cardDeck.length; i++) {
    //create div class "card" for each game card
    let card = document.createElement("div");
    card.setAttribute("class", "card");

    //create img element for card front
    let cardFront = document.createElement("img");
    cardFront.setAttribute("class", "front");
    cardFront.setAttribute("src", "images/" + cardDeck[i].imgFile);
    cardFront.setAttribute("id", i);
    cardFront.setAttribute("alt", cardDeck[i].name);

    //create img element for card back
    let cardBack = document.createElement("img");
    cardBack.setAttribute("class", "back");
    cardBack.setAttribute("src", "images/card_back.png");

    //append card imgs to card div
    card.append(cardFront, cardBack);

    //append card div to gameboard
    gameboard.append(card);
  }
}

function playSound() {
  let audio = new Audio("sound/match.mp3");
  audio.play();
}

function unlockBoard() {
    let cards = document.querySelectorAll(".card");
    cards.forEach((card) => card.addEventListener("click", flipCards));
}

function checkWin() {
  let matches = document.querySelectorAll(".matched");
  let matchesMade = Array.from(matches);

  if(matchesMade.length === cardDeck.length) {
    console.log("You Won! Refresh the page to play again.");
    // winBox.style.display = "block";
  }

}

function match(cardOne, cardTwo) {
  playSound();
  //add "matched" class to parent card divs
  cardOne.parentElement.classList.add("matched");
  cardTwo.parentElement.classList.add("matched");

  //hide sibling element (card "back" img)
  cardOne.nextElementSibling.style.visibility = "hidden";
  cardTwo.nextElementSibling.style.visibility = "hidden";

  //check for win conditions
  checkWin();

  //clear cardsClicked for next matching round
  cardsClicked = [];

  //reenable click events on all cards (matched class will have no pointer events)
  unlockBoard();
  //cards.forEach((card) => card.addEventListener("click", flipCards));
}

function unflipCards(cardOne, cardTwo) {
  new Promise((resolve, reject) => {
    //toggle "unflip" css style ON
    console.log(cardOne.parentElement);
    cardOne.parentElement.classList.toggle("unflip");
    cardTwo.parentElement.classList.toggle("unflip");
    //toggle "flip" css style OFF
    cardOne.parentElement.classList.toggle("flip");
    cardTwo.parentElement.classList.toggle("flip");
    resolve();
  }).then(() => {
    setTimeout(() => {
      //toggle "unflip" css style OFF
      cardOne.parentElement.classList.remove("unflip");
      cardTwo.parentElement.classList.remove("unflip");
    }, 700);
  });
}

function notMatch(cardOne, cardTwo) {
  //unflip cards
  setTimeout(unflipCards, 1800, cardOne, cardTwo);
  //clear cardsClicked for next matching round
  cardsClicked = [];
  //reenable click events on all cards
  unlockBoard();
}

function checkMatch(cardsClicked) {
  let cardOne = document.getElementById(cardsClicked[0].cardID);
  let cardTwo = document.getElementById(cardsClicked[1].cardID);

  console.log("Checking match: ", cardsClicked[0], cardsClicked[1]);

  if (cardsClicked[0].name === cardsClicked[1].name) {
    console.log("Match!!!");
    setTimeout(match, 300, cardOne, cardTwo);
  } else {
    console.log("NOT a match.");
    notMatch(cardOne, cardTwo);
  }
}

function lockBoard() {
    let cards = document.querySelectorAll(".card");
    cards.forEach((card) => card.removeEventListener("click", flipCards));
}

function flipCards() {
  let clicked = this.firstChild; //the card "front" clicked
  let cardID = clicked.id;
  let cardName = clicked.alt;

  console.log(clicked);

  //toggle "flip" class css style
  this.classList.toggle("flip");

  //push card name and id to cardsClicked array for checking matches
  cardsClicked.push({ name: cardName, cardID: cardID });
  console.log(cardsClicked);

  if (
    cardsClicked.length === 2 &&
    cardsClicked[0].cardID !== cardsClicked[1].cardID
  ) {
    //disable all further clicking until after matching is checked
    lockBoard();
    checkMatch(cardsClicked);
  } else {
    cardsClicked.splice(1, 1);
  }
}

//opacity transition is too fast for matches
//unflipping should happen a little bit faster

//Refactor 
//foreach for cardOne and cardTwo lines
