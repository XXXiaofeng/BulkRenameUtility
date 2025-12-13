<template>
  <div class="photo-renamer-page">
    <!-- Hero Section -->
    <div class="flex flex-col justify-center py-0 px-4 mx-auto leading-6 text-black">
      <div class="px-4 pt-20 text-2xl font-bold text-center md:text-4xl lg:text-6xl">
        <h1 class="px-4">Photo Renamer: Batch Rename Photos Like a Pro</h1>
      </div>
      <div class="text-center text-gray-600 mt-4 mb-8 max-w-3xl mx-auto">
        <p class="text-lg">
          Perfect for photographers and photo enthusiasts. Quickly rename and organize your photo collections with AI assistance or pre-configured templates.
        </p>
        <p class="text-sm text-green-600 mt-3 font-medium">
          🔒 100% Privacy - Your photos stay on your computer
        </p>
      </div>
    </div>

    <!-- Main Tool Area -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div class="border rounded-xl bg-white shadow-xl p-6 md:p-10">
        <div class="text-2xl font-bold mb-5 flex justify-center text-center">
          1. Import Photos
        </div>
        <div class="flex justify-center text-center mb-6">
          <Upload></Upload>
        </div>
        <OperationWrapper class="max-w-full overflow-x-auto mb-10">
          <FilesTable></FilesTable>
        </OperationWrapper>

        <div class="text-2xl font-bold mb-5 flex justify-center text-center">
          2. Choose Renaming Style
        </div>

        <!-- Photo-specific quick actions -->
        <div class="quick-actions mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
          <div class="text-center mb-4 text-gray-700">
            <strong class="text-lg">⚡ Quick Actions for Photographers:</strong>
          </div>
          <div class="flex justify-center gap-4 flex-wrap">
            <button 
              @click="applyPhotoTemplate('date')"
              class="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all hover:shadow-lg flex items-center gap-2">
              <span class="text-xl">📅</span> Add Date Prefix
            </button>
            <button 
              @click="applyPhotoTemplate('event')"
              class="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md transition-all hover:shadow-lg flex items-center gap-2">
              <span class="text-xl">🎉</span> Event + Number
            </button>
            <button 
              @click="applyPhotoTemplate('sequence')"
              class="px-5 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-md transition-all hover:shadow-lg flex items-center gap-2">
              <span class="text-xl">🔢</span> Sequential Numbers
            </button>
          </div>
        </div>

        <div class="flex justify-center text-center mb-6">
          <div class="bg-white inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              class="px-6 py-2 text-sm font-medium border border-gray-200 rounded-l-lg focus:z-10 focus:ring-2 focus:ring-blue-700"
              :class="mode === 'simple' ? 'bg-black text-white' : 'bg-white text-gray-900 hover:bg-gray-100'"
              @click="mode = 'simple'">
              AI Mode
            </button>
            <button
              type="button"
              class="px-6 py-2 text-sm font-medium border border-gray-200 rounded-r-lg focus:z-10 focus:ring-2 focus:ring-blue-700"
              :class="mode === 'advanced' ? 'bg-black text-white' : 'bg-white text-gray-900 hover:bg-gray-100'"
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
          3. Execute Renaming
        </div>
        <ActionContainer></ActionContainer>
      </div>
    </div>

    <!-- Why Photo Renamer Section -->
    <div class="bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-10 text-gray-800">
          Why Use Photo Renamer?
        </h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div class="text-4xl mb-4">📸</div>
            <h3 class="font-bold text-lg mb-2">Built for Photographers</h3>
            <p class="text-gray-600 text-sm">Designed specifically for photo workflows with templates like date prefixes, event naming, and sequential numbering.</p>
          </div>
          <div class="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div class="text-4xl mb-4">🤖</div>
            <h3 class="font-bold text-lg mb-2">AI-Powered Naming</h3>
            <p class="text-gray-600 text-sm">Describe your naming convention in plain English and let AI generate the perfect file names automatically.</p>
          </div>
          <div class="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div class="text-4xl mb-4">⚡</div>
            <h3 class="font-bold text-lg mb-2">Batch Processing</h3>
            <p class="text-gray-600 text-sm">Rename hundreds or thousands of photos in seconds. Preview all changes before executing.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Privacy Section -->
    <div class="py-16 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="p-8 bg-green-50 rounded-2xl border border-green-100">
          <h2 class="text-2xl font-bold text-center mb-6 text-green-800">
            🔐 Your Photos Stay Private
          </h2>
          <p class="text-center text-gray-700 mb-6 max-w-2xl mx-auto">
            Unlike cloud-based photo tools, Photo Renamer processes everything locally in your browser. Your actual image files are <strong>never uploaded</strong> anywhere.
          </p>
          <div class="grid md:grid-cols-3 gap-4 text-center">
            <div class="p-4">
              <div class="text-3xl mb-2">📂</div>
              <p class="text-sm text-gray-600">Only file names are read</p>
            </div>
            <div class="p-4">
              <div class="text-3xl mb-2">💻</div>
              <p class="text-sm text-gray-600">All processing on your device</p>
            </div>
            <div class="p-4">
              <div class="text-3xl mb-2">🚫</div>
              <p class="text-sm text-gray-600">No images uploaded to servers</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Comparison Section -->
    <div class="bg-gray-50 py-16 px-4">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-10 text-gray-800">
          Photo Renamer vs Other Tools
        </h2>
        
        <div class="overflow-x-auto">
          <table class="w-full bg-white rounded-xl shadow-sm overflow-hidden">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-6 py-4 text-left text-gray-700 font-semibold">Feature</th>
                <th class="px-6 py-4 text-center text-gray-700 font-semibold">Our Photo Renamer</th>
                <th class="px-6 py-4 text-center text-gray-700 font-semibold">Adobe Bridge</th>
                <th class="px-6 py-4 text-center text-gray-700 font-semibold">Desktop Apps</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr>
                <td class="px-6 py-4 text-gray-600">AI Renaming</td>
                <td class="px-6 py-4 text-center text-green-600 font-medium">✓ Yes</td>
                <td class="px-6 py-4 text-center text-red-500">✗ No</td>
                <td class="px-6 py-4 text-center text-red-500">✗ Rarely</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-gray-600">No Installation</td>
                <td class="px-6 py-4 text-center text-green-600 font-medium">✓ Web-Based</td>
                <td class="px-6 py-4 text-center text-red-500">✗ Install Required</td>
                <td class="px-6 py-4 text-center text-red-500">✗ Install Required</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-gray-600">Free to Use</td>
                <td class="px-6 py-4 text-center text-green-600 font-medium">✓ Completely Free</td>
                <td class="px-6 py-4 text-center text-red-500">✗ Subscription</td>
                <td class="px-6 py-4 text-center text-yellow-600">~ Some Free</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-gray-600">Cross-Platform</td>
                <td class="px-6 py-4 text-center text-green-600 font-medium">✓ Any OS</td>
                <td class="px-6 py-4 text-center text-yellow-600">~ Win/Mac</td>
                <td class="px-6 py-4 text-center text-red-500">✗ Varies</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-gray-600">Privacy</td>
                <td class="px-6 py-4 text-center text-green-600 font-medium">✓ 100% Local</td>
                <td class="px-6 py-4 text-center text-green-600">✓ Local</td>
                <td class="px-6 py-4 text-center text-green-600">✓ Local</td>
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
          Common Photo Renaming Scenarios
        </h2>
        
        <div class="grid md:grid-cols-2 gap-6">
          <div class="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
            <h3 class="font-bold text-lg text-gray-800 mb-3">📅 Date-Based Organization</h3>
            <p class="text-gray-600 text-sm mb-3">Perfect for organizing photos by when they were taken.</p>
            <code class="text-xs bg-gray-100 px-2 py-1 rounded">IMG_1234.jpg → 2024-01-15_IMG_1234.jpg</code>
          </div>
          <div class="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
            <h3 class="font-bold text-lg text-gray-800 mb-3">🎉 Event Naming</h3>
            <p class="text-gray-600 text-sm mb-3">Rename photos from weddings, parties, or trips with event names.</p>
            <code class="text-xs bg-gray-100 px-2 py-1 rounded">DSC_0001.jpg → Wedding_John_Mary_001.jpg</code>
          </div>
          <div class="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
            <h3 class="font-bold text-lg text-gray-800 mb-3">🔢 Sequential Numbering</h3>
            <p class="text-gray-600 text-sm mb-3">Create clean, numbered sequences for portfolios or archives.</p>
            <code class="text-xs bg-gray-100 px-2 py-1 rounded">photo.jpg → Photo_0001.jpg, Photo_0002.jpg...</code>
          </div>
          <div class="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
            <h3 class="font-bold text-lg text-gray-800 mb-3">✨ Custom AI Naming</h3>
            <p class="text-gray-600 text-sm mb-3">Describe any naming convention and let AI do the work.</p>
            <code class="text-xs bg-gray-100 px-2 py-1 rounded">"Add client name prefix and remove spaces"</code>
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
            <h3 class="font-bold text-lg text-gray-800 mb-2">Does Photo Renamer access my actual photo content?</h3>
            <p class="text-gray-600">No. The tool only reads the file names and optionally the file size and modification date. Your actual image pixels are never accessed or uploaded anywhere.</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="font-bold text-lg text-gray-800 mb-2">Can I undo the renaming?</h3>
            <p class="text-gray-600">You can preview all changes before executing. Once executed, the renaming is applied to your local files. We recommend backing up important files before batch operations.</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="font-bold text-lg text-gray-800 mb-2">What photo formats are supported?</h3>
            <p class="text-gray-600">Photo Renamer works with any file type including JPG, PNG, RAW (CR2, NEF, ARW), HEIC, and more. It renames the file regardless of format.</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="font-bold text-lg text-gray-800 mb-2">Is there a limit on how many photos I can rename?</h3>
            <p class="text-gray-600">There's no artificial limit. The tool efficiently handles thousands of files. Processing speed depends on your device's performance.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const mode = ref('simple')
