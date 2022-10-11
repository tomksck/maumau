/** @module view/cli */

import GameController from '../controllers/game_controller.js';
import ReadLine from 'readline';
import { exit, stdin as input, stdout as output } from 'process';
const rl = ReadLine.createInterface({ input, output });

export default class CLI {
  constructor() {
    this._game = new GameController();
    this._game.on('newGame', this.#onNewGame);
    this._game.on('newTurn', this.#onNewTurn);
    this._game.on('endGame', this.#onEndGame);
    this._game.on('error', this.#onError);
    this._game.on('threwCard', this.#onThrewCard);
    this._game.on('cardNotThrown', this.#onCardNotThrown);
    this._game.on('tookCard', this.#onTookCard);
    this._game.on('playerWon', this.#onPlayerWon);
    this._game.on('playerLost', this.#onPlayerLost);
    this._game.on('playerLeft', this.#onPlayerLeft);
  }

  start = () => {
    console.clear();
    this.#print('Welcome to MauMau!');
    this.#print('Please enter the number of players:');
    rl.question('', (answer) => {
      this._game.newGame(parseInt(answer));
    });
  };

  #turn = () => {
    this.#print('Table Card:');
    this.#print(this._game.getTableCard().toString());
    this.#print('Your Cards:');
    this._game.getPlayerCards().forEach((card, index) => {
      this.#print(`${index}: ${card.toString()}`);
    });
    this.#print('Please enter the number of the card you want to throw or "t" to take a card:');
    rl.question('', (answer) => {
      if (answer === 't') {
        this._game.takeCard();
      } else {
        this._game.throwCard(parseInt(answer));
      }
    });
  };

  #onNewGame = () => {
    this.#print('New game started!');
    this.#print('Players:');
    this.#print(this._game.getPlayerNames().join(', '));
    this._game.nextTurn();
  };

  #onNewTurn = () => {
    console.clear();
    this.#print(`It's ${this._game.getPlayerName()}'s turn!`);
    this.#print('Press enter when ready...');
    rl.question('', () => {
      this.#turn();
    }); // wait for enter
  };

  #onThrewCard = (player, card) => {
    this.#print(`${player.getName()} threw ${card.toString()}`);
    this._game.nextTurn();
  };

  #onCardNotThrown = () => {
    this.#print('You can not throw this card!');
    console.clear();
    this.#turn();
  };

  #onTookCard = (player, card) => {
    this.#print(`${player.getName()} took ${card.toString()}`);
    this._game.nextTurn();
  };

  #onEndGame = () => {
    this.#print('Bye!');
    rl.close();
    exit();
  };

  #onError = (err) => {
    this.#print(err);
    this.#onEndGame();
    // TODO: error
  };

  #onPlayerWon = (player) => {
    console.clear();
    this.#print(`${player.getName()} won the game!`);
    this.#print('Game Over!');
    this.#print('Please enter "n" to start a new game or "q" to quit:');
    rl.question('', (answer) => {
      if (answer === 'n') {
        this.newGame();
      } else if (answer === 'q') {
        this._game.endGame();
      }
    });
  };

  #onPlayerLost = (game, player) => {
    // TODO: player lost
  };

  #onPlayerLeft = (game, player) => {
    // TODO: player left
  };

  #print = (message) => {
    console.log(message || this);
  };
}
