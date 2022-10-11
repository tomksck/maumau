/** @module models/card */

import Model from './model.js';

export default class Card extends Model {
  /**
   *
   * @param {Object} data
   * @param {string} data.color
   * @param {string} data.value
   */
  constructor(data) {
    super();
    this._color = data.color || 0;
    this._value = data.value || 0;
  }

  toString() {
    return `Card[ color: ${this._color}, value: ${this._value} ]`;
  }

  getColor() {
    return this._color;
  }

  getValue() {
    return this._value;
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
