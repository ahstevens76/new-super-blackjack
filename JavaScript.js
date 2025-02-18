// Create currency
let coins = 50;
let coinsBet = 0;

// Booleans indicating whether a game is ongoing
let canHit = false;
let canBet = true;

// Create the hands
let playerHand = [];
let dealerHand = [];

// Contain the values of each hand
let playerValue = 0;
let dealerValue = 0;

// Initialize deck
const deck = [];

// Initialize site information on load
window.onload = function(){
	coinRefresh();
};

// Refresh coin value
function coinRefresh(){
	document.getElementById("coins").innerHTML = coins;
}

// Clear cards on the screen
function clearCards(elementID){
	let div = document.getElementById(elementID);
	
	while (div.firstChild){
		div.removeChild(div.firstChild);
	}
}

// Create a card constructor
function Card(rank, suit){
	this.rank = rank;
	this.suit = suit;
	this.stringId = rank + "_of_" + suit;
}

// Create a deck of cards
function buildDeck(){
	const suits = ['hearts', 'spades', 'clubs', 'diamonds'];
	const ranks = ['ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'jack', 'queen', 'king'];
	for (let suit of suits){
		for (let rank of ranks){
			let card = new Card(rank, suit);
			deck.push(card);
		}
	}
}

// Shuffle the cards
function shuffle(deck){
	for (let i = 0; i < deck.length; i++){
		let randomIndex = Math.floor(Math.random() * deck.length);
		let temp = deck[i];
		deck[i] = deck[randomIndex];
		deck[randomIndex] = temp;
	}
	return deck;
}

// Calculate the value of a hand
function calculateHand(hand){
	let value = 0;
	let aces = 0;
	for (let card of hand){
		if (card.rank === 'ace'){
			aces++;
			value += 11;
		} else if (card.rank === 'jack' || card.rank === 'queen' || card.rank === 'king'){
			value += 10;
		} else {
			value += card.rank;
		}
	}

	while (value > 21 && aces > 0){
		value -= 10;
		aces--;
	}

	return value;
}

// Button functionality
function hit(){
	if (!canHit){
		return;
	}
	
	let cardImg = document.createElement("img");
	let card = deck.pop();
	playerHand.push(card);
	cardImg.src = "Assets/Cards/" + card.stringId + ".png";
	playerValue = calculateHand(playerHand);
	document.getElementById("player-hand").append(cardImg);
	
	if (playerValue >= 21){
		stand();
	}
}

function dealerHit(){
	let cardImg = document.createElement("img");
	let card = deck.pop();
	dealerHand.push(card);
	cardImg.src = "Assets/Cards/" + card.stringId + ".png";
	dealerValue = calculateHand(dealerHand);
	document.getElementById("dealer-hand").append(cardImg);
}

function doubleDown(){
	if (canHit && coins > 0 && playerHand.length == 2){
		coins -= 5;
		coinsBet += 5;
		coinRefresh();
		hit();
		stand();
	}
}

function stand(){
	if (canHit = true){
		canHit = false;
		playerTurnEnd();
	}
}

// Bet 5 coins and start the game
function bet(){
	if (!canBet){
		return;
	}
	
	document.getElementById("Win").style.display="none";
	document.getElementById("Lose").style.display="none";
	document.getElementById("Blackjack").style.display="none";
	document.getElementById("Push").style.display="none";
	
	clearCards("dealer-hand");
	clearCards("player-hand");
	
	buildDeck();
	shuffle(deck);
	
	playerHand = [];
	dealerHand = [];
	
	canHit = true;
	canBet = false;
	
	coins -= 5;
	coinsBet += 5;
	coinRefresh();
	
	for (let i = 0; i < 2; i++){
		hit();
		dealerHit();
	}
	
	if (playerValue == 21 || dealerValue == 21){
		stand();
	}
}

// Carries out the dealer's hand and results
function playerTurnEnd(){
	while (dealerValue < 17){
		dealerHit();
	}

	if (playerValue == 21 && playerHand.length == 2){
		//Blackjack
		document.getElementById("Blackjack").style.display="block";
		coins += 3 * coinsBet;
	} else if (playerValue > 21){
		//You lose
		document.getElementById("Lose").style.display="block";
	} else if (dealerValue > 21){
		//You win
		document.getElementById("Win").style.display="block";
		coins += 2 * coinsBet;
	} else if (playerValue > dealerValue){
		//You win
		document.getElementById("Win").style.display="block";
		coins += 2 * coinsBet;
	} else if (playerValue < dealerValue){
		//You lose
		document.getElementById("Lose").style.display="block";
	} else {
		//Push
		document.getElementById("Push").style.display="block";
		coins += coinsBet;
	}
	
	coinsBet = 0;
	coinRefresh();
	
	if (coins != 0){
		canBet = true;
	}
}

// Reset game and currency
function reset(){
	window.location.reload();
}