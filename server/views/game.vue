<script>
export default {
  data() {
    return {
      players: [],
      player: ''
    };
  },
  methods: {
    startGame() {
      this.$socket.emit('startGame');
    }
  },
  mounted() {
    this.$socket.emit('getPlayers');
    this.$socket.on('players', (players) => {
      this.players = players;
    });
    this.$socket.on('player', (player) => {
      this.player = player;
    });
  }
};
</script>

<template>
  <h1>Lobby</h1>
  <h2>Waiting for players</h2>
  <h2>{{ player }}</h2>

  <div class="d-flex align-items-center justify-content-center">
    <div class="spinner eclipse"></div>
  </div>
  <div>
    <ul>
      <li v-for="player in players" :key="player.id">{{ player.name }}</li>
    </ul>
  </div>
  <button @click="startGame()">Start Game</button>
</template>
