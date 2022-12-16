<template>
  <div v-if="handcard == true" class="card__container" id="card__{{ id }}" onclick="tryThrow({{ id }});">
    <div class="card__image new">
      <img class="grow" src="/assets/cards/{{color}}-{{value}}.png" />
    </div>
  </div>
  <div v-if="tablecard == true" class="card__container" id="card__{{ id }}" onclick="takeCard(this);">
    <div class="card__image {{ in }}">
      <img v-if="color" class="grow" src="/assets/cards/{{color}}-{{value}}.png" />
      <img v-else class="grow" src="/assets/cards/{{value}}.png" />
    </div>
  </div>
</template>

<script>
function showMessage(msg) {
  console.log(msg);
}
export default {
  name: 'cardComponent',
  props: ['color', 'value', 'id', 'handcard', 'tablecard', 'in', 'active'],
  methods: {
    tryThrow(id) {
      if (this.active === 'false') return;
      const ws = window.ws;
      const data = { throwCard: id };
      ws.send(JSON.stringify(data));
    },
    takeCard(obj) {
      if (this.active === 'false') return;
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
