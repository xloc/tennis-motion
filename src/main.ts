import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createWebHashHistory, createRouter } from 'vue-router'
import HomePage from './components/HomePage.vue'


const routes = [
  { path: '/:catchAll(.*)', component: HomePage },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

createApp(App).use(router).mount('#app')
