# BlackJack-Game

BlackJack-Game is a browser-based blackjack project built with plain HTML, CSS, and JavaScript. It uses image assets for the deck, tracks a player balance, validates bets, deals cards, and lets the player hit or stick while the dealer plays by the game logic in `javascriptBJ.js`.

## What It Does

- Starts the player with a balance of 1000
- Accepts integer bets up to 500
- Deals two cards each to the player and dealer
- Hides the dealer's first card until the player sticks
- Tracks hand points, hits, wins, losses, and balance
- Handles busts, ties, dealer play, and blackjack payouts

## Stack

- HTML
- CSS
- JavaScript
- Static PNG/JPEG card and result images

## Run Locally

No build step is required. Clone the repo and open `jack.html` in a browser:

```bash
git clone https://github.com/cl0ax/BlackJack-Game.git
cd BlackJack-Game
open jack.html
```

You can also serve the folder with any static file server:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000/jack.html
```

## How To Play

1. Enter a bet.
2. Click `Place Bet`.
3. Use `Hit` to draw another card.
4. Use `Stick` to stop drawing and let the dealer play.
5. Continue betting until the balance reaches zero or you restart.

## Known Issue

The original project README noted a bug where blackjack can sometimes trigger unexpectedly. That is still worth checking before treating the game logic as finished.
