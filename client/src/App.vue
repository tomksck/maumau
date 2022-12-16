<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
  components: {},
  data: () => {
    return {
      connection: null
    };
  },
  created: function () {
    console.log('Starting connection to WebSocket Server');
    this.connection = new WebSocket('ws://localhost:6969/ws');

    this.connection.onopen = function (event) {
      console.log(event);
      console.log('Successfully connected to the echo websocket server...');
    };
  }
};
</script>
