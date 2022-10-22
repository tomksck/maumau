import express from 'express';
import nunjucks from 'nunjucks';
import bodyParser from 'body-parser';
import GameController from './src/controllers/game_controller.js';
import path from 'path';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/assets', express.static(path.resolve() + '/server/public'));

nunjucks.configure('server/views', {
  autoescape: true,
  express: app
});

var game = new GameController();

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});

app.get('/', async (req, res) => {
  game.removeAllListeners();
  const data = { title: 'MauMau', message: 'Welcome to MauMau!', layout: 'layout.njk', url: '/game' };
  res.render('index.njk', data);
});

app.get('/game', async (req, res) => {
  if (game == null) {
    res.redirect('/');
    return;
  }
  game.removeAllListeners();
  game.once('newGame', () => {
    const data = {
      players: game.getPlayerNames(),
      layout: 'layout.njk',
      url: '/game/turn'
    };
    res.render('game.njk', data);
  });
  game.newGame(2);
});

app.get('/game/turn', async (req, res) => {
  if (!game.isRunning()) {
    res.redirect('/');
    return;
  }
  game.removeAllListeners();
  game.once('newTurn', () => {
    const data = {
      layout: 'layout.njk',
      message: 'New turn started!',
      player: game.getPlayerName(),
      url: '/game/turn/throw',
      showCards: false,
      text: 'Show Cards'
    };
    res.render('turn.njk', data);
  });
  game.nextTurn();
});

app.get('/game/turn/throw', async (req, res) => {
  if (!game.isRunning()) {
    res.redirect('/');
    return;
  }
  game.removeAllListeners();
  const data = {
    player: game.getPlayerName(),
    message: 'Please throw a card or Take one',
    layout: 'layout.njk',
    showCards: true,
    tableCard: { value: game.getTableCard().getValue(), color: game.getTableCard().getCssClass() },
    cardUrl: '/game/turn/throw/',
    cards: game.getPlayerCards().map((card, index) => {
      return { value: card.getValue(), color: card.getCssClass() };
    }),
    url: '/game/turn/take'
  };
  res.render('turn.njk', data);
});

app.get('/game/turn/throw/:card', async (req, res) => {
  if (!game.isRunning()) {
    res.redirect('/');
    return;
  }
  game.removeAllListeners();
  game.once('threwCard', (player, card) => {
    res.redirect('/game/turn');
  });
  game.once('cardNotThrown', () => {
    const data = {
      player: game.getPlayerName(),
      layout: 'layout.njk',
      showCards: false,
      message: 'Card not thrown!',
      url: '/game/turn/throw',
      text: 'Retry'
    };
    res.render('turn.njk', data);
  });
  game.once('playerWon', (player) => {
    res.send(player.getName() + ' won! <br><a href="/game">New Game</a>');
  });
  game.throwCard(parseInt(req.params.card));
});

app.get('/game/turn/take', async (req, res) => {
  if (!game.isRunning()) {
    res.redirect('/');
    return;
  }
  game.removeAllListeners();
  game.once('tookCard', (player, card) => {
    res.redirect('back');
  });
  game.takeCard();
});

app.get('/game/:playerCount', async (req, res) => {
  game.removeAllListeners();
  game.once('newGame', () => {
    res.send('New game started!');
  });
  game.newGame(parseInt(req.params.playerCount));
});
