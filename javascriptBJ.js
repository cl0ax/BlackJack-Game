let Deck = {
    cards: [
        {'img': '2C', 'value': 2, suit: 'clubs', 'dealt': false},
        {'img': '2H', 'value': 2, suit: 'hearts', 'dealt': false},
        {'img': '2D', 'value': 2, suit: 'diamonds', 'dealt': false},
        {'img': '2S', 'value': 2, suit: 'spades', 'dealt': false},

        {'img': '3C', 'value': 3, suit: 'clubs', 'dealt': false},
        {'img': '3H', 'value': 3, suit: 'hearts', 'dealt': false},
        {'img': '3D', 'value': 3, suit: 'diamonds', 'dealt': false},
        {'img': '3S', 'value': 3, suit: 'spades', 'dealt': false},

        {'img': '4S', 'value': 4, suit: 'spades', 'dealt': false},
        {'img': '4H', 'value': 4, suit: 'hearts', 'dealt': false},
        {'img': '4D', 'value': 4, suit: 'diamonds', 'dealt': false},
        {'img': '4C', 'value': 4, suit: 'clubs', 'dealt': false},

        {'img': '5S', 'value': 5, suit: 'spades', 'dealt': false},
        {'img': '5H', 'value': 5, suit: 'hearts', 'dealt': false},
        {'img': '5D', 'value': 5, suit: 'diamonds', 'dealt': false},
        {'img': '5C', 'value': 5, suit: 'clubs', 'dealt': false},

        {'img': '6S', 'value': 6, suit: 'spades', 'dealt': false},
        {'img': '6H', 'value': 6, suit: 'hearts', 'dealt': false},
        {'img': '6D', 'value': 6, suit: 'diamonds', 'dealt': false},
        {'img': '6C', 'value': 6, suit: 'clubs', 'dealt': false},

        {'img': '7S', 'value': 7, suit: 'spades', 'dealt': false},
        {'img': '7H', 'value': 7, suit: 'hearts', 'dealt': false},
        {'img': '7D', 'value': 7, suit: 'diamonds', 'dealt': false},
        {'img': '7C', 'value': 7, suit: 'clubs', 'dealt': false},

        {'img': '8S', 'value': 8, suit: 'spades', 'dealt': false},
        {'img': '8H', 'value': 8, suit: 'hearts', 'dealt': false},
        {'img': '8D', 'value': 8, suit: 'diamonds', 'dealt': false},
        {'img': '8C', 'value': 8, suit: 'clubs', 'dealt': false},

        {'img': '9S', 'value': 9, suit: 'spades', 'dealt': false},
        {'img': '9H', 'value': 9, suit: 'hearts', 'dealt': false},
        {'img': '9D', 'value': 9, suit: 'diamonds', 'dealt': false},
        {'img': '9C', 'value': 9, suit: 'clubs', 'dealt': false},

        {'img': '10S', 'value': 10, suit: 'spades', 'dealt': false},
        {'img': '10H', 'value': 10, suit: 'hearts', 'dealt': false},
        {'img': '10D', 'value': 10, suit: 'diamonds', 'dealt': false},
        {'img': '10C', 'value': 10, suit: 'clubs', 'dealt': false},

        {'img': 'JS', 'value': 10, suit: 'spades', 'dealt': false},
        {'img': 'JH', 'value': 10, suit: 'hearts', 'dealt': false},
        {'img': 'JD', 'value': 10, suit: 'diamonds', 'dealt': false},
        {'img': 'JC', 'value': 10, suit: 'clubs', 'dealt': false},

        {'img': 'QS', 'value': 10, suit: 'spades', 'dealt': false},
        {'img': 'QH', 'value': 10, suit: 'hearts', 'dealt': false},
        {'img': 'QD', 'value': 10, suit: 'diamonds', 'dealt': false},
        {'img': 'QC', 'value': 10, suit: 'clubs', 'dealt': false},

        {'img': 'KS', 'value': 10, suit: 'spades', 'dealt': false},
        {'img': 'KH', 'value': 10, suit: 'hearts', 'dealt': false},
        {'img': 'KD', 'value': 10, suit: 'diamonds', 'dealt': false},
        {'img': 'KC', 'value': 10, suit: 'clubs', 'dealt': false},

        {'img': 'AS', 'value': 11, suit: 'spades', 'dealt': false},
        {'img': 'AH', 'value': 11, suit: 'hearts', 'dealt': false},
        {'img': 'AD', 'value': 11, suit: 'diamonds', 'dealt': false},
        {'img': 'AC', 'value': 11, suit: 'clubs', 'dealt': false}
    ],
    cardsDealt : 0,
    getCard: function (...hands) {
        let card = null;
        let availableCards = this.cards.filter((card) => !card.dealt);

        if (availableCards.length === 0) {
            alert("Reshuffling..!")
            this.cardsDealt = 0;

            for (let i = 0; i < this.cards.length; i++) {
                this.cards[i].dealt = false;

                if (this.inTheHand(hands, this.cards[i])) {
                    this.cards[i].dealt = true;
                    this.cardsDealt += 1;
                }
            }
        }

        availableCards = this.cards.filter((card) => !card.dealt);

        if (availableCards.length > 0) {
            let randCardIndex = Math.floor(Math.random() * availableCards.length);
            card = availableCards[randCardIndex];
            card.dealt = true;
            this.cardsDealt += 1;
        }

        return card;
    },
    inTheHand : function(hands, card){
        return hands.some(hand => hand.some(handCard => handCard.img === card.img));
    }
};

