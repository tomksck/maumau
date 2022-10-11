/** @module controllers/game_controller */

import Table from '../models/table.js';
import Card from '../models/card.js';
import Player from '../models/player.js';
import Game from '../models/game.js';
import { EventEmitter } from 'events';

export default class GameController extends EventEmitter {
  constructor() {
    super();
    this._table = null;
    this._players = null;
    this._game = null;
  }

  #currentPlayer() {
    return this._table.getPlayer(this._game.getCurrentPlayer());
  }

  /**
   *
   * @returns {String} player name
   */
  getPlayerName() {
    return this.#currentPlayer().getName();
  }

  /**
   *
   * @returns {String} player names
   */
  getPlayerNames() {
    return this._players.map((player) => player.getName());
  }

  /**
   *
   * @returns {Card} top card
   */
  getTableCard() {
    return this._table.getOpenCard();
  }

  /**
   *
   * @returns {Array.<Card>} player cards
   */
  getPlayerCards() {
    return this.#currentPlayer().getCards();
  }

  /**
   *
   * @param {Number} playerCount
   */
  newGame(playerCount) {
    const cards = this.#makeCards();
    const players = new Array(playerCount).fill().map((u) => new Player({}));
    players.forEach((player, index) => player.setName(`Player ${index}`));
    for (let i = 0; i < playerCount * 7; i++) {
      players[i % playerCount].takeCard(cards.pop());
    }
    this._players = players;
    this._table = new Table({ name: 'Game 1', openCards: [cards.pop()], players: players, cards: cards });
    this._game = new Game({ table: this._table });
    this.emit('newGame', this._game);
  }

  nextTurn() {
    this._game.nextPlayer();
    this.emit('newTurn');
  }

  takeCard() {
    const card = this._table.getTopCard();
    if (card) {
      this.#currentPlayer().takeCard(card);
      this.emit('tookCard', this.#currentPlayer(), card);
    }
  }

  throwCard(index) {
    const card = this.#currentPlayer().throwCard(index);
    const topCard = this._table.getOpenCard();
    if (!card || !topCard) {
      this.emit('error', 'No card to throw');
    }
    if (card.getColor() === topCard.getColor() || card.getValue() === topCard.getValue()) {
      this._table.putCard(card);
      if (this.#currentPlayer().getCards().length === 0) {
        this.emit('playerWon', this.#currentPlayer());
        return;
      }
      this.emit('threwCard', this.#currentPlayer(), card);
    } else {
      this.#currentPlayer().takeCard(card);
      this.emit('cardNotThrown');
    }
  }

  endGame() {
    this._table = null;
    this._players = null;
    this._game = null;
    this.emit('endGame');
  }

  #makeCards() {
    const cards = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 13; j++) {
        cards.push(new Card({ color: i, value: j }));
      }
    }
    return this.#shuffle(cards);
  }

  /**
   * Shuffles array in place. ES6 version
   * @param {Array} a items An array containing the items.
   */
  #shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}
