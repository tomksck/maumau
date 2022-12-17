<template>
  <div v-if="handcard" :class="`card__container ${fade}`" :id="card__id" @click="tryThrow(id)">
    <div class="card__image new">
      <img class="grow" :src="imageUrl" />
    </div>
  </div>
  <div v-else class="card__container" :id="`card__${id}`" @click="takeCard(this)">
    <div :class="`card__image ${fly_in}`">
      <img class="grow" :src="imageUrl" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardComponent',
  props: ['color', 'value', 'id', 'handcard', 'tablecard', 'fly_in', 'active', 'fade'],
  computed: {
    imageUrl: function () {
      return this.color ? `/assets/cards/${this.color}-${this.value}.png` : '/assets/cards/back.png';
    },
    card__id: function () {
      return `card__${this.id}`;
    }
  },
  methods: {
    tryThrow(id) {
      if (!this.active) return;
      this.$root.connection.send(JSON.stringify({ tryThrow: id }));
    },
    takeCard() {
      if (!this.active) return;
      this.$root.connection.send(JSON.stringify({ takeCard: true }));
    }
  }
};
</script>
