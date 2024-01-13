<template>
  <div class="position-select">
    <el-select v-model="position" placeholder="Position for Deleting/Replacing Characters">
      <el-option
        v-for="item in positionOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value" />
    </el-select>

    <el-input-number
      v-show="['nCharAfterIndexM', 'nCharBeforeIndexM'].includes(position)"
      style="width: 220px"
      v-model="positionIndex"
      :min="0"
      placeholder="Set the value of M"></el-input-number>

    <el-input
      v-show="
        ['string', 'allAfterStr', 'allBeforeStr', 'nAfterStr', 'nBeforeStr'].includes(position)
      "
      style="width: 360px"
      v-model="positionStr"
      placeholder="Set the value of string XX"></el-input>

    <el-input-number
      v-show="
        [
          'frontN',
          'behindN',
          'nCharAfterIndexM',
          'nCharBeforeIndexM',
          'nAfterStr',
          'nBeforeStr'
        ].includes(position)
      "
      style="width: 220px"
      v-model="strLength"
      :min="0"
      placeholder="Set the value of N"></el-input-number>
  </div>
  <el-input
    class="insert-text"
    v-model="insertText"
    placeholder="New String (Leave this empty for deletion)"></el-input>
</template>

<script lang="ts" setup>
const positionOptions = [
  {
    label: "Specify String XX",
    value: "string"
  },
  {
    label: "First N Characters",
    value: "frontN"
  },
  {
    label: "Last N Characters",
    value: "behindN"
  },
  {
    label: "N Characters After Position M",
    value: "nCharAfterIndexM"
  },
  {
    label: "N Characters Before Position M",
    value: "nCharBeforeIndexM"
  },
  {
    label: "All Characters After String XX",
    value: "allAfterStr"
  },
  {
    label: "All Characters Before String XX",
    value: "allBeforeStr"
  },
  {
    label: "N Characters After String XX",
    value: "nAfterStr"
  },
  {
    label: "N Characters Before String XX",
    value: "nBeforeStr"
  }
]

const position = ref("")
const postionIndex = ref()
const strLengh = ref()
const postionStr = ref("")
const insertText = ref("")

const emits = defineEmits(["submit"])

watchEffect(() => {
  const options = {
    position: position.value,
    m: postionIndex.value,
    n: strLengh.value,
    from: postionStr.value,
    to: insertText.value
  }
  emits("submit", options)
})
</script>

<style lang="less" scoped>
.postion-select {
  display: flex;
  align-items: center;

  & > * {
    margin-right: 12px;
  }
}

.insert-text {
  margin-top: 8px;
  max-width: 460px;
}
</style>
