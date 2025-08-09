import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/',
    redirect: '/login'
  },
  // hier z. B. Dashboard später hinzufügen
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
