import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../javascriptBJ.js', import.meta.url), 'utf8');

function loadGame() {
  const elements = new Map();
  const alerts = [];
  const fakeMath = Object.create(Math);
  fakeMath.random = () => 0;
  const context = {
    document: {
      getElementById(id) {
        if (!elements.has(id)) {
          elements.set(id, {
            innerHTML: '', textContent: '', value: '',
            style: { display: '' }, offsetWidth: 800
          });
        }
        return elements.get(id);
      }
    },
    window: { addEventListener() {} },
    alert(message) { alerts.push(message); },
    console: { log() {}, error() {} },
    Math: fakeMath,
    setInterval() { return 1; },
    clearInterval() {}
  };
  vm.createContext(context);
  vm.runInContext(`${source}\nglobalThis.game = { Deck, UI, GameState, Player, Dealer, Blackjack, hasBlackjack, startGame, handValue: typeof handValue === 'function' ? handValue : null };`, context);
  return { ...context.game, elements, alerts, context };
}

const card = (rank, suit = 'H') => ({ img: `${rank}${suit}`, value: rank === 'A' ? 11 : ['J', 'Q', 'K'].includes(rank) ? 10 : Number(rank) });

test('every two-card ace plus ten-value hand is a natural, but extra cards are not', () => {
  const game = loadGame();
  for (const rank of ['10', 'J', 'Q', 'K']) {
    const hand = [card('A'), card(rank, 'S')];
    assert.equal(game.hasBlackjack(hand), true, `Ace + ${rank}`);
    game.Player.hand = hand;
    assert.equal(game.Blackjack.standardOrBlackjack().winType, 'blackjack');
    assert.equal(game.Blackjack.standardOrBlackjack().payout, 2);
  }
  assert.equal(game.hasBlackjack([card('A'), card('5'), card('5')]), false);
  assert.equal(game.hasBlackjack([card('10'), card('K')]), false);
});

test('dealing, payout, and badge use the same natural check', () => {
  const game = loadGame();
  game.elements.set('betValue', { value: '50', innerHTML: '', textContent: '', style: { display: '' }, offsetWidth: 800 });
  const deal = [card('A'), card('Q'), card('8'), card('9')];
  game.Deck.getCard = () => deal.shift();

  game.startGame();

  assert.equal(game.Player.totalWins, 1);
  assert.equal(game.Player.totalLosses, 0);
  assert.equal(game.Player.balance, 1100);
  assert.match(game.elements.get('playerResults').innerHTML, /blackJack\.png/);
});

test('one shared hand value softens every ace needed to stay at 21 or below', () => {
  const game = loadGame();
  const cases = [
    [[card('J'), card('2'), card('A')], 13],
    [[card('A'), card('3'), card('A'), card('10')], 15],
    [[card('A'), card('A'), card('A'), card('8')], 21],
    [[card('10'), card('8')], 18]
  ];

  for (const [hand, expected] of cases) {
    assert.equal(game.handValue(hand), expected);
    game.Player.hand = hand;
    assert.equal(game.Player.getTotalValue(), expected);
    game.Dealer.hand = hand;
    assert.equal(game.Dealer.getTotalValue(), expected);
  }
});

test('player hit recomputes a multi-ace total after every draw', () => {
  const game = loadGame();
  game.Player.hand = [card('A'), card('3'), card('A')];
  game.Player.totalHandValue = 15;
  game.Dealer.hand = [card('8'), card('4')];
  game.Deck.getCard = () => card('10');

  game.Player.hit();

  assert.equal(game.Player.totalHandValue, 15);
  assert.equal(game.Player.busted, false);
  assert.equal(game.elements.get('playerValue').innerHTML, 15);
});

test('dealer bust settles a hand once and leaves a consistent out-of-funds UI', () => {
  const game = loadGame();
  game.elements.set('outOfFunds', { innerHTML: '', textContent: '', value: '', style: { display: 'none' }, offsetWidth: 800 });
  game.Player.hand = [card('10'), card('8')];
  game.elements.set('overallStatusTitle', { innerHTML: '', textContent: '', value: '', style: { display: '' }, offsetWidth: 800 });
  game.Player.totalHandValue = 18;
  game.Player.bet = 100;
  game.Player.balance = 100;
  game.Player.totalGames = 1;
  game.Dealer.hand = [card('10'), card('10', 'S'), card('2')];
  game.Dealer.totalHandValue = 22;

  game.Player.stand();

  assert.equal(game.Player.totalWins + game.Player.totalLosses, 1);
  assert.equal(game.Player.totalWins, 1);
  assert.equal(game.Player.totalLosses, 0);
  assert.equal(game.elements.get('placeBet').style.display, 'block');
  assert.equal(game.elements.get('outOfFunds').style.display === 'block', false);
  assert.doesNotMatch(game.elements.get('overallStatusTitle').innerHTML, /Insufficient Funds/);
});

