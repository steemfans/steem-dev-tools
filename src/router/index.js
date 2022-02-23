import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';
import BlockRewardProps from '@/views/BlockRewardProps.vue';
import DiscountAccountProps from '@/views/DiscountAccountProps.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/block_reward_props',
    name: 'BlockRewardProps',
    component: BlockRewardProps,
  },
  {
    path: '/discount_account_props',
    name: 'DiscountAccountProps',
    component: DiscountAccountProps,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
