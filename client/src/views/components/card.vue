<template>
  <div v-if="handcard" class="card__container" id="card__{{ id }}" onclick="tryThrow({{ id }});">
    <div class="card__image new">
      <img class="grow" src="/assets/cards/{{color}}-{{value}}.png" />
    </div>
  </div>
  <div v-if="tablecard" class="card__container" id="card__{{ id }}" onclick="takeCard(this);">
    <div class="card__image {{ in }}">
      <img v-if="color" class="grow" src="/assets/cards/{{color}}-{{value}}.png" />
      <img v-else class="grow" src="/assets/cards/{{value}}.png" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'card',
  props: ['color', 'value', 'id', 'handcard', 'tablecard', 'in'],
  methods: {
    tryThrow(id) {
      const ws = window.ws;
      const data = { throwCard: id };
      ws.send(JSON.stringify(data));
    },
    takeCard(obj) {
      if (obj.classList.contains('disabled')) return;
      let ws = window.ws;
      if (!ws) {
        showMessage('No WebSocket connection :(');
        return;
      }
      const data = { takeCard: true };
      ws.send(JSON.stringify(data));
    }
  }
};
</script>
