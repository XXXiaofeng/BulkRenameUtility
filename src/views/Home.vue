<template>
  <div class="home-container">
    <!-- Hero Section -->
    <div class="flex flex-col justify-center py-0 px-4 mx-auto leading-6 text-black">
      <div class="px-4 pt-20 text-2xl font-bold text-center md:text-4xl lg:text-6xl">
        <h1 class="px-4">AI Bulk Rename Utility: Intelligent File Renaming Made Simple</h1>
      </div>
      <div class="text-center text-gray-600 mt-6 mb-8 max-w-3xl mx-auto">
        <p class="text-lg">
          Transform your file organization with our intelligent solution. Powered by advanced AI technology, 
          offering smart batch renaming, file organization, and photo management for Windows and Mac.
        </p>
      </div>
    </div>

    <!-- Batch Rename Tool Section -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20 pointer-events-auto">
      <div class="border rounded-xl bg-white shadow-xl p-4 md:p-10">
        <div class="text-2xl font-bold mb-5 flex justify-center text-center">
          1. Import File or Folder
        </div>
        <div class="flex justify-center text-center mb-6">
          <Upload></Upload>
        </div>
        <OperationWrapper class="max-w-full overflow-x-auto mb-10">
          <FilesTable></FilesTable>
        </OperationWrapper>

        <div class="text-2xl font-bold mb-5 flex justify-center text-center">
          2. Selecting renaming method
        </div>
        <div class="flex justify-center text-center mb-6">
          <div class="bg-white inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              class="px-6 py-2 text-sm font-medium border border-gray-200 rounded-l-lg focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
              :class="mode === 'simple' ? 'bg-black text-white hover:bg-gray-800' : 'bg-white text-gray-900 hover:bg-gray-100'"
              @click="mode = 'simple'">
              AI Mode
            </button>
            <button
              type="button"
              class="px-6 py-2 text-sm font-medium border border-gray-200 rounded-r-lg focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
              :class="mode === 'advanced' ? 'bg-black text-white hover:bg-gray-800' : 'bg-white text-gray-900 hover:bg-gray-100'"
              @click="mode = 'advanced'">
              Rule Mode
            </button>
          </div>
        </div>

        <div v-if="mode === 'simple'">
          <DialogueInterface></DialogueInterface>
        </div>

        <div v-else>
          <Operations class="operation"></Operations>
        </div>

        <div class="text-2xl font-bold mb-5 flex justify-center mt-10 text-center">
          3. Execute file renaming
        </div>
        <ActionContainer></ActionContainer>
      </div>
    </div>

    <!-- Feature Cards -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div class="text-4xl mb-4">�</div>
          <h3 class="text-xl font-bold mb-2">AI File Organizer</h3>
          <p class="text-gray-600 mb-4">Let AI automatically categorize and organize your messy folders based on your natural language description.</p>
          <router-link to="/file-organizer" class="text-blue-600 font-medium hover:underline">Go to Organizer &rarr;</router-link>
        </div>
        
        <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div class="text-4xl mb-4">�</div>
          <h3 class="text-xl font-bold mb-2">Photo Renamer</h3>
          <p class="text-gray-600 mb-4">Specialized tool for photographers to rename photos by date, event, or sequence with ease.</p>
          <router-link to="/photo-renamer" class="text-blue-600 font-medium hover:underline">Go to Photo Renamer &rarr;</router-link>
        </div>
        
        <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div class="text-4xl mb-4">⚡</div>
          <h3 class="text-xl font-bold mb-2">Fast & Secure</h3>
          <p class="text-gray-600 mb-4">All processing happens locally in your browser. No files are ever uploaded to our servers.</p>
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
import { ref, onMounted } from 'vue'

const mode = ref('simple')

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
.operation {
  flex: 1 1 0%;
}
</style>
