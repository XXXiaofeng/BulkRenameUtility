<template>
  <div class="file-organizer-page">
    <!-- Hero Section -->
    <div class="flex flex-col justify-center py-0 px-4 mx-auto leading-6 text-black">
      <div class="px-4 pt-20 text-2xl font-bold text-center md:text-4xl lg:text-6xl">
        <h1 class="px-4">AI File Organizer: Smart File Classification Made Simple</h1>
      </div>
      <div class="text-center text-gray-600 mt-4 mb-8 max-w-3xl mx-auto">
        <p class="text-lg">
          Let AI intelligently organize your files into folders. Simply describe how you want your files organized, and our AI will create a smart classification plan for you.
        </p>
        <p class="text-sm text-green-600 mt-3 font-medium">
          🔒 100% Client-Side Processing - Your files never leave your computer
        </p>
      </div>
    </div>

    <!-- Main Tool Area -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div class="border rounded-xl bg-white shadow-xl overflow-hidden">
        <FileOrganizer />
      </div>
    </div>

    <!-- How It Works Section -->
    <div class="bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-10 text-gray-800">
          How Does AI File Organizer Work?
        </h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div class="text-4xl mb-4">📁</div>
            <h3 class="font-bold text-lg mb-2">1. Import Your Files</h3>
            <p class="text-gray-600 text-sm">Select files or entire folders from your computer. The tool reads only file names and metadata - your actual file content stays private.</p>
          </div>
          <div class="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div class="text-4xl mb-4">💬</div>
            <h3 class="font-bold text-lg mb-2">2. Describe Your Needs</h3>
            <p class="text-gray-600 text-sm">Tell the AI how you want files organized in plain English. For example: "Group by file type" or "Organize by project name".</p>
          </div>
          <div class="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div class="text-4xl mb-4">✨</div>
            <h3 class="font-bold text-lg mb-2">3. Review & Execute</h3>
            <p class="text-gray-600 text-sm">Review the AI-generated folder structure, drag files to adjust if needed, then execute to organize your files automatically.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Why Choose Us Section -->
    <div class="py-16 px-4">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-10 text-gray-800">
          Why Choose Our AI File Organizer?
        </h2>
        
        <div class="grid md:grid-cols-2 gap-8">
          <!-- Privacy Card -->
          <div class="p-6 bg-green-50 rounded-xl border border-green-100">
            <h3 class="font-bold text-xl mb-3 text-green-800 flex items-center gap-2">
              🔐 Complete Privacy Protection
            </h3>
            <p class="text-gray-700 mb-3">
              Unlike cloud-based file organizers that require uploading your files to remote servers, our tool processes everything <strong>directly in your browser</strong>.
            </p>
            <ul class="text-sm text-gray-600 space-y-2">
              <li>✓ No file uploads - only file names are analyzed</li>
              <li>✓ All processing happens on your device</li>
              <li>✓ No data stored on any server</li>
              <li>✓ Works offline after initial page load</li>
            </ul>
          </div>

          <!-- AI Intelligence Card -->
          <div class="p-6 bg-blue-50 rounded-xl border border-blue-100">
            <h3 class="font-bold text-xl mb-3 text-blue-800 flex items-center gap-2">
              🤖 Advanced AI Understanding
            </h3>
            <p class="text-gray-700 mb-3">
              Powered by state-of-the-art AI models, our organizer understands natural language commands and intelligently categorizes files.
            </p>
            <ul class="text-sm text-gray-600 space-y-2">
              <li>✓ Natural language input - no technical knowledge required</li>
              <li>✓ Smart file type detection</li>
              <li>✓ Context-aware folder naming</li>
              <li>✓ Handles thousands of files efficiently</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Comparison Section -->
    <div class="bg-gray-50 py-16 px-4">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-10 text-gray-800">
          AI File Organizer vs Traditional Methods
        </h2>
        
        <div class="overflow-x-auto">
          <table class="w-full bg-white rounded-xl shadow-sm overflow-hidden">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-6 py-4 text-left text-gray-700 font-semibold">Feature</th>
                <th class="px-6 py-4 text-center text-gray-700 font-semibold">Our AI Organizer</th>
                <th class="px-6 py-4 text-center text-gray-700 font-semibold">Manual Organization</th>
                <th class="px-6 py-4 text-center text-gray-700 font-semibold">Cloud-Based Tools</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr>
                <td class="px-6 py-4 text-gray-600">Privacy</td>
                <td class="px-6 py-4 text-center text-green-600 font-medium">✓ 100% Local</td>
                <td class="px-6 py-4 text-center text-green-600">✓ Local</td>
                <td class="px-6 py-4 text-center text-red-500">✗ Uploads Required</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-gray-600">Speed</td>
                <td class="px-6 py-4 text-center text-green-600 font-medium">✓ Instant</td>
                <td class="px-6 py-4 text-center text-red-500">✗ Hours/Days</td>
                <td class="px-6 py-4 text-center text-yellow-600">~ Depends on upload</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-gray-600">Intelligence</td>
                <td class="px-6 py-4 text-center text-green-600 font-medium">✓ AI-Powered</td>
                <td class="px-6 py-4 text-center text-red-500">✗ Manual Decisions</td>
                <td class="px-6 py-4 text-center text-green-600">✓ AI-Powered</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-gray-600">Cost</td>
                <td class="px-6 py-4 text-center text-green-600 font-medium">✓ Free</td>
                <td class="px-6 py-4 text-center text-green-600">✓ Free</td>
                <td class="px-6 py-4 text-center text-red-500">✗ Subscription</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-gray-600">No Installation</td>
                <td class="px-6 py-4 text-center text-green-600 font-medium">✓ Web-Based</td>
                <td class="px-6 py-4 text-center text-green-600">✓ Native</td>
                <td class="px-6 py-4 text-center text-green-600">✓ Web-Based</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Use Cases Section -->
    <div class="py-16 px-4">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-10 text-gray-800">
          Perfect Use Cases for AI File Organizer
        </h2>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="p-5 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h4 class="font-bold text-gray-800 mb-2">📸 Photo Libraries</h4>
            <p class="text-sm text-gray-600">Organize thousands of photos by date, event, or subject automatically.</p>
          </div>
          <div class="p-5 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h4 class="font-bold text-gray-800 mb-2">📄 Document Archives</h4>
            <p class="text-sm text-gray-600">Sort business documents, invoices, and reports into logical folders.</p>
          </div>
          <div class="p-5 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h4 class="font-bold text-gray-800 mb-2">🎵 Music Collections</h4>
            <p class="text-sm text-gray-600">Categorize music files by genre, artist, or album structure.</p>
          </div>
          <div class="p-5 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h4 class="font-bold text-gray-800 mb-2">💻 Project Files</h4>
            <p class="text-sm text-gray-600">Organize development or design project assets efficiently.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="bg-gray-50 py-16 px-4">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-10 text-gray-800">
          Frequently Asked Questions
        </h2>
        
        <div class="space-y-4">
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="font-bold text-lg text-gray-800 mb-2">Is my data safe with AI File Organizer?</h3>
            <p class="text-gray-600">Absolutely. Your files never leave your computer. Only file names and optional metadata (size, date) are sent to the AI for classification. The actual file contents are never accessed or transmitted.</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="font-bold text-lg text-gray-800 mb-2">What browsers are supported?</h3>
            <p class="text-gray-600">AI File Organizer works best on Chrome and Edge browsers due to the File System Access API requirements. Firefox and Safari have limited support.</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="font-bold text-lg text-gray-800 mb-2">How many files can I organize at once?</h3>
            <p class="text-gray-600">Our scalable AI architecture handles thousands of files efficiently by processing them in batches. There's no practical limit for typical use cases.</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="font-bold text-lg text-gray-800 mb-2">Is it really free?</h3>
            <p class="text-gray-600">Yes! AI File Organizer is completely free to use. No registration, no subscription, no hidden fees.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FileOrganizer from '@/components/FileOrganizer.vue'
import { onMounted } from 'vue'

onMounted(() => {
  // Update meta tags for this specific page
  document.title = 'AI File Organizer - Smart File Classification Tool | Bulk Rename Utility'
  
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', 
      'Free AI File Organizer - Automatically classify and organize your files into folders using AI. 100% private, runs locally in your browser. No uploads, no installation required.'
    )
  }
  
  const canonical = document.querySelector('link[rel="canonical"]')
  if (canonical) {
    canonical.setAttribute('href', 'https://bulk-rename-utility.com/file-organizer')
  }
})
</script>

<style scoped>
.file-organizer-page {
  min-height: 100vh;
}
</style>
