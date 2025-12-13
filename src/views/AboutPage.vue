<template>
  <div class="about-page min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-16">
      <h1 class="text-4xl font-bold text-gray-900 mb-8 text-center">About Us</h1>
      
      <div class="bg-white rounded-xl shadow-sm p-8 space-y-8">
        <section>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p class="text-gray-600 leading-relaxed">
            At Bulk Rename Utility, our mission is to simplify digital organization. We believe that managing files shouldn't be a tedious chore. Our tools are designed to be powerful, intuitive, and privacy-focused, helping you reclaim your time and keep your digital life organized.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Why Choose Us?</h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="p-4 bg-blue-50 rounded-lg">
              <h3 class="font-bold text-blue-800 mb-2">🔒 Privacy First</h3>
              <p class="text-gray-700 text-sm">
                We process everything locally in your browser. Your files never leave your device, ensuring maximum security and privacy.
              </p>
            </div>
            <div class="p-4 bg-green-50 rounded-lg">
              <h3 class="font-bold text-green-800 mb-2">⚡ Lightning Fast</h3>
              <p class="text-gray-700 text-sm">
                Built with modern web technologies, our tools handle thousands of files in seconds without any software installation.
              </p>
            </div>
            <div class="p-4 bg-purple-50 rounded-lg">
              <h3 class="font-bold text-purple-800 mb-2">🤖 AI Powered</h3>
              <p class="text-gray-700 text-sm">
                We leverage cutting-edge AI to provide smart renaming suggestions and automatic file organization.
              </p>
            </div>
            <div class="p-4 bg-orange-50 rounded-lg">
              <h3 class="font-bold text-orange-800 mb-2">💎 Completely Free</h3>
              <p class="text-gray-700 text-sm">
                Our core tools are free to use. We believe essential productivity tools should be accessible to everyone.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">The Story</h2>
          <p class="text-gray-600 leading-relaxed mb-4">
            Bulk Rename Utility started as a simple script to help organize a messy photo collection. Realizing that many others faced the same problem—renaming thousands of photos, organizing documents, and cleaning up downloads—we decided to build a full-fledged web application.
          </p>
          <p class="text-gray-600 leading-relaxed">
            Today, we serve thousands of users worldwide, helping them organize millions of files. We are constantly improving and adding new features based on user feedback.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Join Our Community</h2>
          <p class="text-gray-600 leading-relaxed mb-4">
            We are an open-source project and welcome contributions from the community. Whether you're a developer, designer, or just a user with a great idea, we'd love to hear from you.
          </p>
          <div class="flex gap-4">
            <a href="https://github.com/XXXiaofeng/BulkRenameUtility" target="_blank" class="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
              <span class="mr-2">View on GitHub</span>
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <router-link to="/contact" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Contact Us
            </router-link>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  document.title = 'About Us - Bulk Rename Utility'
})
</script>