function handValue(hand) {
    let total = 0;
    let aces = 0;

    for (const card of hand) {
        total += card.value;
        if (card.img.startsWith('A')) aces++;
    }

    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }

    return total;
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
}

let UI = {
    setBet: function (betValue, displayId) {
        let errorStatus;
        let inputElement = document.getElementById(betValue);

        Player.bet = inputElement.value;
        errorStatus = UI.checkForErrors(Player.bet);

        if (errorStatus.gotError) {
            document.getElementById("errors").innerHTML = errorStatus.errorMsg;
        }
        return errorStatus.gotError;

    },
    displayTotalHand : function(hand, id){
        let displayObj = document.getElementById(id);
        let oStr = "";
        for ( let i=0; i<hand.length; i++ ){
            let cImg = hand[i].img;
            oStr += `<img class='cardImg' src='images/${cImg}.png'  alt='Card' />`;
        }
        displayObj.innerHTML = oStr;
    },
    displayDealerHandInitial : function(hand, id){
        let displayObj = document.getElementById(id);
        let oStr = "";
        oStr +=`<img class='cardImg' src='images/purple_back.png' alt='Card'/>`;
        for ( let i=1; i<hand.length; i++ ){
            let cImg = hand[i].img;
            oStr += `<img class='cardImg' src='images/${cImg}.png'  alt='Card' />`;
        }
        displayObj.innerHTML = oStr;
    },
    displayResult : function(id, msg){
        let obj = document.getElementById(id);
        obj.innerHTML = msg;
    },
    checkForErrors : function(betValue){
        let betToInt = betValue * 1;
        let errorObj = {
            errorMsg : "",
            gotError : false
        };
        if(isNaN(betToInt)){
            errorObj.errorMsg += `<span style='color: red; '> ${escapeHTML(betValue)} Is Not a Number\n </span><br/>`;
            errorObj.gotError = true;
        }
        if(betToInt > Player.balance){
            errorObj.errorMsg += "<span style='color: red; '> Insufficient Funds, Try a lower Bet Amount\n </span><br/>";
            errorObj.gotError = true;
        }
        if(betToInt > 500){
            errorObj.errorMsg += "<span style='color: red; '> Bets Greater Than 500 Are Not Acceptable\n </span><br/>";
            errorObj.gotError = true;
        }
        if(betToInt < 0){
            errorObj.errorMsg += "<span style='color: red; '> Cannot Bet a Negative Amount\n </span><br/>";
            errorObj.gotError = true;
        }
        if(betToInt === 0){
            errorObj.errorMsg += "<span style='color: red; '> Cannot Bet 0\n</span><br/>";
            errorObj.gotError = true;
        }
        if(!Number.isInteger(betToInt)){
            errorObj.errorMsg += "<span style='color: red; '> Bets Must Be Integers\n</span><br/>";
            errorObj.gotError = true;
        }
        return errorObj;
    },
    displayOverallStatus : function(){
        document.getElementById("balance").innerHTML = Player.balance;
        document.getElementById("bet").innerHTML = Player.bet;
        document.getElementById("games").innerHTML = Player.totalGames;
        document.getElementById("wins").innerHTML = Player.totalWins;
        document.getElementById("losses").innerHTML = Player.totalLosses;
    },
    displayCurrentStatus : function(){
        document.getElementById("playerValue").innerHTML = Player.totalHandValue;
        document.getElementById("playerHits").innerHTML = Player.numberOfHits;

        if(Player.standing || GameState.hasWinner) {
            document.getElementById("dealerValue").innerHTML = Dealer.getTotalValue().toString();
        } else if (!Player.standing) {
            document.getElementById("dealerValue").innerHTML = Dealer.getOneCardValue().toString();
        }
        document.getElementById("dealerHits").innerHTML = Dealer.numberOfHits;
    }
};
let GameState = {
    animationID : undefined,
    hasWinner : false,
    outOfFunds : function () {
        document.getElementById("balance").innerHTML = "1000";
        document.getElementById("bet").innerHTML = "0";
        document.getElementById("games").innerHTML = "0";
        document.getElementById("wins").innerHTML = "0";
        document.getElementById("losses").innerHTML = "0";
        document.getElementById("placeBet").style.display="block";
        document.getElementById("Player Cards").innerHTML = "";
        document.getElementById("Dealer Cards").innerHTML = "";
        document.getElementById("playerAnimation").innerHTML = "";
        document.getElementById("playerResults").innerHTML = "";
        document.getElementById("dealerAnimation").innerHTML = "";
        document.getElementById("playerValue").innerHTML = "0";
        document.getElementById("playerHits").innerHTML = "0";
        document.getElementById("dealerValue").innerHTML = "0";
        document.getElementById("dealerHits").innerHTML = "0";
        document.getElementById("errors").innerHTML = "";
        document.getElementById("outOfFunds").style.display="none";
        document.getElementById("overallStatusTitle").innerHTML = "Overall Status";
        document.getElementById("currentGameTitle").innerHTML = "Enter Bet to Start";
        Player.hand = [];
        Dealer.hand = [];
        Player.busted = false;
        Player.standing = false;
        Player.balance = 1000;
        Player.bet = 0;
        Player.totalWins = 0;
        Player.totalLosses = 0;
        Player.totalGames = 0;
        Player.numberOfHits = 0;
        Player.totalHandValue = 0;
        Deck.cards.forEach(card => { card.dealt = false; });
        Deck.cardsDealt = 0;
        GameState.hasWinner = false;
        clearInterval(GameState.animationId);
    },
    busted : function() {
        let elem = document.getElementById("playerAnimation");
        let column = document.getElementById("centerColumn");
        let direction = 1; // 1 for right, -1 for left

        function updateColumnWidth() {
            return column.offsetWidth;
        }

        let columnWidth = updateColumnWidth();
        let pos = 0;

        GameState.animationId = setInterval(frame, 5);

        function frame() {
            columnWidth = updateColumnWidth();

            let subtractionValue = (columnWidth < 600) ? 150 : 350;

            if (pos >= columnWidth - subtractionValue) {
                direction = -1;
            } else if (pos <= 0) {
                direction = 1;
            }

            pos += direction;
            elem.style.transform = 'translateX(' + pos + 'px)';
        }

        window.addEventListener('resize', function () {
            columnWidth = updateColumnWidth();
        });
    }
};
let Player = {
    hand : [],
    busted : false,
    standing : false,
    balance : 1000,
    bet : 0,
    totalWins : 0,
    totalLosses : 0,
    totalGames : 0,
    numberOfHits : 0,
    totalHandValue : 0,
    dealInitialCards: function () {
        this.hand = [];
        for (let i = 0; i < Blackjack.startingCards; i++) {
            this.hand.push(Deck.getCard(this.hand, Dealer.hand));
        }
    },
    hit: function() {
        let card = Deck.getCard(this.hand, Dealer.hand);

        if (card === null) {
            this.hand = Blackjack.setHand(Dealer.hand);
        } else {
            this.hand.push(card);
        }
        UI.displayTotalHand(Player.hand, "Player Cards");
        this.numberOfHits++;
        this.getTotalValue();
        UI.displayCurrentStatus();
        if (this.isBusted()){
            document.getElementById("currentGameTitle").innerHTML = `Player Takes a Hit... and BUSTS!`;
            document.getElementById("playerAnimation").innerHTML = "<i class=\"fa-solid fa-burst fa-shake fa-2xl\" style=\"color: #bc3434;\"></i> BUSTED <i class=\"fa-solid fa-burst fa-shake fa-2xl\" style=\"color: #bc3434;\"></i>";
            GameState.busted();
            this.endGameLoss();
            return;
        }
        document.getElementById("currentGameTitle").innerHTML = `Player Takes Hit: ${Player.numberOfHits}. Click Hit or Stick`;
    },
    stand: function(){
        document.getElementById("currentGameTitle").innerHTML = `Player Sticks at ${Player.totalHandValue}`;
        this.standing = true;
        Blackjack.gameState="Dealer";
        UI.displayTotalHand(Dealer.hand, "Dealer Cards");
        UI.displayCurrentStatus();
        this.endTurn();
        if (GameState.hasWinner) {
            document.getElementById("dealerHit").style.display="none";
            return;
        }
        const playerTotal = this.getTotalValue();
        const dealerTotal = Dealer.getTotalValue();
        if (dealerTotal < 17) return;
        if (dealerTotal > 21) {
            document.getElementById("currentGameTitle").innerHTML = `You Sticked on ${playerTotal} and Won Pts!`;
            this.endGameWin();
        } else if (dealerTotal > playerTotal) {
            document.getElementById("currentGameTitle").innerHTML = `You Sticked on ${Player.totalHandValue} and Lost Pts! `;
            this.endGameLoss();
        } else if (dealerTotal === playerTotal) {
            document.getElementById("currentGameTitle").innerHTML = `Dealer wins on ties! You Lost!`;
            this.endGameLoss();
        } else {
            document.getElementById("currentGameTitle").innerHTML = `You Sticked on ${Player.totalHandValue} and Won Pts!`;
            this.endGameWin();
        }
    },
    getTotalValue : function(){
        this.totalHandValue = handValue(this.hand);
        return this.totalHandValue;
    },
    isBusted : function(){
        if (this.totalHandValue>21){
            this.busted = true;
            return true;
        } else {
            return false;
        }
    },
    endGameLoss : function () {
        if (GameState.hasWinner) return;
        GameState.hasWinner = true;
        alert("Loser, Loser, Nyquil Boozer");
        Player.updateBalanceLoss();
        Player.totalLosses++;
        UI.displayOverallStatus();
        document.getElementById("playerResults").innerHTML = "<img id='loser' src='images/looser.png'>"
        document.getElementById("dealerAnimation").innerHTML = "<img id='winner' src='images/winner.png'>"
        document.getElementById("playerValue").innerHTML = Player.totalHandValue;
        document.getElementById("hitButton").style.display="none";
        document.getElementById("standButton").style.display="none";
        document.getElementById("dealerHit").style.display="none";
        document.getElementById("errors").innerHTML = "";
        if (hasBlackjack(Dealer.hand)) {
            let blackjackImage = hasBlackjack(Dealer.hand) ? "<img src='images/blackJack.png' style='height: 100px; width: auto; object-fit: contain' alt='Blackjack' />" : "";
            document.getElementById("dealerAnimation").innerHTML = "<img id='winner' src='images/winner.png'>" + blackjackImage;
        }
        else{
            document.getElementById("playerResults").innerHTML = "<img id='loser' src='images/looser.png'>";
        }
    },
    endGameWin : function () {
        if (GameState.hasWinner) return;
        GameState.hasWinner = true;
        alert("Winner, Winner, Chicken Dinner");
        Player.updateBalanceWin();
        Player.totalWins++;
        UI.displayOverallStatus();
        document.getElementById("playerResults").innerHTML = "<img id='winner' src='images/winner.png'>"
        document.getElementById("dealerAnimation").innerHTML = "<img id='loser' src='images/looser.png'>"
        document.getElementById("placeBet").style.display="block";
        document.getElementById("hitButton").style.display="none";
        document.getElementById("standButton").style.display="none";
        document.getElementById("dealerHit").style.display="none";
        document.getElementById("errors").innerHTML = "";
        if (hasBlackjack(Player.hand)) {
            let blackjackImage = hasBlackjack(Player.hand) ? "<img src='images/blackJack.png' style='height: 100px; width: auto; object-fit: contain' alt='Blackjack' />" : "";
            document.getElementById("playerResults").innerHTML = "<img id='winner' src='images/winner.png'>" + blackjackImage;
        }
        else{
            document.getElementById("playerResults").innerHTML = "<img id='winner' src='images/winner.png'>";
        }
    },
    endTurn : function () {
        document.getElementById("hitButton").style.display="none";
        document.getElementById("standButton").style.display="none";
        document.getElementById("dealerHit").style.display="block";
    },
    updateBalanceLoss : function() {
        document.getElementById("outOfFunds").style.display="none";
        Player.balance -= Player.bet;
        if (Player.balance <= 0){
            Player.balance = 0;
            alert("Game Over, Insufficient Funds!");
            document.getElementById("overallStatusTitle").innerHTML = `Insufficient Funds, Click Restart for New Game`;
            document.getElementById("outOfFunds").style.display="block";
            document.getElementById("placeBet").style.display="none";

        } else {
            document.getElementById("placeBet").style.display="block";
        }
    },
    updateBalanceWin : function() {
        this.balance += (this.bet * Blackjack.standardOrBlackjack().payout);
    },
};

