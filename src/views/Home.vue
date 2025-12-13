<template>
  <div class="home-container">
    <!-- Hero Section -->
    <div class="flex flex-col justify-center py-0 px-4 mx-auto leading-6 text-black">
      <div class="px-4 pt-20 text-2xl font-bold text-center md:text-4xl lg:text-6xl">
        <h1 class="px-4">AI Bulk Rename Utility: Intelligent File Renaming Made Simple</h1>
      </div>
      <div class="text-center text-gray-600 mt-6 mb-4 max-w-3xl mx-auto">
        <p class="text-lg">
          Transform your file organization with our intelligent solution. Powered by advanced AI technology, 
          offering smart batch renaming, file organization, and photo management for Windows and Mac.
        </p>
        <p class="text-sm text-green-600 mt-3 font-medium">
          🔒 100% Client-Side Processing - Your files never leave your computer
        </p>
      </div>
    </div>

    <!-- Batch Rename Tool Section -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16 pointer-events-auto">
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
          2. Choosing Renaming Method
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions mb-6 p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
          <div class="text-center mb-3 text-gray-700">
            <strong>⚡ Quick Actions:</strong>
          </div>
          <div class="flex justify-center gap-3 flex-wrap">
            <button 
              @click="applyTemplate('prefix')"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow transition-all flex items-center gap-2">
              <span>📝</span> Add Prefix
            </button>
            <button 
              @click="applyTemplate('date')"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow transition-all flex items-center gap-2">
              <span>📅</span> Add Date
            </button>
            <button 
              @click="applyTemplate('sequence')"
              class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow transition-all flex items-center gap-2">
              <span>🔢</span> Sequential Numbers
            </button>
            <button 
              @click="applyTemplate('lowercase')"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 shadow transition-all flex items-center gap-2">
              <span>aA</span> Lowercase
            </button>
          </div>
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
          <DialogueInterface ref="dialogueRef"></DialogueInterface>
        </div>

        <div v-else>
          <Operations class="operation"></Operations>
        </div>

        <div class="text-2xl font-bold mb-5 flex justify-center mt-10 text-center">
          3. Execute File Renaming
        </div>
        <ActionContainer></ActionContainer>
      </div>
    </div>

    <!-- Feature Cards -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
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
        
        <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div class="text-4xl mb-4">⚡</div>
          <h3 class="text-xl font-bold mb-2">Fast & Secure</h3>
          <p class="text-gray-600 mb-4">All processing happens locally in your browser. No files are ever uploaded to our servers.</p>
        </div>
      </div>
    </div>

    <!-- Why Choose Us Section -->
    <div class="bg-gray-50 py-16 px-4">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-10 text-gray-800">
          Why Choose Bulk Rename Utility?
        </h2>
        
        <div class="grid md:grid-cols-2 gap-8 mb-12">
          <!-- Privacy Card -->
          <div class="p-6 bg-green-50 rounded-xl border border-green-100">
            <h3 class="font-bold text-xl mb-3 text-green-800 flex items-center gap-2">
              🔐 Complete Privacy Protection
            </h3>
            <p class="text-gray-700 mb-3">
              Unlike cloud-based tools that require uploading your files, Bulk Rename Utility processes everything <strong>directly in your browser</strong>.
            </p>
            <ul class="text-sm text-gray-600 space-y-2">
              <li>✓ No file uploads - only file names are processed</li>
              <li>✓ All operations happen on your device</li>
              <li>✓ No data stored on any server</li>
            </ul>
          </div>

          <!-- AI Power Card -->
          <div class="p-6 bg-blue-50 rounded-xl border border-blue-100">
            <h3 class="font-bold text-xl mb-3 text-blue-800 flex items-center gap-2">
              🤖 AI-Powered Intelligence
            </h3>
            <p class="text-gray-700 mb-3">
              Describe your renaming needs in plain English. Our AI understands your intent and applies changes automatically.
            </p>
            <ul class="text-sm text-gray-600 space-y-2">
              <li>✓ Natural language input</li>
              <li>✓ Smart pattern detection</li>
              <li>✓ Handles complex renaming rules</li>
            </ul>
          </div>
        </div>

        <!-- Comparison Table -->
        <h3 class="text-2xl font-bold text-center mb-6 text-gray-800">
          Bulk Rename Utility vs Other Tools
        </h3>
        <div class="overflow-x-auto">
          <table class="w-full bg-white rounded-xl shadow-sm overflow-hidden">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-6 py-4 text-left text-gray-700 font-semibold">Feature</th>
                <th class="px-6 py-4 text-center text-gray-700 font-semibold">Bulk Rename Utility</th>
                <th class="px-6 py-4 text-center text-gray-700 font-semibold">Desktop Apps</th>
                <th class="px-6 py-4 text-center text-gray-700 font-semibold">Cloud Tools</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr>
                <td class="px-6 py-4 text-gray-600">AI Renaming</td>
                <td class="px-6 py-4 text-center text-green-600 font-medium">✓ Yes</td>
                <td class="px-6 py-4 text-center text-red-500">✗ Rarely</td>
                <td class="px-6 py-4 text-center text-yellow-600">~ Some</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-gray-600">No Installation</td>
                <td class="px-6 py-4 text-center text-green-600 font-medium">✓ Web-Based</td>
                <td class="px-6 py-4 text-center text-red-500">✗ Install Required</td>
                <td class="px-6 py-4 text-center text-green-600">✓ Web-Based</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-gray-600">Privacy</td>
                <td class="px-6 py-4 text-center text-green-600 font-medium">✓ 100% Local</td>
                <td class="px-6 py-4 text-center text-green-600">✓ Local</td>
                <td class="px-6 py-4 text-center text-red-500">✗ Uploads Required</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-gray-600">Free to Use</td>
                <td class="px-6 py-4 text-center text-green-600 font-medium">✓ Free</td>
                <td class="px-6 py-4 text-center text-yellow-600">~ Varies</td>
                <td class="px-6 py-4 text-center text-red-500">✗ Subscription</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-gray-600">Rule-Based Mode</td>
                <td class="px-6 py-4 text-center text-green-600 font-medium">✓ Regex, JS</td>
                <td class="px-6 py-4 text-center text-green-600">✓ Yes</td>
                <td class="px-6 py-4 text-center text-yellow-600">~ Limited</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- How to Use Section -->
    <div class="px-4 md:px-20 overflow-hidden leading-6 border-0 text-slate-600 bg-blue-50">
      <section class="relative pt-16 pb-12 leading-6 border-0 border-blue-100 border-solid text-slate-600 max-w-5xl mx-auto">
        <h2 class="mx-0 mt-0 mb-6 text-3xl font-extrabold leading-snug text-center text-slate-600">
          How to Use AI Bulk Rename Utility?
        </h2>
        <div class="grid md:grid-cols-3 gap-6">
          <div class="text-center p-5 bg-white rounded-xl shadow-sm">
            <div class="text-4xl mb-3">1️⃣</div>
            <h3 class="font-bold mb-2">Import Files</h3>
            <p class="text-sm text-gray-600">Select files or folders. No upload needed - we only read file names.</p>
          </div>
          <div class="text-center p-5 bg-white rounded-xl shadow-sm">
            <div class="text-4xl mb-3">2️⃣</div>
            <h3 class="font-bold mb-2">Choose Method</h3>
            <p class="text-sm text-gray-600">Use AI Mode for natural language or Rule Mode for precise control.</p>
          </div>
          <div class="text-center p-5 bg-white rounded-xl shadow-sm">
            <div class="text-4xl mb-3">3️⃣</div>
            <h3 class="font-bold mb-2">Execute</h3>
            <p class="text-sm text-gray-600">Preview changes and rename your local files with one click.</p>
          </div>
        </div>
      </section>
    </div>

    <!-- FAQ Section -->
    <div class="px-4 md:px-20 overflow-hidden leading-6 border-0 text-slate-600">
      <section class="relative pt-16 pb-12 leading-6 border-0 border-blue-100 border-solid text-slate-600 max-w-5xl mx-auto">
        <h2 class="mx-0 mt-0 mb-6 text-3xl font-extrabold text-center leading-snug text-slate-600">
          Frequently Asked Questions
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white p-5 rounded-lg shadow-sm">
            <h3 class="font-bold text-gray-800 mb-2">How to Use Bulk Rename Utility?</h3>
            <p class="text-sm text-gray-600">Select files, choose AI or Rule mode, and execute. No upload needed.</p>
          </div>
          <div class="bg-white p-5 rounded-lg shadow-sm">
            <h3 class="font-bold text-gray-800 mb-2">Is it free?</h3>
            <p class="text-sm text-gray-600">Yes, it's a free online tool requiring no downloads or installations.</p>
          </div>
          <div class="bg-white p-5 rounded-lg shadow-sm">
            <h3 class="font-bold text-gray-800 mb-2">Which browsers are supported?</h3>
            <p class="text-sm text-gray-600">Optimized for Chrome and Edge due to File System Access API.</p>
          </div>
          <div class="bg-white p-5 rounded-lg shadow-sm">
            <h3 class="font-bold text-gray-800 mb-2">Is my data safe?</h3>
            <p class="text-sm text-gray-600">Yes, all operations happen locally. No files are uploaded to any server.</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const mode = ref('simple')
const dialogueRef = ref<any>(null)

function applyTemplate(templateType: string) {
  const templates: Record<string, string> = {
    'prefix': 'Add "Project_" prefix to all file names',
    'date': 'Add "YYYY-MM-DD_" date prefix based on modification date',
    'sequence': 'Rename files to "File_001, File_002, File_003..." with sequential numbering',
    'lowercase': 'Convert all file names to lowercase'
  }
  
  const text = templates[templateType]
  if (dialogueRef.value && dialogueRef.value.setUserInput) {
    dialogueRef.value.setUserInput(text)
    ElMessage.success('Template applied! Click Submit to rename files.')
  } else {
    ElMessage.info('Please switch to AI Mode first.')
    mode.value = 'simple'
  }
}

onMounted(() => {
  document.title = 'AI Bulk Rename Utility: Smart File Renaming Tool | Free Online'
  
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content',
      'Free AI Bulk Rename Utility - Intelligent file renaming tool with AI and rule-based modes. 100% private, runs locally in your browser. No uploads, no installation.'
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
