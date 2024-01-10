<template>
  <div>
    <!-- User input box -->
    <textarea v-model="userInput" placeholder="Describe your renaming requirements here"></textarea>
    <!-- Submit button -->
    <button v-show="!loading" @click="submitToGemini">Submit</button>
    <div v-if="loading">Loading...</div>
    <!-- Interrupt button -->
    <button v-show="loading" @click="interruptLoading">Interrupt Loading</button>
    <!-- File table component, displays the list of renamed files -->
    <FilesTable :files="renamedFiles"></FilesTable>
    <OperationWrapper>
      <!-- Operation container component, contains various operation buttons -->
      <ActionContainer></ActionContainer>
    </OperationWrapper>
  </div>
</template>

<script setup>
import { ref, watch } from "vue"
import { useFileStore } from "@/store/files"
import { callGeminiAPI } from "../utils/geminiAPI"
import { useRenameHandler } from "./Operations/Handlers/handler.flow"

const fileStore = useFileStore()
const userInput = ref("")
const renamedFiles = ref([])
const loading = ref(false)
const { debounceRename } = useRenameHandler()
let shouldStop = false

watch(
  () => fileStore.$state.files,
  (newFiles) => {
    renamedFiles.value = newFiles.map((file) => ({ ...file, newName: file.name }))
  },
  { deep: true }
)

const submitToGemini = async () => {
  loading.value = true
  const fileNames = fileStore.$state.files.map((file) => file.name)
  console.log("fileNames:", fileNames)

  const chunks = splitIntoChunks(fileNames, 10)

  for (let chunk of chunks) {
    if (shouldStop) {
      console.log("Stopping due to interrupt request")
      break
    }

    const combinedInput = {
      userInput: userInput.value,
      fileNames: chunk
    }

    try {
      const response = await callGeminiAPI(combinedInput)
      console.log("API Response:", response)

      let renamingRules = JSON.parse(response) // Parse the response to a JSON object
      Object.keys(renamingRules).forEach((key) => {
        const value = renamingRules[key]
        if (typeof value === "string") {
          // Replace characters that are not allowed in Windows and Mac file names with _
          renamingRules[key] = value.replace(/[<>:"\/\\|?*\x00-\x1F\s]/g, "_")
        }
      })
      console.log("renamingRules:", renamingRules)

      fileStore.applyRenamingRules(renamingRules) // Apply the renaming rules to the file store
    } catch (error) {
      console.error("Error processing Gemini API response:", error)
    }
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }
  loading.value = false
}

const interruptLoading = () => {
  loading.value = false
  shouldStop = true
}

function mapRenamingRulesToOptions(rules) {
  // Transform renaming rules into the expected options format
  return Object.entries(rules).map(([originalName, newName]) => ({
    pattern: newName
  }))
}

function splitIntoChunks(array, chunkSize) {
  let chunks = []
  for (let i = 0; i < array.length; i += chunkSize) {
    let chunk = array.slice(i, i + chunkSize)
    chunks.push(chunk)
  }
  return chunks
}
</script>
