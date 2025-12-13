<template>
  <div class="contact-page min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-16">
      <h1 class="text-4xl font-bold text-gray-900 mb-4 text-center">Contact Us</h1>
      <p class="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
        Have questions, feedback, or suggestions? We'd love to hear from you!
      </p>
      
      <div class="grid md:grid-cols-2 gap-8">
        <!-- Contact Methods -->
        <div class="space-y-6">
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span class="text-2xl">💬</span> Get in Touch
            </h2>
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <span class="text-xl">📧</span>
                <div>
                  <p class="font-medium text-gray-700">Email</p>
                  <a href="mailto:contact@bulk-rename-utility.com" class="text-blue-600 hover:underline">
                    contact@bulk-rename-utility.com
                  </a>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-xl">🐙</span>
                <div>
                  <p class="font-medium text-gray-700">GitHub Issues</p>
                  <a href="https://github.com/XXXiaofeng/BulkRenameUtility/issues" target="_blank" class="text-blue-600 hover:underline">
                    Report bugs or request features
                  </a>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-xl">⭐</span>
                <div>
                  <p class="font-medium text-gray-700">Star on GitHub</p>
                  <a href="https://github.com/XXXiaofeng/BulkRenameUtility" target="_blank" class="text-blue-600 hover:underline">
                    Support us with a star!
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-blue-50 rounded-xl p-6 border border-blue-100">
            <h3 class="font-bold text-blue-800 mb-2">🚀 Feature Requests</h3>
            <p class="text-gray-700 text-sm">
              Have an idea for a new feature? Open an issue on our GitHub repository and describe what you'd like to see!
            </p>
          </div>
        </div>

        <!-- FAQ -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span class="text-2xl">❓</span> Common Questions
          </h2>
          
          <div class="space-y-4">
            <div>
              <p class="font-medium text-gray-700">Is it really free?</p>
              <p class="text-sm text-gray-600">Yes! All features are free to use with no hidden costs.</p>
            </div>
            <div>
              <p class="font-medium text-gray-700">Is my data safe?</p>
              <p class="text-sm text-gray-600">Absolutely. Everything runs in your browser. Your files never leave your computer.</p>
            </div>
            <div>
              <p class="font-medium text-gray-700">Which browsers are supported?</p>
              <p class="text-sm text-gray-600">Chrome and Edge work best. Firefox and Safari have partial support.</p>
            </div>
            <div>
              <p class="font-medium text-gray-700">Can I contribute?</p>
              <p class="text-sm text-gray-600">We welcome contributions! Check out our GitHub repository.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  document.title = 'Contact Us - Bulk Rename Utility'
  
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', 
      'Contact the Bulk Rename Utility team. Report bugs, request features, or get help with our file renaming and organization tools.'
    )
  }
  
  const canonical = document.querySelector('link[rel="canonical"]')
  if (canonical) {
    canonical.setAttribute('href', 'https://bulk-rename-utility.com/contact')
  }
})
</script>
