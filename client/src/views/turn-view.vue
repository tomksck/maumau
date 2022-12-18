<template>
  <h1>{{ message }}</h1>
  <h2 v-if="your_turn" class="turn__annotation">It's your turn!</h2>
  <h2 v-else class="turn__annotation">It's {{ player }}'s turn!</h2>

  <div v-if="!your_turn" class="turn__placeholder">
    <div class="container__show">
      <h2>Waiting for other players...</h2>
    </div>
    <div class="card__collection"></div>
  </div>
  <div class="turn__cards">
    <div class="table__cards">
      <CardComponent :value="tableCard.value" :color="tableCard.color" fly_in="in__left" id="tableCard" tablecard="true" />
      <CardComponent value="back" fly_in="in__right" id="takeCard" :active="takeCard.active" tablecard="true" />
    </div>
    <div class="card__collection">
      <ul>
        <li v-for="card in handCards" v-bind:key="card.id">
          <CardComponent
            v-bind:value="card.value"
            v-bind:color="card.color"
            v-bind:id="card.index"
            handcard="true"
            tablecard="false"
            v-bind:active="card.active"
            v-bind:fade="card.fade"
          />
        </li>
      </ul>
    </div>
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
      takeCard: { active: false },
      handCards: [],
      message: '',
      your_turn: false
    };
  },
  methods: {
    handleBeforeUnload(event) {
      // Display a confirmation message to the user
      event.preventDefault();
      return (event.returnValue = 'Do you really want to leave the game?');
    },
    addHandCard(card) {
      card.active = true;
      this.handCards.push(card);
    },
    removeHandCard(id) {
      this.handCards.at(id).fade = 'fade';
      setTimeout(() => {
        this.handCards.splice(id, 1);
        this.your_turn = false;
      }, 600);
    },
    setMessage(message) {
      this.message = message;
    },
    handleMessage(event) {
      const data = JSON.parse(event.data);
      console.log(data);
      if (data.your_turn != undefined) {
        this.your_turn = true;
        this.takeCard.active = true;
        this.handCards.forEach((card, index) => {
          card.active = true;
          card.index = index;
        });
      }
      if (data.active_player != undefined) {
        this.player = data.active_player;
      }
      if (data.table_card != undefined) {
        this.tableCard = data.table_card;
      }
      if (data.hand_cards != undefined) {
        const handCards = data.hand_cards;
        handCards.forEach((card) => {
          card.active = true;
          card.fade = '';
        });
        for (let i = this.handCards.length; i < handCards.length; i++) {
          this.addHandCard(handCards[i]);
        }
      }
      if (data.threw_card != undefined) {
        this.removeHandCard(data.threw_card);
        this.handCards.forEach((card) => {
          card.active = false;
        });
        this.takeCard.active = false;
      }
      if (data.error == 'invalid_card') {
        alert("You can't throw this card!");
      }
      if (data.error == 'invalid_turn') {
        alert("It's not your turn!");
      }
      if (data.took_card != undefined) {
        this.addHandCard(data.took_card);
      }
      if (data.player_won != undefined) {
        this.setMessage(data.player_won + ' won! Returning to lobby...');
        setTimeout(() => {
          this.$router.push('/game');
        }, 3000);
      }
    }
  },
  mounted() {
    window.addEventListener('beforeunload', this.handleBeforeUnload);
    if (this.$root.connection != null) {
      this.$root.connection.onmessage = function (event) {
        console.log(event);
        this.handleMessage(event);
      }.bind(this);
      this.$root.connection.onclose = function (event) {
        console.log(event);
        this.setMessage('Connection lost! Returning to lobby...');
        setTimeout(() => {
          this.$router.push('/game');
        }, 3000);
      }.bind(this);
    }
  },
  beforeUnmount() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  },
  components: { CardComponent }
};
</script>
