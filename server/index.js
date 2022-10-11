import express from 'express';
import bodyParser from 'body-parser';
import GameController from './src/controllers/game_controller.js';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const game = new GameController();

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);

  app.get('/', (req, res) => {
    res.send('Welcome to MauMau!');
  });

  app.get('/game', (req, res) => {
    game.on('newGame', () => {
      res.send('New game started!Players:' + game.getPlayerNames().join(', ') + '<br>Press enter when ready...' + '<br><a href="/game/turn">Next Turn</a>');
    });
    game.newGame(2);
  });

  app.get('/game/turn', (req, res) => {
    game.on('newTurn', () => {
      res.send("It's " + game.getPlayerName() + "'s turn!" + '<br>Press enter when ready...<br><a href="/game/turn/throw">Ready</a>');
    });
    game.nextTurn();
  });

  app.get('/game/turn/throw', (req, res) => {
    res.send(
      'Table Card:' +
        game.getTableCard().toString() +
        '<br>Your Cards:' +
        game
          .getPlayerCards()
          .map((card, index) => {
            return '<br><a href=/game/turn/throw/' + index + '>' + card.toString() + '</a>';
          })
          .join('') +
        '<br><a href="/game/turn/take">Take</a>' +
        '<br>Please select the card to throw or take a card.'
    );
  });

  app.get('/game/turn/throw/:card', (req, res) => {
    game.on('threwCard', (player, card) => {
      res.send(player.getName() + ' threw ' + card.toString() + '<br><a href="/game/turn">Next Turn</a>');
    });
    game.on('cardNotThrown', () => {
      res.send('Card not thrown! Please try again. <br><a href="/game/turn/throw">Back</a>');
    });
    game.on('playerWon', (player) => {
      res.send(player.getName() + ' won! <br><a href="/game">New Game</a>');
    });
    game.throwCard(parseInt(req.params.card));
  });

  app.get('/game/turn/take', (req, res) => {
    game.on('tookCard', (player, card) => {
      res.send(player.getName() + ' took ' + card.toString() + '<br><a href="/game/turn">Next Turn</a>');
    });
    game.takeCard();
  });

  app.get('/game/:playerCount', (req, res) => {
    const game = new GameController();
    game.on('newGame', () => {
      res.send('New game started!');
    });
    game.newGame(parseInt(req.params.playerCount));
  });
});
