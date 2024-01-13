<template>
  <div class="header">
    <span class="flex justify-center">
      <button
        @click="importFile"
        class="py-1 px-4 mr-5 mt-0 mb-0 text-center text-white normal-case bg-none rounded cursor-pointer bg-black bg-opacity-[0.8]">
        Import File
      </button>
      <button
        @click="importFolder"
        class="py-1 px-4 mx-0 mt-0 mb-0 text-center text-white normal-case bg-none rounded cursor-pointer bg-black bg-opacity-[0.8]">
        Import Folder
      </button>
    </span>
  </div>
</template>

<script lang="ts" setup>
import * as fileUtils from "@/utils/file"
import { useFileStore } from "@/store/files"

const store = useFileStore()

const importFile = async () => {
  const file = await fileUtils.importFile()
  if (file) {
    store.addFiles([file])
  }
}

const importFolder = async () => {
  const files = await fileUtils.importFolder()
  store.addFiles(files)
}
</script>

<style lang="less" scoped></style>
