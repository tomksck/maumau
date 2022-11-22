/** @module models/player */

import Model from './model.js';
import Card from './card.js';

export default class Player extends Model {
  /**
   *
   * @param {Object} data
   * @param {string} data.name
   * @param {Array.<Card>} data.cards
   */
  constructor(data) {
    super();
    this._name = data.name || '';
    this._cards = data.cards || [];
  }

  /**
   *
   * @param {String} name
   */
  setName(name) {
    this._name = name;
  }

  /**
   *
   * @returns {String} Name of the player
   */
  getName() {
    return this._name;
  }

  /**
   *
   * @returns {Array.<Card>} Cards of the player
   */
  getCards() {
    return this._cards;
  }

  /**
   *
   * @param {Card} card Card to add
   */
  takeCard(card) {
    this._cards.push(card);
  }

  tryThrowCard(index) {
    return this._cards[index];
  }

  /**
   *
   * @param {Number} index Index of card to remove
   */
  throwCard(index) {
    const card = this._cards[index];
    if (card) {
      this._cards.splice(index, 1);
      return card;
    }
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
