function tryThrow(url) {
  $.get(url, function (data) {
    console.log(data);
    if (data.error) {
      alert('Cannot Throw this card');
    } else {
      fade(url, data);
    }
  });
}

function takeCard(url) {
  $.get(url, function (data) {
    const cards = document.getElementById('handCards');
    const entry = document.createElement('li');
    entry.innerHTML = data;
    console.log(entry);
    cards.appendChild(entry);
  });
}

function showCards(url) {
  $.get(url, function (data) {
    document.body.innerHTML = data;
  });
}

function startGame(url) {
  $.get(url, function (data) {
    document.body.innerHTML = data;
  });
}

function fade(url, data) {
  var element = document.getElementById('card__' + url);
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

    setTimeout(function () {
      document.body.innerHTML = data;
    }, 500);
  }, 500);
}
