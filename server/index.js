import express from 'express';
import nunjucks from 'nunjucks';
import bodyParser from 'body-parser';
import GameController from './src/controllers/game_controller.js';
import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import path from 'path';

const PORT = process.env.PORT || 6969;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/assets', express.static(path.resolve() + '/server/public'));

var game = new GameController();
const connections = [];

const server = http.createServer(app).listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
const wss = new WebSocketServer({ server, path: '/ws', perMessageDeflate: false });

wss.on('connection', function connection(ws) {
  if (connections.length >= 4) {
    ws.send('Game is full');
    ws.close();
    return;
  }
  console.log('Connection opened!');
  for (let conn of connections) {
    const data = { list_player: 'Player ' + (connections.length + 1) };
    conn.send(JSON.stringify(data));
  }
  ws.on('message', function incoming(data) {
    console.log('Received: %s', data);
    handleMessage(this, data);
  });
  ws.on('close', function close() {
    connections.splice(connections.indexOf(ws), 1);
    console.log('Connection closed!');
  });
  connections.push(ws);
  let player = 'Player ' + connections.length;
  for (let i = 1; i < connections.length + 1; i++) {
    const data = { list_player: 'Player ' + (i - 1) };
    ws.send(JSON.stringify(data));
  }
  const data = { player: player };
  ws.send(JSON.stringify(data));
});

nunjucks.configure('server/views', {
  autoescape: true,
  express: app
});

app.get('/', async (req, res) => {
  game.removeAllListeners();
  const data = { title: 'MauMau', message: 'Welcome to MauMau!', layout: 'layout.njk', url: '/game' };
  res.render('index.njk', data);
});

function handleMessage(ws, data) {
  console.log('Received: %s', data);
  data = JSON.parse(data);
  if (data.startGame) {
    startGame();
  }
}

function startGame() {
  game.once('newGame', () => {
    console.log('New Game');
    turn();
  });
  game.newGame(connections.length);
}

function turn() {
  game.once('newTurn', () => {
    console.log('Turn');
    const gameData = JSON.stringify({
      not_your_turn: nunjucks.render('turn.njk', {
        layout: 'layout.njk',
        message: 'Throw a Card!',
        player: game.getPlayerName(),
        tableCard: { value: game.getTableCard().getValue(), color: game.getTableCard().getCssClass() }
      })
    });
    for (let conn of connections) {
      conn.send(gameData);
    }
    const handCards = game.getPlayerCards().map((card, index) => {
      return { value: card.getValue(), color: card.getCssClass(), index, fade: true };
    });
    console.log(handCards);
    const cards = handCards.map((card) => {
      return nunjucks.render('single_card.njk', card);
    });
    console.log(cards);
    const data = JSON.stringify({
      your_turn: cards,
      player: 'Your Turn!'
    });
    connections[game.getPlayerId()].send(data);
  });
  game.nextTurn();
}

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

app.get('/game', async (req, res) => {
  if (game == null) {
    res.redirect('/');
    return;
  }
  const data = {
    layout: 'layout.njk',
    url: '/game/turn'
  };
  res.render('game.njk', data);
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
