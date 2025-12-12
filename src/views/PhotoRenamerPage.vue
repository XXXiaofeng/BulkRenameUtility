<template>
  <div class="flex flex-col justify-center py-0 px-4 mx-auto leading-6 text-black">
    <div class="px-4 pt-20 text-2xl font-bold text-center md:text-4xl lg:text-6xl">
      <h1 class="px-4">Photo Renamer - Organize Your Photos Easily</h1>
    </div>
    <div class="text-center text-gray-600 mt-4 mb-8 max-w-3xl mx-auto">
      <p class="text-lg">
        Perfect for photographers and photo enthusiasts. Quickly rename and organize your photo collections with AI assistance or pre-configured rules.
      </p>
    </div>

    <div class="mx-40 border rounded-xl my-10 px-20 flex flex-col justify-center shadow-xl">
      <div class="text-2xl font-bold mb-5 flex justify-center mt-10 text-center">
        1. Import Photos
      </div>
      <div class="flex justify-center text-center mb-2">
        <Upload></Upload>
      </div>
      <OperationWrapper class="max-w-full overflow-x-auto">
        <FilesTable></FilesTable>
      </OperationWrapper>

      <div class="text-2xl font-bold mb-5 flex justify-center mt-5 text-center">
        2. Choose Renaming Style
      </div>

      <!-- Photo-specific quick actions -->
      <div class="quick-actions mb-6">
        <div class="text-center mb-3 text-gray-600">
          <strong>Quick Actions for Photos:</strong>
        </div>
        <div class="flex justify-center gap-3 flex-wrap">
          <button 
            @click="applyPhotoTemplate('date')"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            📅 Add Date Prefix
          </button>
          <button 
            @click="applyPhotoTemplate('event')"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            🎉 Event Name + Number
          </button>
          <button 
            @click="applyPhotoTemplate('sequence')"
            class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
            🔢 Sequential Numbering
          </button>
        </div>
      </div>

      <div class="flex justify-center text-center">
        <div class="bg-white">
          <button
            class="px-4 py-1 border border-gray-300 focus:outline-none focus:border-transparent"
            :class="{ 'bg-black text-white': mode === 'simple' }"
            @click="mode = 'simple'">
            AI Mode
          </button>
          <button
            class="px-4 py-1 border border-gray-300 focus:outline-none focus:border-transparent"
            :class="{ 'bg-black text-white': mode === 'advanced' }"
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
        3. Execute renaming
      </div>
      <ActionContainer></ActionContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const mode = ref('simple')

function applyPhotoTemplate(templateType: string) {
  const templates: Record<string, string> = {
    'date': 'Add "YYYY-MM-DD_" prefix to each file name based on modification date',
    'event': 'Rename files to "EventName_001, EventName_002, EventName_003..." (ask user for event name)',
    'sequence': 'Rename all files to "Photo_0001, Photo_0002, Photo_0003..." with leading zeros'
  }
  
  // This is a placeholder - in real implementation, this would integrate with DialogueInterface
  ElMessage.info('Template: ' + templates[templateType])
}

onMounted(() => {
  document.title = 'Photo Renamer - Organize Your Photos Easily'
  
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content',
      'Professional photo renaming tool for photographers. Batch rename photos with date prefixes, event names, or sequential numbers. AI-powered and rule-based options available.'
    )
  }
  
  const canonical = document.querySelector('link[rel="canonical"]')
  if (canonical) {
    canonical.setAttribute('href', 'https://bulk-rename-utility.com/photo-renamer')
  }
})
</script>

<style scoped>
.operation {
  flex: 1 1 0%;
}

.quick-actions {
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
}
</style>
