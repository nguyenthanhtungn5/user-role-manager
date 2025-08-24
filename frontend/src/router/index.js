import { createRouter, createWebHistory } from "vue-router";

// Lazy-loaded Views (erstmal Platzhalter; Inhalte wie in deinen Tabs)
const Users = () => import("../views/UsersView.vue");
const Roles = () => import("../views/RolesView.vue");
//const Permissions = () => import("../views/PermissionsView.vue");
//const Assignments = () => import("../views/AssignmentsView.vue");

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/users" },
    { path: "/users", name: "users", component: Users },
    { path: "/roles", name: "roles", component: Roles },
    //{ path: "/permissions", name: "permissions", component: Permissions },
    // { path: "/assignments", name: "assignments", component: Assignments },
  ],
});
