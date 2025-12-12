<template>
  <header class="px-4 pb-0 mt-1 w-full leading-6 text-black sm:px-6 bg-white shadow-sm sticky top-0 z-50">
    <div class="w-full mx-auto h-16 md:h-12 flex items-center px-4 sm:px-3 justify-between max-w-7xl">
      <div class="flex items-center">
        <router-link to="/" class="flex items-center text-2xl font-extralight tracking-tight leading-8 text-black cursor-pointer font-medium">
          <img src="/favicon.ico" alt="Logo" class="w-6 mr-2" />
          <span class="hidden sm:inline">Bulk Rename Utility</span>
          <span class="sm:hidden">BRU</span>
        </router-link>
      </div>

      <nav class="hidden md:flex items-center gap-x-6">
        <router-link to="/" class="text-gray-600 hover:text-black font-medium transition-colors" active-class="text-black font-bold">Home</router-link>
        <router-link to="/batch-rename" class="text-gray-600 hover:text-black font-medium transition-colors" active-class="text-black font-bold">Batch Rename</router-link>
        <router-link to="/file-organizer" class="text-gray-600 hover:text-black font-medium transition-colors" active-class="text-black font-bold">File Organizer</router-link>
        <router-link to="/photo-renamer" class="text-gray-600 hover:text-black font-medium transition-colors" active-class="text-black font-bold">Photo Renamer</router-link>
      </nav>

      <!-- Mobile Menu Button -->
      <div class="md:hidden">
        <button @click="isMenuOpen = !isMenuOpen" class="text-gray-600 hover:text-black focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      <a
        href="https://github.com/XXXiaofeng/BulkRenameUtility"
        target="_blank"
        class="hidden md:flex mx-3 max-w-[30px] flex-col items-center justify-center text-gray-600 hover:text-black"
        title="View on GitHub"
      >
        <svg
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          viewBox="0 0 16 16"
          class="text-lg"
          height="1.2em"
          width="1.2em"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
      </a>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isMenuOpen" class="md:hidden bg-white border-t border-gray-100 py-2">
      <div class="flex flex-col space-y-2 px-4">
        <router-link to="/" class="text-gray-600 hover:text-black py-2" @click="isMenuOpen = false">Home</router-link>
        <router-link to="/batch-rename" class="text-gray-600 hover:text-black py-2" @click="isMenuOpen = false">Batch Rename</router-link>
        <router-link to="/file-organizer" class="text-gray-600 hover:text-black py-2" @click="isMenuOpen = false">File Organizer</router-link>
        <router-link to="/photo-renamer" class="text-gray-600 hover:text-black py-2" @click="isMenuOpen = false">Photo Renamer</router-link>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isMenuOpen = ref(false)
</script>

<style scoped>
/* Add any specific styles if needed, mostly using Tailwind */
</style>
