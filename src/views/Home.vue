<template>
  <div class="home-container">
    <!-- Hero Section -->
    <div class="flex flex-col justify-center py-0 px-4 mx-auto leading-6 text-black">
      <div class="px-4 pt-20 text-2xl font-bold text-center md:text-4xl lg:text-6xl">
        <h1 class="px-4">AI Bulk Rename Utility: Intelligent File Renaming Made Simple</h1>
      </div>
      <div class="text-center text-gray-600 mt-6 mb-12 max-w-3xl mx-auto">
        <p class="text-lg">
          Transform your file organization with our intelligent solution. Powered by advanced AI technology, 
          offering smart batch renaming, file organization, and photo management for Windows and Mac.
        </p>
        <div class="flex justify-center gap-4 mt-8 flex-wrap">
          <router-link to="/batch-rename" class="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold transition-colors">
            🚀 Start Batch Rename
          </router-link>
          <router-link to="/file-organizer" class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors">
            📂 Try File Organizer
          </router-link>
        </div>
      </div>
    </div>

    <!-- Feature Cards -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div class="text-4xl mb-4">📝</div>
          <h3 class="text-xl font-bold mb-2">Batch Rename</h3>
          <p class="text-gray-600 mb-4">Rename hundreds of files instantly with AI suggestions or custom rules like regex, numbering, and replacement.</p>
          <router-link to="/batch-rename" class="text-blue-600 font-medium hover:underline">Go to Renamer &rarr;</router-link>
        </div>
        
        <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div class="text-4xl mb-4">📂</div>
          <h3 class="text-xl font-bold mb-2">AI File Organizer</h3>
          <p class="text-gray-600 mb-4">Let AI automatically categorize and organize your messy folders based on your natural language description.</p>
          <router-link to="/file-organizer" class="text-blue-600 font-medium hover:underline">Go to Organizer &rarr;</router-link>
        </div>
        
        <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div class="text-4xl mb-4">📸</div>
          <h3 class="text-xl font-bold mb-2">Photo Renamer</h3>
          <p class="text-gray-600 mb-4">Specialized tool for photographers to rename photos by date, event, or sequence with ease.</p>
          <router-link to="/photo-renamer" class="text-blue-600 font-medium hover:underline">Go to Photo Renamer &rarr;</router-link>
        </div>
      </div>
    </div>

    <!-- How to Use Section -->
    <div class="px-4 md:px-20 overflow-hidden leading-6 border-0 text-slate-600 bg-blue-50">
      <section class="relative pt-20 pb-16 leading-6 border-0 border-blue-100 border-solid text-slate-600 max-w-7xl mx-auto">
        <h2 class="mx-0 mt-0 mb-3 text-3xl font-extrabold leading-snug border-0 border-blue-100 border-solid text-slate-600">
          How to Use AI Bulk Rename Utility for Smart File Management?
        </h2>
        <p class="mx-0 mt-0 mb-3 leading-6 border-0 border-blue-100 border-solid text-slate-500">
          Using AI Bulk Rename Utility is intuitive and powerful. Here's how:
        </p>
        <ol class="list-decimal ml-4 space-y-2">
          <li>
            <strong>Select Files or Folders:</strong> Start by choosing the files or folders you want to rename. Bulk
            Rename Utility operates online, so there's no need to upload your files; it only reads
            directory, name, and size information.
          </li>
          <li>
            <strong>Choose Renaming Method:</strong> You have two options:
            <ul class="list-disc ml-6 mt-1">
              <li>
                <strong>AI Mode:</strong> Describe your renaming needs to the AI, and it will instantly modify the
                file names.
              </li>
              <li>
                <strong>Rule Mode:</strong> Use a combination of rules like character deletion/replacement,
                adding/inserting characters, sequence padding, entirely new naming, regular
                expression replacements, and custom JavaScript.
              </li>
            </ul>
          </li>
          <li>
            <strong>Execute Renaming:</strong> Perform the renaming operation to update names on your local files.
          </li>
        </ol>
      </section>
    </div>

    <!-- What Makes It Stand Out -->
    <div class="px-4 md:px-20 overflow-hidden leading-6 border-0 text-slate-600">
      <section class="relative pt-20 pb-16 leading-6 border-0 border-blue-100 border-solid text-slate-600 max-w-7xl mx-auto">
        <h2 class="mx-0 mt-0 mb-3 text-3xl font-extrabold leading-snug border-0 border-blue-100 border-solid text-slate-600">
          What Makes AI Bulk Rename Utility Stand Out?
        </h2>
        <p class="mx-0 mt-0 mb-3 leading-6 border-0 border-blue-100 border-solid text-slate-500">
          AI Bulk Rename Utility excels with its innovative features:
        </p>
        <ol class="list-decimal ml-4 space-y-2">
          <li>
            <strong>AI-Powered Intelligence:</strong> Advanced artificial intelligence for smart file renaming suggestions.
          </li>
          <li>
            <strong>Dual Operation Modes:</strong> Combines cutting-edge AI technology with customizable rule-based methods.
          </li>
          <li>
            <strong>Supports Various File Operations:</strong> Compatible with Windows and Mac files, although it
            only supports Chrome and Edge browsers.
          </li>
          <li>
            <strong>Diverse Renaming Rules:</strong> From simple character changes to advanced regex and custom JavaScript.
          </li>
        </ol>
      </section>
    </div>

    <!-- Privacy Section -->
    <div class="px-4 md:px-20 overflow-hidden leading-6 border-0 text-slate-600 bg-blue-50">
      <section class="relative pt-20 pb-16 leading-6 border-0 border-blue-100 border-solid text-slate-600 max-w-7xl mx-auto">
        <h2 class="mx-0 mt-0 mb-3 text-3xl font-extrabold leading-snug border-0 border-blue-100 border-solid text-slate-600">
          Does Bulk Rename Utility Protect User Privacy?
        </h2>
        <p class="mx-0 mt-0 mb-3 leading-6 border-0 border-blue-100 border-solid text-slate-500">
          Yes, Bulk Rename Utility ensures user privacy:
        </p>
        <ol class="list-decimal ml-4 space-y-2">
          <li>
            <strong>Local Operations:</strong> The tool reads only file directory, name, and size information without
            uploading files to the web.
          </li>
          <li>
            <strong>Secure Browsing:</strong> Compatible with secure browsers like Chrome and Edge, ensuring data protection.
          </li>
        </ol>
      </section>
    </div>

    <!-- FAQ Section -->
    <div class="px-4 md:px-20 overflow-hidden leading-6 border-0 text-slate-600">
      <section class="relative pt-20 pb-16 leading-6 border-0 border-blue-100 border-solid text-slate-600 max-w-7xl mx-auto">
        <h2 class="mx-0 mt-0 mb-3 text-3xl font-extrabold leading-snug border-0 border-blue-100 border-solid text-slate-600">
          Frequently Asked Questions
        </h2>
        <div class="mx-auto py-10">
          <ul class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <li class="pb-6 mb-6 border-b border-[#DEE8F9]">
              <h3 class="mb-3 text-lg font-bold">How to Use Bulk Rename Utility for Batch File Renaming?</h3>
              <p class="text-sm text-gray-600">Using Bulk Rename Utility is straightforward. Select files, choose AI or Rule mode, and execute. No upload needed.</p>
            </li>
            <li class="pb-6 mb-6 border-b border-[#DEE8F9]">
              <h3 class="mb-3 text-lg font-bold">Is it free?</h3>
              <p class="text-sm text-gray-600">Yes, it's a free online tool requiring no downloads or installations.</p>
            </li>
            <li class="pb-6 mb-6 border-b border-[#DEE8F9]">
              <h3 class="mb-3 text-lg font-bold">Which browsers are supported?</h3>
              <p class="text-sm text-gray-600">It is specifically optimized for Chrome and Edge browsers due to File System Access API requirements.</p>
            </li>
            <li class="pb-6 mb-6 border-b border-[#DEE8F9]">
              <h3 class="mb-3 text-lg font-bold">Is my data safe?</h3>
              <p class="text-sm text-gray-600">Yes, all operations happen locally in your browser. No files are uploaded to any server.</p>
            </li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  document.title = 'AI Bulk Rename Utility: Smart File Renaming Tool'
  
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content',
      'Transform your file organization with AI Bulk Rename Utility - the intelligent solution for automated file renaming. Powered by advanced AI technology, free and secure.'
    )
  }
  
  const canonical = document.querySelector('link[rel="canonical"]')
  if (canonical) {
    canonical.setAttribute('href', 'https://bulk-rename-utility.com/')
  }
})
</script>

<style scoped>
/* Scoped styles if needed */
</style>
