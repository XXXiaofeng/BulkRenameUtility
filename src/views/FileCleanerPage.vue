<template>
  <div class="flex flex-col justify-center py-0 px-4 mx-auto leading-6 text-black min-h-screen">
    <div class="px-4 pt-20 text-2xl font-bold text-center md:text-4xl lg:text-6xl">
      <h1 class="px-4">File Cleaner - Clean Up Junk Files</h1>
    </div>
    <div class="text-center text-gray-600 mt-4 mb-12 max-w-3xl mx-auto">
      <p class="text-lg">
        Automatically detect and remove temporary files, cache, logs, and other junk files to keep your system clean and optimized.
      </p>
    </div>

    <div class="mx-auto max-w-4xl text-center">
      <div class="coming-soon-container">
        <div class="icon-large">🧹</div>
        <h2 class="text-3xl font-bold mb-4">Coming Soon!</h2>
        <p class="text-xl text-gray-600 mb-8">
          We're developing an intelligent file cleaning tool. File Cleaner will offer:
        </p>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h3>Smart Detection</h3>
            <p>Identify temp files, cache, logs, and junk files automatically</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Size Analysis</h3>
            <p>See exact space savings before cleaning</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">✅</div>
            <h3>Safe Cleanup</h3>
            <p>Only remove safe-to-delete files with preview option</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⚙️</div>
            <h3>Custom Rules</h3>
            <p>Define Your own cleanup rules and patterns</p>
          </div>
        </div>

        <div class="mt-12">
          <p class="text-gray-600 mb-4">Explore our current features:</p>
          <div class="flex gap-4 justify-center flex-wrap">
            <router-link to="/" class="cta-button">
              🏠 Home
            </router-link>
            <router-link to="/batch-rename" class="cta-button">
              📝 Batch Rename
            </router-link>
            <router-link to="/file-organizer" class="cta-button">
              📁 File Organizer
            </router-link>
            <router-link to="/photo-renamer" class="cta-button">
              📸 Photo Renamer
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  document.title = 'File Cleaner - Clean Up Junk Files (Coming Soon)'
  
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content',
      'Smart file cleaning tool to remove temporary files, cache, and junk files. Free up disk space safely with intelligent detection. Coming soon to Bulk Rename Utility.'
    )
  }
  
  const canonical = document.querySelector('link[rel="canonical"]')
  if (canonical) {
    canonical.setAttribute('href', 'https://bulk-rename-utility.com/file-cleaner')
  }
})
</script>

<style scoped>
.coming-soon-container {
  padding: 60px 40px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.icon-large {
  font-size: 120px;
  margin-bottom: 20px;
  animation: sweep 3s ease-in-out infinite;
}

@keyframes sweep {
  0%, 100% {
    transform: rotate(-10deg);
  }
  50% {
    transform: rotate(10deg);
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin: 40px 0;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 24px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.feature-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.feature-card p {
  font-size: 14px;
  opacity: 0.9;
}

.cta-button {
  display: inline-block;
  padding: 12px 24px;
  background: white;
  color: #f5576c;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}
</style>
