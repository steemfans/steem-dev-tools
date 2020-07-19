import Vue from 'vue';
import {
  Layout,
  Menu,
  Icon,
  Row,
  Col,
  Card,
  List,
} from 'ant-design-vue';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './i18n';

const components = [
  Layout,
  Menu,
  Icon,
  Layout.Sider,
  Layout.Content,
  Layout.Footer,
  Row,
  Col,
  Card,
  List,
  List.Item,
  List.Item.Meta,
];
components.map((component) => Vue.use(component));

Vue.config.productionTip = false;

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
