import express from 'express';
import bodyParser from 'body-parser';
import GameController from './src/controllers/game_controller.js';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);

  app.get('/', (req, res) => {
    res.send('Welcome to MauMau!');
  });

  app.get('/game', (req, res) => {
    const game = new GameController();
    game.on('newGame', () => {
      res.send('New game started!Players:' + game.getPlayerNames().join(', '));
      game.nextTurn();
    });
    game.on('newTurn', () => {
      res.send(`It's ${game.getPlayerName()}'s turn!`);
    });
    game.newGame(2);
  });

  app.get('/game/:playerCount', (req, res) => {
    const game = new GameController();
    game.on('newGame', () => {
      res.send('New game started!');
    });
    game.newGame(parseInt(req.params.playerCount));
  });
});
