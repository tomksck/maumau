<template>
  <h1>{{ message }}</h1>
  <h2 class="turn__annotation">It's {{ player }}'s turn!</h2>
  <div class="turn__cards d-none">
    <div class="table__cards">
      <card value="{{tableCard.value}}" color="{{tableCard.color}}" in="in__left" id="tableCard" }) />
      <card value="back" in="in__right" id="takeCard" />
    </div>
    <div class="card__collection">
      <card v-for="card in handCards" value="{{card.value}}" color="{{card.color}}" id="{{card.id}}" handcard="true" />
    </div>
  </div>
  <div class="turn__placeholder">
    <div class="container__show">
      <h2>Waiting for other players...</h2>
    </div>
    <div class="card__collection"></div>
  </div>
</template>

<script>
import card from './components/card.vue';

export default {
  name: 'turnView',
  props: ['player', 'tableCard', 'handCards', 'message'],
  methods: {
    addHandCard(card) {
      const handCards = this.handCards;
      handCards.push(card);
      this.handCards = handCards;
    },
    removeHandCard(id) {
      const handCards = this.handCards;
      const index = handCards.findIndex((card) => card.id === id);
      handCards.splice(index, 1);
      this.handCards = handCards;
    },
    setTableCard(card) {
      this.tableCard = card;
    },
    setMessage(message) {
      this.message = message;
    }
  },
  components: { card }
};
</script>
