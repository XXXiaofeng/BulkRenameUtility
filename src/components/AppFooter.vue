<template>
  <footer class="bg-gray-50 border-t border-gray-200 mt-auto">
    <div class="flex flex-col items-center justify-center py-8">
      <nav class="flex flex-wrap justify-center gap-6 mb-6">
        <router-link to="/about" class="text-gray-600 hover:text-blue-600 transition-colors">About Us</router-link>
        <router-link to="/contact" class="text-gray-600 hover:text-blue-600 transition-colors">Contact</router-link>
        <router-link to="/privacy" class="text-gray-600 hover:text-blue-600 transition-colors">Privacy Policy</router-link>
      </nav>
      <p class="px-5 text-center text-gray-600 mb-2">
        Copyright 2024©
        <router-link to="/" class="text-blue-500 hover:text-blue-700">bulk-rename-utility.com</router-link>
        All rights reserved.
      </p>
      <p class="text-gray-500 text-sm">
        Credit to
        <a
          href="https://github.com/JasonGrass/rename"
          target="_blank"
          class="text-blue-500 hover:text-blue-700"
          >rename.jgrass.xyz</a
        >
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
// No script needed for now
</script>
