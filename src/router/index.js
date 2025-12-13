import { createRouter, createWebHistory } from "vue-router"
import Home from "@/views/Home.vue"
import App from "@/App.vue"

// Lazy load pages for better performance
// BatchRename logic moved to Home.vue
const PhotoRenamerPage = () => import("@/views/PhotoRenamerPage.vue")
const FileOrganizerPage = () => import("@/views/FileOrganizerPage.vue")
const DuplicateFinderPage = () => import("@/views/DuplicateFinderPage.vue")
const FileCleanerPage = () => import("@/views/FileCleanerPage.vue")

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/photo-renamer",
      name: "PhotoRenamer",
      component: PhotoRenamerPage
    },
    {
      path: "/file-organizer",
      name: "FileOrganizer",
      component: FileOrganizerPage
    },
    {
      path: "/duplicate-finder",
      name: "DuplicateFinder",
      component: DuplicateFinderPage
    },
    {
      path: "/file-cleaner",
      name: "FileCleaner",
      component: FileCleanerPage
    },
    {
      path: "/blog",
      name: "BlogList",
      component: () => import("@/views/BlogList.vue")
    },
    {
      path: "/blog/:slug",
      name: "BlogPost",
      component: () => import("@/views/BlogPost.vue")
    },
    {
      path: "/privacy",
      name: "Privacy",
      component: () => import("@/views/PrivacyPage.vue")
    },
    {
      path: "/contact",
      name: "Contact",
      component: () => import("@/views/ContactPage.vue")
    }
  ],
  scrollBehavior() {
    // Always scroll to top when navigating
    return { top: 0 }
  }
})

export default router