const dialogueRef = ref<any>(null)

function applyPhotoTemplate(templateType: string) {
  const templates: Record<string, string> = {
    'date': 'Add "YYYY-MM-DD_" prefix to each file name based on modification date',
    'event': 'Rename files to "Wedding_001, Wedding_002, Wedding_003..." format with sequential numbering',
    'sequence': 'Rename all files to "Photo_0001, Photo_0002, Photo_0003..." with 4-digit leading zeros'
  }
  
  const text = templates[templateType]
  if (dialogueRef.value && dialogueRef.value.setUserInput) {
    dialogueRef.value.setUserInput(text)
    ElMessage.success('Template applied! Click Submit to rename files.')
  } else {
    ElMessage.info('Please switch to AI Mode first, then try again.')
    mode.value = 'simple'
  }
}

onMounted(() => {
  document.title = 'Photo Renamer - Batch Rename Photos | Bulk Rename Utility'
  
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content',
      'Free Photo Renamer - Batch rename photos with date prefixes, event names, or sequential numbers. AI-powered naming suggestions. 100% private, no uploads required.'
    )
  }
  
  const canonical = document.querySelector('link[rel="canonical"]')
  if (canonical) {
    canonical.setAttribute('href', 'https://bulk-rename-utility.com/photo-renamer')
  }
})
</script>

<style scoped>
.photo-renamer-page {
  min-height: 100vh;
}

.operation {
  flex: 1 1 0%;
}
</style>
