import { createRouter, createWebHistory } from 'vue-router';
import index from '../views/index-view.vue';
import game from '../views/game-view.vue';
import turn from '../views/turn-view.vue';
import connection from '../views/connection-lost.vue';

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
  },
  {
    path: '/turn',
    name: 'turn',
    component: turn
  },
  {
    path: '/connection',
    name: 'connection',
    component: connection
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
