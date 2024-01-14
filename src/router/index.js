import { createRouter, createWebHistory } from "vue-router"
import Blog from "@/views/Blog.vue"
import Home from "@/views/Home.vue"
import App from "@/App.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/Blog",
      name: "Blog",
      component: Blog
    }
  ]
})

export default router
