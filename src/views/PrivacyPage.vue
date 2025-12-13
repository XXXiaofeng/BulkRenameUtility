<template>
  <div class="privacy-page min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-16">
      <h1 class="text-4xl font-bold text-gray-900 mb-8 text-center">Privacy Policy</h1>
      
      <div class="bg-white rounded-xl shadow-sm p-8 space-y-8">
        <section>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Our Commitment to Privacy</h2>
          <p class="text-gray-600 leading-relaxed">
            At Bulk Rename Utility, we believe that your files are your business. We've built our tools with privacy as the foundation, not an afterthought.
          </p>
        </section>

        <section class="p-6 bg-green-50 rounded-xl border border-green-100">
          <h3 class="text-xl font-bold text-green-800 mb-3">🔐 100% Client-Side Processing</h3>
          <p class="text-gray-700 mb-4">
            <strong>Your files never leave your computer.</strong> All processing happens directly in your browser using modern web technologies.
          </p>
          <ul class="space-y-2 text-gray-600">
            <li class="flex items-start gap-2">
              <span class="text-green-500 font-bold">✓</span>
              <span>No file uploads to any server</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-500 font-bold">✓</span>
              <span>No storage of file contents</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-500 font-bold">✓</span>
              <span>No tracking of your file activities</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-500 font-bold">✓</span>
              <span>Works offline after initial page load</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">What Data We Access</h2>
          <h3 class="text-lg font-semibold text-gray-700 mb-2">File Metadata Only</h3>
          <p class="text-gray-600 mb-4">
            When using our AI-powered features, we only send:
          </p>
          <ul class="list-disc pl-6 text-gray-600 space-y-1">
            <li>File names (e.g., "photo001.jpg")</li>
            <li>Optionally: file size and modification date</li>
          </ul>
          <p class="text-gray-600 mt-4">
            <strong>We never access:</strong> The actual content of your files (images, documents, etc.)
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">AI Processing</h2>
          <p class="text-gray-600 leading-relaxed">
            Our AI features use external AI services for generating renaming suggestions and classification plans. When you use these features:
          </p>
          <ul class="list-disc pl-6 text-gray-600 space-y-1 mt-3">
            <li>Only file names (not contents) are sent to AI services</li>
            <li>Your data is not used to train AI models</li>
            <li>Requests are processed and immediately discarded</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Cookies & Analytics</h2>
          <p class="text-gray-600 leading-relaxed">
            We may use minimal analytics to understand how our tool is used (page visits, feature usage). We do not use cookies for tracking purposes.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Your Rights</h2>
          <p class="text-gray-600 leading-relaxed">
            Since we don't store your personal data or files, there's nothing for us to delete or provide access to. You're in complete control.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Contact</h2>
          <p class="text-gray-600">
            If you have any questions about our privacy practices, please contact us at 
            <a href="/contact" class="text-blue-600 hover:underline">our contact page</a>.
          </p>
        </section>

        <p class="text-sm text-gray-400 text-center pt-4 border-t border-gray-100">
          Last updated: December 2024
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  document.title = 'Privacy Policy - Bulk Rename Utility'
  
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', 
      'Privacy Policy for Bulk Rename Utility. Your files never leave your computer - 100% client-side processing, no uploads, complete privacy.'
    )
  }
  
  const canonical = document.querySelector('link[rel="canonical"]')
  if (canonical) {
    canonical.setAttribute('href', 'https://bulk-rename-utility.com/privacy')
  }
})
</script>
