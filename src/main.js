import Vue from 'vue';
import {
  Layout,
  Menu,
  Icon,
  Row,
  Col,
  Card,
} from 'ant-design-vue';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './i18n';

const { Sider, Content, Footer } = Layout;
const components = [
  Layout,
  Menu,
  Icon,
  Sider,
  Content,
  Footer,
  Row,
  Col,
  Card,
];
components.map((component) => Vue.use(component));

Vue.config.productionTip = false;

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
