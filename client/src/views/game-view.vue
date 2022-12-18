<template>
  <h1>Lobby</h1>
  <h2>Waiting for players</h2>
  <h2>{{ player }}</h2>

  <div class="d-flex align-items-center justify-content-center">
    <div class="spinner eclipse"></div>
  </div>
  <div>
    <ul>
      <li v-for="player in players" :key="player.id">{{ player }}</li>
    </ul>
  </div>
  <button @click="startGame()">Start Game</button>
</template>

<script>
export default {
  name: 'gameView',
  data() {
    return {
      players: [],
      player: ''
    };
  },
  methods: {
    startGame() {
      this.$root.connection.send('{"startGame":true}');
    },
    handleMessage(event) {
      const data = JSON.parse(event.data);
      console.log(data);
      if (data.list_player !== undefined) {
        this.players.push(data.list_player);
      }
      if (data.player !== undefined) {
        this.player = data.player;
      }
      if (data.start_game !== undefined) {
        this.$router.push('/turn');
      }
    }
  },
  mounted() {
    this.$root.connection = new WebSocket('ws://localhost:6969/ws');
    this.$root.connection.onmessage = function (event) {
      console.log(event);
      this.handleMessage(event);
    }.bind(this);
    this.$root.connection.onopen = function (event) {
      console.log(event);
      console.log('Successfully connected to the echo websocket server...');
    };
    this.$root.connection.onclose = function () {
      console.log('Connection closed');
      this.$router.push('/');
    };
  }
};
</script>
