import { createRouter, createWebHistory } from 'vue-router';
import index from '../views/index-view.vue';
import game from '../views/game-view.vue';

const routes = [
  {
    path: '/',
    name: 'index',
    component: index
  },
  {
    path: '/game',
    name: 'game',
    component: game
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
