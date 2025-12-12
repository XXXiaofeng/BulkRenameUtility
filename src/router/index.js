import { createRouter, createWebHistory } from "vue-router"
import Home from "@/views/Home.vue"
import App from "@/App.vue"

// Lazy load pages for better performance
const BatchRenamePage = () => import("@/views/BatchRenamePage.vue")
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
      path: "/batch-rename",
      name: "BatchRename",
      component: BatchRenamePage
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
    }
  ],
  scrollBehavior() {
    // Always scroll to top when navigating
    return { top: 0 }
  }
})

export default router
