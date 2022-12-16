import Vue from 'vue';
import App from './App.vue';
import VueNativeSock from 'vue-native-websocket';

Vue.use(VueNativeSock, 'ws://localhost:6969/ws');

new Vue({
  el: '#vapp',
  name: 'App',
  render: (h) => h(App)
});
