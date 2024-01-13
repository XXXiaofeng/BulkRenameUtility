<template>
  <div class="container">
    <el-input
      style="max-width: 80vw"
      v-model="pattern"
      placeholder="Search value, Regular Expression - you can use JavaScript's regex literal form, like /\d\d/i, or simply write the regex, like \d\d"></el-input>
    <el-input
      style="max-width: 80vw"
      v-model="newStr"
      placeholder="Replace value, New string - you can use backreferences"></el-input>
  </div>
</template>

<script lang="ts" setup>
const pattern = ref("")
const newStr = ref("")

const emits = defineEmits(["submit"])

watchEffect(() => {
  const options = {
    pattern: pattern.value,
    to: newStr.value
  }
  emits("submit", options)
})
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;

  & > div:nth-child(1) {
    margin-bottom: 12px;
  }
}
</style>
