import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import interceptorsSetup from "./helpers/interceptors";
import Toast from "vue-toastification";
import ElementUI from "element-ui";
import VueApexCharts from "vue-apexcharts";
import VueSweetalert2 from 'vue-sweetalert2';
// Import the CSS or use your own!
import "element-ui/lib/theme-chalk/index.css";
import "vue-toastification/dist/index.css";
import "./assets/index.scss";
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.config.productionTip = false;

Vue.use(Toast);
Vue.use(ElementUI);
Vue.use(VueApexCharts);
Vue.component("apexchart", VueApexCharts);
Vue.use(VueSweetalert2);

interceptorsSetup();

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
