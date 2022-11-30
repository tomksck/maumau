import express from 'express';
import nunjucks from 'nunjucks';
import bodyParser from 'body-parser';
import GameController from './src/controllers/game_controller.js';
import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import path from 'path';
import { match } from 'assert';

const PORT = process.env.PORT || 6969;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/assets', express.static(path.resolve() + '/server/public'));

var game = new GameController();

game.on('threwCard', (player, card) => {
  console.log('Threw Card');
  const data = {
    threw_card: card
  };
  connections[player].send(JSON.stringify(data));
  setTimeout(() => {
    turn();
  }, 600);
});
game.on('cardNotThrown', () => {
  const data = {
    error: 'Retry'
  };
  connections[game.getPlayerId()].send(JSON.stringify(data));
});
game.on('playerWon', (player) => {});

const connections = [];

const server = http.createServer(app).listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
const wss = new WebSocketServer({ server, path: '/ws', perMessageDeflate: false });

function broadcast(data, exclude) {
  data = typeof data === 'string' ? data : JSON.stringify(data);
  for (let conn of connections) {
    if (conn !== exclude) conn.send(data);
  }
}

wss.on('connection', function connection(ws) {
  if (connections.length >= 4) {
    ws.send('Game is full');
    ws.close();
    return;
  }
  console.log('Connection opened!');
  broadcast({ list_player: 'Player ' + (connections.length + 1) });
  ws.on('message', function incoming(data) {
    handleMessage(this, data);
  });
  ws.on('close', function close() {
    const index = connections.indexOf(ws);
    connections.splice(connections.indexOf(ws), 1);
    broadcast({ remove_list_player: index });
    console.log('Connection closed!');
  });
  connections.push(ws);
  let player = 'Player ' + connections.length;
  for (let i = 1; i < connections.length + 1; i++) {
    const data = { list_player: 'Player ' + i };
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
  const data = { title: 'MauMau', message: 'Welcome to MauMau!', layout: 'layout.njk', url: '/game' };
  res.render('index.njk', data);
});

function handleMessage(ws, data) {
  console.log('Received: %s', data);
  data = JSON.parse(data);
  if (data.startGame !== undefined) {
    if (connections.length < 2) {
      return;
    }
    startGame();
  }
  if (data.throwCard !== undefined) {
    console.log('Throw Card');
    console.log(data.throwCard);
    game.throwCard(data.throwCard);
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
    let ws = connections[game.getPlayerId()];
    const gameData = JSON.stringify({
      not_your_turn: nunjucks.render('turn.njk', {
        layout: 'layout.njk',
        message: 'Throw a Card!',
        player: game.getPlayerName(),
        tableCard: { value: game.getTableCard().getValue(), color: game.getTableCard().getCssClass() }
      })
    });
    broadcast(gameData);
    const handCards = game.getPlayerCards().map((card, index) => {
      return { value: card.getValue(), color: card.getCssClass(), index, fade: true };
    });
    const cards = handCards.map((card) => {
      return nunjucks.render('single_card.njk', card);
    });
    const data = JSON.stringify({
      your_turn: cards,
      player: 'Your Turn!'
    });
    ws.send(data);
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
