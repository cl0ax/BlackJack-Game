# BlackJack-Game

This is a browser-based coursework project built with plain HTML, CSS, and JavaScript. It demonstrates DOM updates, form validation, object-based game state, random card selection, responsive styling, and a multi-step blackjack-like game loop.

It is a classroom exercise, not a production casino game or a complete implementation of standard blackjack rules.

## What it does

- Starts the player with a balance of 1000.
- Accepts positive integer bets up to 500 and no more than the current balance.
- Deals two image-backed cards to the player and dealer.
- Hides one dealer card during the player's turn.
- Lets the player hit or stick.
- Exposes a separate `Dealer Play` button for dealer hits after the player sticks.
- Tracks displayed hand values, hit counts, games, wins, losses, bets, and balance.
- Handles busts, ties, initial blackjack checks, and win or loss balance changes.
- Provides responsive layouts for narrower screens.

## Technologies

- HTML
- CSS
- JavaScript
- Local PNG and JPEG assets

## Run locally

No build step is required. Clone the repository and open `jack.html` in a browser:

```bash
git clone https://github.com/cl0ax/BlackJack-Game.git
cd BlackJack-Game
open jack.html
```

You can also use a local static server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000/jack.html`.

## How to play

1. Enter a bet and click `Place Bet`.
2. Use `Hit` to draw another player card.
3. Use `Stick` to end the player's turn.
4. Use `Dealer Play` to advance the dealer's hand when that button appears.
5. Place another bet after the hand is resolved, or use restart to reset the session.

## Known limitations

- The rule set is simplified and the dealer wins ties.
- Dealer play requires button clicks instead of running automatically.
- The source contains overlapping blackjack checks and the original project noted that blackjack can trigger unexpectedly.
- There are no automated tests.
