<template>
  <h1>{{ message }}</h1>
  <h2 class="turn__annotation">It's {{ player }}'s turn!</h2>
  <div class="turn__cards d-none">
    <div class="table__cards">
      <CardComponent value="{{tableCard.value}}" color="{{tableCard.color}}" in="in__left" id="tableCard" tablecard="true" }) />
      <CardComponent value="back" in="in__right" id="takeCard" active="{{ your_turn }}" tablecard="true" />
    </div>
    <div class="card__collection">
      <CardComponent
        v-for="card in handCards"
        v-bind:key="card.id"
        value="{{card.value}}"
        color="{{card.color}}"
        id="{{card.id}}"
        handcard="true"
        active="{{ card.active }}"
      />
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
import CardComponent from './components/card-component.vue';

export default {
  name: 'turnView',
  data() {
    return {
      player: '',
      tableCard: {},
      handCards: [],
      message: '',
      your_turn: false
    };
  },
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
    },
    handleMessage(event) {
      const data = JSON.parse(event);
      console.log(data);
      if (data.your_turn != undefined) {
        this.your_turn = true;
      }
    }
  },
  mounted() {
    if (this.$root.connection == null) {
      return;
    }
    this.$root.connection.onmessage = function (event) {
      console.log(event);
      this.handleMessage(event);
    }.bind(this);
  },
  components: { CardComponent }
};
</script>
