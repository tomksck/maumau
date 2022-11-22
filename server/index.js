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

app.post('/game', async (req, res) => {
  const data = {
    playerCount: parseInt(req.body.playerCount),
    layout: 'layout.njk',
    url: '/game/turn'
  };
  res.render('game.njk', data);
});

app.post('/game/players', async (req, res) => {
  game = new GameController();
  let tmp = 0;
  let player;
  const players = [];
  while ((player = req.body[`player${tmp}`]) != null) {
    players.push(player);
    tmp++;
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
  game.newGame(tmp, players);
});

app.get('/game/turn', async (req, res) => {
  if (!game.isRunning()) {
    res.redirect('/');
    return;
  }
  game.removeAllListeners();
  game.once('newTurn', () => {
    console.log(game.getPlayerName());
    const data = {
      message: 'New turn started!',
      player: game.getPlayerName(),
      url: '/game/turn/throw',
      showCards: false
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
      error: 'Retry'
    };
    res.send(data);
  });
  game.once('playerWon', (player) => {
    res.send('<div class="center"><h1>' + player.getName() + ' won!</h1> <br><button onclick="window.location.href=\'/\'">Back to start</button></div>');
  });
  console.log('throwing ' + parseInt(req.params.card));
  console.log(game.getTableCard());
  game.throwCard(parseInt(req.params.card));
});

app.get('/game/turn/take', async (req, res) => {
  if (!game.isRunning()) {
    res.redirect('/');
    return;
  }
  game.removeAllListeners();
  game.once('tookCard', (player, card) => {
    const data = {
      value: card.getValue(),
      color: card.getCssClass(),
      fade: true,
      url: '/game/turn/throw/' + player.getCards().indexOf(card)
    };
    res.render('single_card.njk', data);
  });
  game.takeCard();
});

app.use(function (req, res, next) {
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('040.njk', { layout: 'layout.njk' });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.json({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});
