<template>
  <div class="blog-page min-h-screen">
    <!-- Hero Section -->
    <div class="bg-gradient-to-b from-blue-50 to-white pt-20 pb-16 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Blog</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Tips, tutorials, and insights on file management, photo organization, and productivity.
        </p>
      </div>
    </div>

    <!-- Blog Posts Grid -->
    <div class="max-w-6xl mx-auto px-4 py-12">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <router-link 
          v-for="post in blogPosts" 
          :key="post.slug"
          :to="`/blog/${post.slug}`"
          class="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
        >
          <div class="h-48 bg-gradient-to-br flex items-center justify-center text-6xl" :class="post.bgClass">
            {{ post.emoji }}
          </div>
          <div class="p-6">
            <div class="text-xs text-blue-600 font-medium uppercase tracking-wide mb-2">{{ post.category }}</div>
            <h2 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
              {{ post.title }}
            </h2>
            <p class="text-gray-600 text-sm mb-4">{{ post.excerpt }}</p>
            <div class="text-sm text-gray-400">{{ post.date }}</div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const blogPosts = [
  {
    slug: 'ultimate-guide-bulk-file-renaming',
    title: 'The Ultimate Guide to Bulk File Renaming',
    excerpt: 'Learn how to efficiently rename hundreds of files at once using AI and rule-based methods.',
    category: 'Tutorial',
    date: 'December 2024',
    emoji: '📝',
    bgClass: 'from-blue-100 to-blue-200'
  },
  {
    slug: 'ai-file-organization-tips',
    title: 'How AI is Revolutionizing File Organization',
    excerpt: 'Discover how artificial intelligence can automatically categorize and organize your messy folders.',
    category: 'Insights',
    date: 'December 2024',
    emoji: '📂',
    bgClass: 'from-purple-100 to-purple-200'
  },
  {
    slug: 'photo-renaming-best-practices',
    title: 'Photo Renaming Best Practices for Photographers',
    excerpt: 'Professional tips for naming and organizing your photo library like a pro.',
    category: 'Photography',
    date: 'December 2024',
    emoji: '📸',
    bgClass: 'from-green-100 to-green-200'
  }
]

onMounted(() => {
  document.title = 'Blog - Bulk Rename Utility'
  
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content',
      'Tips, tutorials, and insights on file management, bulk renaming, and photo organization. Learn to organize your digital life efficiently.'
    )
  }
  
  const canonical = document.querySelector('link[rel="canonical"]')
  if (canonical) {
    canonical.setAttribute('href', 'https://bulk-rename-utility.com/blog')
  }
})
</script>

<style scoped>
/* Additional styles if needed */
</style>
