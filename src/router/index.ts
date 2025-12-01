import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/auth",
    name: "auth",
    component: () =>
      import(/* webpackChunkName: "auth" */ "../views/AuthenticationView.vue"),
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Dev helper: if you open the app with `?showAuth=true` the first navigation
// will redirect once to the auth page so you can test the login screen during
// development without forcing it for all users.
try {
  const showAuth =
    new URL(window.location.href).searchParams.get("showAuth") === "true";
  if (showAuth) {
    router.beforeEach((to, from, next) => {
      try {
        const alreadyShown = localStorage.getItem("devAuthShown");
        if (!alreadyShown) {
          localStorage.setItem("devAuthShown", "true");
          if (to.name !== "auth") return next({ name: "auth" });
        }
      } catch (e) {
        // ignore storage errors in some environments
      }
      next();
    });
  }
} catch (e) {
  // ignore URL parsing errors in odd environments
}

export default router;