test('a settled hand cannot be settled a second time or show conflicting restart controls', () => {
  const game = loadGame();
  game.Player.bet = 100;
  game.Player.balance = 100;

  game.Player.hand = [card('10'), card('7')];
  game.Player.endGameLoss();
  game.Player.endGameWin();

  assert.equal(game.Player.totalLosses, 1);
  assert.equal(game.Player.totalWins, 0);
  assert.equal(game.elements.get('placeBet').style.display, 'none');
  assert.equal(game.elements.get('outOfFunds').style.display, 'block');
  assert.match(game.elements.get('overallStatusTitle').innerHTML, /Insufficient Funds/);
});

test('out-of-funds settlement keeps only restart visible', () => {
  const game = loadGame();
  game.Player.hand = [card('10'), card('7')];
  game.Player.bet = 100;
  game.Player.balance = 100;

  game.Player.endGameLoss();

  assert.equal(game.elements.get('placeBet').style.display, 'none');
  assert.equal(game.elements.get('outOfFunds').style.display, 'block');
  assert.match(game.elements.get('overallStatusTitle').innerHTML, /Insufficient Funds/);
});

test('player stand does not settle a hand a second time', () => {
  const game = loadGame();
  game.Player.hand = [card('10'), card('8')];
  game.Player.bet = 10;
  game.Player.balance = 100;
  game.Dealer.hand = [card('10', 'S'), card('7', 'S')];
  game.Player.endGameLoss();

  game.Player.stand();

  assert.equal(game.Player.totalWins, 0);
  assert.equal(game.Player.totalLosses, 1);
});

test('dealer softens an ace and waits to hit until reaching 17', () => {
  const game = loadGame();
  game.Player.hand = [card('10'), card('8')];
  game.Dealer.hand = [card('A'), card('2')];
  game.Deck.getCard = () => card('4');
  game.elements.set('dealerHit', { innerHTML: '', textContent: '', value: '', style: { display: 'block' }, offsetWidth: 800 });
  game.Player.totalGames = 1;

  game.Dealer.hit();

  assert.equal(game.Dealer.totalHandValue, 17);
  assert.equal(game.Player.totalWins + game.Player.totalLosses, 1);
  assert.equal(game.Player.totalWins, 1);
  assert.equal(game.Player.totalLosses, 0);
  assert.equal(game.elements.get('dealerHit').style.display, 'none');
});

test('a 12-12 hand waits for dealer play instead of settling a tie early', () => {
  const game = loadGame();
  game.Player.hand = [card('10'), card('2')];
  game.Player.totalHandValue = 12;
  game.Dealer.hand = [card('10', 'S'), card('2', 'S')];
  game.Dealer.totalHandValue = 12;

  game.Player.stand();

  assert.equal(game.Player.totalWins + game.Player.totalLosses, 0);
  assert.equal(game.elements.get('dealerHit').style.display, 'block');
});

test('reshuffling preserves cards in both current hands', () => {
  const game = loadGame();
  const playerCard = game.Deck.cards[0];
  const dealerCard = game.Deck.cards[1];
  game.Player.hand = [playerCard];
  game.Dealer.hand = [dealerCard];
  game.Deck.cards.forEach(c => { c.dealt = true; });
  game.Deck.cardsDealt = game.Deck.cards.length;

  const drawn = game.Deck.getCard(game.Player.hand, game.Dealer.hand);

  assert.notEqual(drawn.img, playerCard.img);
  assert.notEqual(drawn.img, dealerCard.img);
  assert.equal(playerCard.dealt, true);
  assert.equal(dealerCard.dealt, true);
});

test('restart clears every deck dealt flag', () => {
  const game = loadGame();
  game.Deck.cards.forEach(c => { c.dealt = true; });
  game.Deck.cardsDealt = game.Deck.cards.length;

  game.GameState.outOfFunds();

  assert.equal(game.Deck.cardsDealt, 0);
  assert.equal(game.Deck.cards.every(c => !c.dealt), true);
});

test('invalid bet text is escaped before it reaches the HTML error area', () => {
  const game = loadGame();
  game.elements.set('betValue', { value: '<img src=x onerror=alert(1)>', innerHTML: '', textContent: '', style: { display: '' }, offsetWidth: 800 });

  game.UI.setBet('betValue', 'errors');

  const errorHTML = game.elements.get('errors').innerHTML;
  assert.doesNotMatch(errorHTML, /<img\b/i);
  assert.match(errorHTML, /&lt;img/);
});

test('game source has no leftover debug console.log calls', () => {
  assert.doesNotMatch(source, /console\.log\s*\(/);
});
