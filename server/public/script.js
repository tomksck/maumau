function tryThrow(url) {
  $.get(url, function (data) {
    console.log(data);
    if (data.error) {
      alert('Cannot Throw this card');
    } else {
      fade(url);
    }
  });
}

function fade(url) {
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
      window.location.href = location.href;
    }, 500);
  }, 500);
}
