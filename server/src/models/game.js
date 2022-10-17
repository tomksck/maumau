/** @module models/game */

import Model from './model.js';
import Table from './table.js';

export default class Game extends Model {
  /**
   *
   * @param {Object} data
   * @param {Table} data.table
   * @param {Number | null} data.currentPlayer
   */
  constructor(data) {
    super();
    this._table = data.table || new Table({});
    this._currentPlayer = data.currentPlayer || -1;
  }

  getCurrentPlayer() {
    return this._currentPlayer;
  }

  getNextPLayer() {
    return (this._currentPlayer + 1) % this._table.getPlayerCount();
  }

  nextPlayer() {
    this._currentPlayer = (this._currentPlayer + 1) % this._table.getPlayers().length;
    return this._currentPlayer;
  }
}
