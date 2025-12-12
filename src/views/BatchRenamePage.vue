<template>
  <div class="flex flex-col justify-center py-0 px-4 mx-auto leading-6 text-black">
    <div class="px-4 pt-20 text-2xl font-bold text-center md:text-4xl lg:text-6xl">
      <h1 class="px-4">Batch File Renamer - Rename Multiple Files at Once</h1>
    </div>
    <div class="text-center text-gray-600 mt-4 mb-8 max-w-3xl mx-auto">
      <p class="text-lg">
        Quickly rename hundreds of files with AI-powered suggestions or customizable rules. No installation required - works directly in your browser.
      </p>
    </div>

    <div class="mx-40 border rounded-xl my-10 px-20 flex flex-col justify-center shadow-xl">
      <div class="text-2xl font-bold mb-5 flex justify-center mt-10 text-center">
        1. Import File or Folder
      </div>
      <div class="flex justify-center text-center mb-2">
        <Upload></Upload>
      </div>
      <OperationWrapper class="max-w-full overflow-x-auto">
        <FilesTable></FilesTable>
      </OperationWrapper>

      <div class="text-2xl font-bold mb-5 flex justify-center mt-5 text-center">
        2. Selecting renaming method
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
        3. Execute file renaming
      </div>
      <ActionContainer></ActionContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const mode = ref('simple')

onMounted(() => {
  document.title = 'Batch File Renamer - Rename Multiple Files at Once'
  
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content',
      'Free online batch file renamer. Rename multiple files at once with AI-powered suggestions or custom rules. Supports Windows and Mac. No installation needed.'
    )
  }
  
  const canonical = document.querySelector('link[rel="canonical"]')
  if (canonical) {
    canonical.setAttribute('href', 'https://bulk-rename-utility.com/batch-rename')
  }
})
</script>

<style scoped>
.operation {
  flex: 1 1 0%;
}
</style>
