import Vue from "vue";
import VueRouter from "vue-router";
// Page import
import Home from "../views/Home.vue";
import Register from "../views/Register.vue";
import Login from "../views/Login.vue";
import Overview from "../views/Overview.vue";
import VuePress from "../views/VuePress.vue";
import DashboardAdmin from "../views/DashboardAdmin.vue";
import store from "../store/index";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Overview,
  },
  {
    path: "/admin",
    name: "Admin",
    component: DashboardAdmin,
    beforeEnter: (to, from, next) => {
      store.getters["user/userData"].role === "admin" ? next() : next("/");
    },
  },
  {
    path: "/press",
    name: "VuePress",
    component: VuePress,
  },
];

const router = new VueRouter({
  mode: "history",
  linkActiveClass: "active-page",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, _, next) => {
  const protectedRoute = ["Dashboard", "VuePress", "Admin"];

  const offlineRoute = ["Login", "Register", "Home"];
  const routeName = to.name;
  const isLogged = !!window.localStorage.getItem("jwt-token");

  if (offlineRoute.includes(routeName) && !isLogged) next();
  else if (protectedRoute.includes(routeName) && isLogged) next();
  else if (offlineRoute.includes(routeName) && isLogged) {
    next("/dashboard");
  } else {
    next("/login");
  }
});

export default router;
