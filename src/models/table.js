/** @module models/table */

import Model from './model.js';
import Card from './card.js';
import Player from './player.js';

export default class Table extends Model {
  /**
   *
   * @param {Object} data
   * @param {string} data.name
   * @param {Array.<Card>} data.cards
   * @param {Array.<Card>} data.openCards
   * @param {Array.<Player>} data.players
   */
  constructor(data) {
    super();
    this._name = data.name || '';
    this._cards = data.cards || [];
    this._openCards = data.openCards || [];
    this._players = data.players || [];
  }

  /**
   *
   * @param {Number} playerId
   * @returns {Player} True if the player is in the table
   */
  getPlayer(playerId) {
    return this._players[playerId];
  }

  /**
   *
   * @returns {Array.<Player>} Players of the table
   */
  getPlayers() {
    return this._players;
  }

  /**
   *
   * @returns {Card | null}
   */
  getTopCard() {
    if (this._cards.length > 0) {
      return this._cards.pop();
    }
    if (this._openCards.length < 2) {
      return null;
    }
    this._cards = this._openCards[(0, this._openCards.length - 2)];
    this._openCards = [...this._openCards[this._openCards.length - 1]];
    return this._cards.pop();
  }

  /**
   *
   * @returns {Card | null}
   */
  getOpenCard() {
    return this._openCards[this._openCards.length - 1] || null;
  }

  /**
   *
   * @param {Card} card
   */
  putCard(card) {
    this._openCards.push(card);
  }

  async save() {
    // save data
    throw new Error('Not implemented');
  }

  async load() {
    // load data
    throw new Error('Not implemented');
  }

  async delete() {
    // delete data
    throw new Error('Not implemented');
  }

  async update() {
    // update data
    throw new Error('Not implemented');
  }
}