let Dealer = {
    hand : [],
    busted : false,
    numberOfHits : 0,
    totalHandValue : 0,
    dealInitialCards: function(){
        this.hand = [];
        for (let i = 0; i < Blackjack.startingCards; i++) {
            this.hand.push(Deck.getCard(Player.hand, this.hand));
        }
    },
    hit: function() {
        let card = Deck.getCard(Player.hand, this.hand);

        if (card === null) {
            this.hand = Blackjack.setHand(Player.hand);
        } else {
            this.hand.push(card);
        }
        this.numberOfHits++;
        UI.displayTotalHand(Dealer.hand, "Dealer Cards")
        UI.displayCurrentStatus();
        document.getElementById("currentGameTitle").innerHTML = `Dealer Plays Showing ${this.getTotalValue()}`;
        const dealerTotal = this.getTotalValue();
        const playerTotal = Player.getTotalValue();
        if (dealerTotal < 17) return;

        if (GameState.hasWinner) return;
        if (this.isBusted()) {
            document.getElementById("currentGameTitle").innerHTML = `Bet: ${Player.bet} Game Over Dealer Busts! Player Wins!`;
            Player.endGameWin();
            document.getElementById("dealerAnimation").innerHTML = "<img src='images/busted.png' alt='Dealer Busted' style='height: 100px;'/>";
            document.getElementById("overallStatusTitle").innerHTML ="Play Again!"
        } else if (dealerTotal >= playerTotal) {
            document.getElementById("currentGameTitle").innerHTML = dealerTotal === playerTotal ? `The House Wins by Tie!` : `Dealer Wins by Points!`;
            Player.endGameLoss();
        } else {
            document.getElementById("currentGameTitle").innerHTML = `Player Wins by Points!`;
            Player.endGameWin();
        }
    },
    getTotalValue : function(){
        this.totalHandValue = handValue(this.hand);
        return this.totalHandValue;
    },
    getOneCardValue : function(){
        return this.hand[1].value;
    },
    isBusted : function(){
        if (this.totalHandValue>21){
            this.busted = true;
            return true;
        } else {
            return false;
        }
    },
    play: function(){

    }
};

