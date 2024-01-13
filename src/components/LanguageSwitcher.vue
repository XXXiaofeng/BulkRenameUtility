<template>
  <button @click="changeLanguage('en')">EN</button>
  <button @click="changeLanguage('zh')">ZH</button>
</template>

<script>
export default {
  methods: {
    changeLanguage(lang) {
      const newPath = `/${lang}${this.$route.fullPath}`
      this.$router.push(newPath)
    }
  }
}
</script>
