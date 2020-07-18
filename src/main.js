import Vue from 'vue';
import {
  Layout,
  Menu,
  Icon,
} from 'ant-design-vue';
import App from './App.vue';
import router from './router';
import store from './store';

const { Sider, Content, Footer } = Layout;
const components = [
  Layout,
  Menu,
  Icon,
  Sider,
  Content,
  Footer,
];

components.map((component) => Vue.use(component));

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