let Blackjack = {
    gameState : "Player",
    blackjackValue : 21,
    payoutRates :  new Map( [
        ['standard', 1],
        ['blackjack', 2],
    ]),
    startingCards: 2,
    setHand : function(...otherHands){
        let hand = [];
        for(let i=0; i<this.startingCards; i++){
            hand.push(Deck.getCard(hand, ...otherHands));
        }
        return hand;
    },
    standardOrBlackjack : function(){
        let initialHandResults = {
            payout : this.payoutRates.get('standard'),
            winType : 'standard'
        }
        if (hasBlackjack(Player.hand)){
            initialHandResults.payout = this.payoutRates.get('blackjack');
            initialHandResults.winType = 'blackjack';
        }

        return initialHandResults;
    }
};
function hasBlackjack(hand) {
    let isAce = hand.some(card => card.img.includes('A'));
    let isTenOrFaceCard = hand.some(card => ['10', 'J', 'Q', 'K'].includes(card.img.substring(0, card.img.length - 1)));
    return isAce && isTenOrFaceCard && hand.length === 2;
}
function startGame() {
    Player.hand = [];
    Player.busted = false;
    Dealer.hand = [];
    Dealer.busted = false;
    Player.numberOfHits = 0;
    Dealer.numberOfHits = 0;
    Blackjack.gameState = "Player";
    Player.totalHandValue = 0;
    Dealer.totalHandValue = 0;
    Player.standing = false;
    GameState.hasWinner = false;
    clearInterval(GameState.animationId);
    GameState.animationId = undefined;
    document.getElementById("placeBet").style.display="block";
    document.getElementById("playerAnimation").innerHTML = "";
    document.getElementById("playerResults").innerHTML = "";
    document.getElementById("dealerAnimation").innerHTML = "";
    document.getElementById("overallStatusTitle").innerHTML = `Overall Status`;

    let gotError = UI.setBet("betValue", "errors");

    if (!gotError) {
        document.getElementById("currentGameTitle").innerHTML = `Bet: ${Player.bet} | Click Stick or Hit to Continue`
        UI.displayOverallStatus();
        Player.totalGames++;
        Player.dealInitialCards();
        Dealer.dealInitialCards();
        Player.getTotalValue();

        if (hasBlackjack(Dealer.hand)){
            alert("Dealer Got BlackJack!");
            UI.displayTotalHand(Player.hand, "Player Cards");
            UI.displayTotalHand(Dealer.hand, "Dealer Cards");
            Player.endGameLoss();
            UI.displayCurrentStatus();
            document.getElementById("currentGameTitle").innerHTML = `BLACKJACK Dealer, You Lost!`;
            document.getElementById("overallStatusTitle").innerHTML = `Dealer BlackJack!! Current Status`;
            return;
        } else if (hasBlackjack(Player.hand)){
            alert("User Got BlackJack!");
            UI.displayTotalHand(Player.hand, "Player Cards");
            UI.displayTotalHand(Dealer.hand, "Dealer Cards");
            Player.endGameWin();
            UI.displayCurrentStatus();
            document.getElementById("currentGameTitle").innerHTML = `BLACKJACK Player Win 2x bet!`;
            document.getElementById("overallStatusTitle").innerHTML = `BlackJack! Current Status`;
            return;
        } else if (Player.isBusted()){
            Player.endGameLoss();
            UI.displayCurrentStatus();
            return;
        }
        document.getElementById("hitButton").style.display="";
        document.getElementById("standButton").style.display="";
        UI.displayTotalHand(Player.hand, "Player Cards");
        UI.displayDealerHandInitial(Dealer.hand, "Dealer Cards");
        UI.displayCurrentStatus();
        document.getElementById("placeBet").style.display="none";

    }
}
