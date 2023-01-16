<template>
  <div class="center alert">
    <h1 class="error">Connection Lost</h1>
    <p>It seems like you, or the server are offline, hang tight while we try to reconnect.</p>
  </div>
</template>

<script>
export default {
  name: 'connectionLost',
  methods: {
    reconnect() {
      this.$root.connection = new WebSocket('ws://localhost:6969/ws');
      this.$root.connection.onopen = function () {
        this.$router.push('/game');
      }.bind(this);
      this.$root.connection.onclose = function () {
        setTimeout(this.reconnect(), 1000);
      }.bind(this);
    }
  },
  mounted() {
    this.reconnect().bind(this);
  }
};
</script>
