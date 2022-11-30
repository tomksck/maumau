(function () {
  if (window.location.pathname !== '/game') return;

  function handleData(data) {
    data = JSON.parse(data);
    console.log(data);
    if (data.error) {
      alert('Cannot Throw this card');
      return;
    }
    if (data.newGame) {
      let fullDoc = document.createElement('html');
      fullDoc.innerHTML = data.newGame;
      document.body.innerHTML = fullDoc.querySelector('body').innerHTML;
      return;
    }
    if (data.not_your_turn) {
      let fullDoc = document.createElement('html');
      fullDoc.innerHTML = data.not_your_turn;
      document.body.innerHTML = fullDoc.querySelector('body').innerHTML;
      document.querySelector('.turn__cards').classList.remove('d-none');
      document.querySelectorAll('.table__cards .card__container').forEach((item) => (item.disabled = true));
      return;
    }

    if (data.your_turn) {
      let cards = data.your_turn;
      let handCards = document.getElementById('handCards');
      for (let card of cards) {
        const cardContainer = document.createElement('li');
        cardContainer.innerHTML = card;
        handCards.appendChild(cardContainer);
      }
      document.querySelector('.turn__placeholder').classList.add('d-none');
      document.querySelector('.turn__cards').classList.remove('d-none');
      return;
    }

    if (data.cards) {
      const cards = document.getElementById('handCards');
      cards.innerHTML = '';
      for (const card of data.cards) {
        const entry = document.createElement('li');
        entry.innerHTML = card;
        cards.appendChild(entry);
      }
      return;
    }

    if (data.threw_card) {
      fade(data.threw_card);
      return;
    }

    if (data.takeCard) {
      const card = data.takeCard;
      const cards = document.getElementById('handCards');
      const entry = document.createElement('li');
      entry.innerHTML = card;
      console.log(entry);
      cards.appendChild(entry);
      return;
    }

    if (data.tableCard) {
      const tableCards = document.querySelectorAll('.table__cards .card__container');

      tableCards[0].querySelector('.card__image').classList.remove('out__left');
      tableCards[1].querySelector('.card__image').classList.remove('out__right');
      tableCards[0].querySelector('.card__image').classList.add('in__left');
      tableCards[1].querySelector('.card__image').classList.add('in__right');

      tableCards[0].querySelector('.card__image').classList.add(data.tableCard.color);
      tableCards[1].querySelector('.card__image').classList.add(data.tableCard.color);
      tableCards[0].querySelector('.card__image').innerHTML = data.tableCard.value;
      tableCards[1].querySelector('.card__image').innerHTML = data.tableCard.value;
      return;
    }

    if (data.player) {
      const player = document.querySelector('.player');
      player.innerHTML = 'Welcome ' + data.player;
      return;
    }

    if (data.list_player) {
      const players = document.querySelector('.players ul');
      const player = document.createElement('li');
      player.innerHTML = data.list_player;
      players.appendChild(player);
      return;
    }

    if (data.remove_list_player) {
      let index = data.remove_list_player;
      const players = document.querySelector('.players ul');
      players.removeChild(players.childNodes[index]);
      return;
    }
  }

  function init() {
    let ws = window.ws;
    if (ws) return;

    ws = new WebSocket('ws://localhost:6969/ws');
    ws.onopen = () => {
      console.log('Connection opened!');
    };
    ws.onmessage = ({ data }) => handleData(data);
    ws.onclose = function () {
      ws = null;
    };
    window.ws = ws;
  }

  wee = function () {
    let ws = window.ws;
    if (!ws) {
      showMessage('No WebSocket connection :(');
      return;
    }
    ws.send("Hello, server! I'm a client!");
  };

  init();
})();

function startGame() {
  let ws = window.ws;
  if (!ws) {
    showMessage('No WebSocket connection :(');
    return;
  }
  const data = { startGame: true };
  ws.send(JSON.stringify(data));
}

function tryThrow(id) {
  let ws = window.ws;
  if (!ws) {
    showMessage('No WebSocket connection :(');
    return;
  }
  const data = { throwCard: id };
  ws.send(JSON.stringify(data));
}

function takeCard() {
  let ws = window.ws;
  if (!ws) {
    showMessage('No WebSocket connection :(');
    return;
  }
  const data = { takeCard: true };
  ws.send(JSON.stringify(data));
}

function showCards(url) {
  $.get(url, function (data) {
    document.body.innerHTML = data;
  });
}

function fade(id) {
  const element = document.getElementById('card__' + id);
  console.log(element);
  element.classList.add('fade');
  setTimeout(function () {
    const tableCards = document.querySelectorAll('.table__cards .card__container');

    tableCards[0].querySelector('.card__image').classList.remove('in__left');
    tableCards[1].querySelector('.card__image').classList.remove('in__right');
    tableCards[0].querySelector('.card__image').classList.add('out__left');
    tableCards[1].querySelector('.card__image').classList.add('out__right');

    const boxes = document.querySelectorAll('.card__collection ul li .card__container .card__image');

    for (const box of boxes) {
      box.classList.add('out');
    }
  }, 500);
}
