<template>
  <div class="flex flex-col justify-center py-0 px-4 mx-auto leading-6 text-black">
    <div class="px-4 pt-20 text-2xl font-bold text-center md:text-4xl lg:text-6xl">
      <h1 class="px-4">AI File Organizer: Smart File Classification Made Simple</h1>
    </div>
    <div class="text-center text-gray-600 mt-4 mb-8 max-w-3xl mx-auto">
      <p class="text-lg">
        Let AI intelligently organize your files into folders. Simply describe how you want your files organized, and our AI will create a smart classification plan for you.
      </p>
    </div>

    <div class="mx-40 border rounded-xl my-10 px-20 flex flex-col justify-center shadow-xl">
      <FileOrganizer />
    </div>
  </div>
</template>

<script setup lang="ts">
import FileOrganizer from '@/components/FileOrganizer.vue'
import { onMounted } from 'vue'

onMounted(() => {
  // Update meta tags for this specific page
  document.title = 'AI File Organizer - Smart File Classification Tool'
  
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', 
      'Organize files intelligently with AI-powered classification. Describe your needs, and let AI automatically categorize and organize your files into folders. Fast, smart, and free.'
    )
  }
  
  const canonical = document.querySelector('link[rel="canonical"]')
  if (canonical) {
    canonical.setAttribute('href', 'https://bulk-rename-utility.com/file-organizer')
  }
})
</script>

<style scoped>
/* Inherits styles from parent components */
</style>
