<template>
  <div class="blog-post-page min-h-screen">
    <article v-if="post" class="max-w-4xl mx-auto px-4 py-12">
      <!-- Header -->
      <header class="mb-12 text-center">
        <div class="text-sm text-blue-600 font-medium uppercase tracking-wide mb-3">{{ post.category }}</div>
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{{ post.title }}</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">{{ post.excerpt }}</p>
        <div class="mt-4 text-gray-400">{{ post.date }}</div>
      </header>

      <!-- Content -->
      <div class="prose prose-lg max-w-none" v-html="post.content"></div>

      <!-- Back to Blog -->
      <div class="mt-16 pt-8 border-t border-gray-200 text-center">
        <router-link to="/blog" class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
          ← Back to Blog
        </router-link>
      </div>
    </article>

    <!-- Not Found -->
    <div v-else class="max-w-4xl mx-auto px-4 py-20 text-center">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
      <router-link to="/blog" class="text-blue-600 hover:underline">Return to Blog</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const post = ref<any>(null)

// Blog content database
const blogContent: Record<string, any> = {
  'ultimate-guide-bulk-file-renaming': {
    title: 'The Ultimate Guide to Bulk File Renaming',
    excerpt: 'Learn how to efficiently rename hundreds of files at once using AI and rule-based methods.',
    category: 'Tutorial',
    date: 'December 2024',
    content: `
      <h2>Why Bulk Rename Files?</h2>
      <p>Whether you're organizing photos from a vacation, managing business documents, or tidying up your downloads folder, renaming files one by one is tedious and time-consuming. Bulk file renaming tools allow you to rename hundreds or even thousands of files in seconds.</p>
      
      <h2>Traditional Methods vs AI-Powered Renaming</h2>
      <h3>Rule-Based Renaming</h3>
      <p>Traditional bulk rename tools use rules like:</p>
      <ul>
        <li><strong>Find and Replace:</strong> Replace specific text in filenames</li>
        <li><strong>Add Prefix/Suffix:</strong> Add text before or after filenames</li>
        <li><strong>Sequential Numbering:</strong> Add numbers like 001, 002, 003</li>
        <li><strong>Regex Patterns:</strong> Use regular expressions for complex replacements</li>
      </ul>
      
      <h3>AI-Powered Renaming</h3>
      <p>Modern AI-powered tools like Bulk Rename Utility take a different approach. Simply describe what you want in natural language:</p>
      <ul>
        <li>"Add today's date as a prefix"</li>
        <li>"Remove all spaces and replace with underscores"</li>
        <li>"Make all filenames lowercase"</li>
      </ul>
      <p>The AI understands your intent and applies the changes automatically.</p>
      
      <h2>Best Practices for File Naming</h2>
      <h3>1. Use Consistent Naming Conventions</h3>
      <p>Stick to one style: either <code>snake_case</code>, <code>kebab-case</code>, or <code>CamelCase</code>.</p>
      
      <h3>2. Include Dates When Relevant</h3>
      <p>Use ISO format (YYYY-MM-DD) for chronological sorting: <code>2024-12-15_report.pdf</code></p>
      
      <h3>3. Avoid Special Characters</h3>
      <p>Stick to letters, numbers, hyphens, and underscores for maximum compatibility.</p>
      
      <h3>4. Keep Names Descriptive but Concise</h3>
      <p>Balance between being informative and keeping filenames manageable.</p>
      
      <h2>Privacy Considerations</h2>
      <p>When choosing a bulk rename tool, consider privacy. Cloud-based tools may upload your files to remote servers. Our Bulk Rename Utility processes everything locally in your browser – your files never leave your computer.</p>
      
      <h2>Getting Started</h2>
      <p>Ready to organize your files? <a href="/" class="text-blue-600 hover:underline">Try Bulk Rename Utility</a> – it's free to use (with daily limits), private, and works directly in your browser.</p>
    `
  },
  'ai-file-organization-tips': {
    title: 'How AI is Revolutionizing File Organization',
    excerpt: 'Discover how artificial intelligence can automatically categorize and organize your messy folders.',
    category: 'Insights',
    date: 'December 2024',
    content: `
      <h2>The Problem with Digital Clutter</h2>
      <p>We create and download more files than ever before. Photos, documents, downloads – they pile up quickly. Studies show the average person spends significant time each week just looking for files.</p>
      
      <h2>Enter AI File Organization</h2>
      <p>AI-powered file organizers can understand natural language instructions and intelligently categorize files. Instead of manually creating folders and dragging files, you can simply describe your organization needs:</p>
      <ul>
        <li>"Sort files by type: images, documents, and videos"</li>
        <li>"Organize by project name"</li>
        <li>"Group by date modified"</li>
      </ul>
      
      <h2>How It Works</h2>
      <h3>1. File Analysis</h3>
      <p>The AI analyzes file names, extensions, and metadata to understand what each file is.</p>
      
      <h3>2. Natural Language Understanding</h3>
      <p>Your instructions are interpreted using advanced language models that understand context and intent.</p>
      
      <h3>3. Smart Categorization</h3>
      <p>Files are automatically grouped into logical categories based on your requirements.</p>
      
      <h3>4. Human Review</h3>
      <p>Before executing, you can review and adjust the proposed organization.</p>
      
      <h2>Privacy-First Approach</h2>
      <p>The best AI organizers work locally. Our AI File Organizer sends only file names to the AI – never your actual file contents. Everything processes in your browser, ensuring complete privacy.</p>
      
      <h2>Real-World Applications</h2>
      <h3>Photography</h3>
      <p>Organize thousands of photos by event, date, or subject matter.</p>
      
      <h3>Business Documents</h3>
      <p>Sort invoices, contracts, and reports into logical folder structures.</p>
      
      <h3>Personal Files</h3>
      <p>Clean up your Downloads folder or organize years of accumulated files.</p>
      
      <h2>Try It Yourself</h2>
      <p>Experience the future of file organization with our <a href="/file-organizer" class="text-blue-600 hover:underline">AI File Organizer</a> – free to use (with daily limits) and completely private.</p>
    `
  },
  'photo-renaming-best-practices': {
    title: 'Photo Renaming Best Practices for Photographers',
    excerpt: 'Professional tips for naming and organizing your photo library like a pro.',
    category: 'Photography',
    date: 'December 2024',
    content: `
      <h2>Why Photo Naming Matters</h2>
      <p>As a photographer, you may capture thousands of images. Good naming conventions make finding specific photos effortless and help maintain an organized archive for years to come.</p>
      
      <h2>Professional Naming Strategies</h2>
      <h3>Date-Based Naming</h3>
      <p>Include the date for chronological organization:</p>
      <code>2024-12-15_Wedding_John_Mary_001.jpg</code>
      
      <h3>Event-Based Naming</h3>
      <p>Group photos by event or project:</p>
      <code>Smith_Family_Portrait_001.jpg</code>
      
      <h3>Client-Based Naming</h3>
      <p>For commercial work, include client information:</p>
      <code>ClientName_Project_Date_001.jpg</code>
      
      <h2>Recommended Naming Format</h2>
      <p>A widely-used professional format is:</p>
      <code>[Date]_[Client/Event]_[Description]_[Sequence].ext</code>
      
      <p>Example: <code>2024-12-15_Wedding_Ceremony_0042.jpg</code></p>
      
      <h2>Tools of the Trade</h2>
      <h3>Batch Renaming</h3>
      <p>Manual renaming is impractical. Use batch tools to rename entire shoots at once.</p>
      
      <h3>EXIF Data</h3>
      <p>Some tools can extract date and camera information from EXIF metadata for automatic naming.</p>
      
      <h3>AI Assistance</h3>
      <p>Modern AI tools can suggest names based on your preferences or apply complex naming rules from plain English instructions.</p>
      
      <h2>Folder Structure Tips</h2>
      <ul>
        <li><strong>Year:</strong> Top-level organization by year</li>
        <li><strong>Event:</strong> Subfolders for each event or project</li>
        <li><strong>Stages:</strong> Separate Raw, Edited, and Final versions</li>
      </ul>
      
      <h2>Backup Strategy</h2>
      <p>Consistent naming makes backups more reliable. When file names are descriptive and unique, verifying backups becomes straightforward.</p>
      
      <h2>Get Started</h2>
      <p>Ready to organize your photo library? Try our <a href="/photo-renamer" class="text-blue-600 hover:underline">Photo Renamer</a> – designed specifically for photographers with templates for dates, events, and sequences.</p>
    `
  }
}

function loadPost() {
  const slug = route.params.slug as string
  post.value = blogContent[slug] || null
  
  if (post.value) {
    document.title = `${post.value.title} - Bulk Rename Utility`
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', post.value.excerpt)
    }
    
    const canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) {
      canonical.setAttribute('href', `https://bulk-rename-utility.com/blog/${slug}`)
    }
  }
}

onMounted(loadPost)
watch(() => route.params.slug, loadPost)
</script>

<style scoped>
.prose h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
}

.prose h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.prose p {
  color: #374151;
  margin-bottom: 1rem;
  line-height: 1.75;
}

.prose ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
  color: #374151;
}

.prose ul li {
  margin-bottom: 0.5rem;
}

.prose code {
  background-color: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-family: monospace;
}

.prose a {
  color: #2563eb;
}

.prose a:hover {
  text-decoration: underline;
}
</style>
