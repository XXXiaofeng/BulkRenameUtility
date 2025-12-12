import { useFileStore } from "@/store/files"

interface RenameInput {
  userInput: string
  fileNames: string[]
}

export class ThreeZeroTwoAI {
  private apiKey: string
  private model: string
  private baseURL: string

  constructor(apiKey: string) {
    console.log("[ThreeZeroTwoAI] 初始化302.ai客户端")
    if (!apiKey) {
      console.error("[ThreeZeroTwoAI] API Key缺失")
      throw new Error("API Key is required")
    }
    this.apiKey = apiKey
    this.model = "gemini-2.0-flash"
    this.baseURL = "https://api.302.ai/v1"
  }

  public async generateSummary(prompt: string, maxTokens: number = 8192): Promise<Response> {
    console.log("[ThreeZeroTwoAI] 准备发送302.ai请求")
    console.log("[ThreeZeroTwoAI] ", prompt)

    try {
      const apiResponse = await fetch(`${this.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: maxTokens,
          stream: true,
        }),
      })

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text()
        throw new Error(
          `302.ai请求失败: ${apiResponse.status} ${apiResponse.statusText}\n响应内容: ${errorText}`
        )
      }

      return apiResponse
    } catch (error) {
      console.error("[ThreeZeroTwoAI] 请求失败:", error)
      if (error instanceof TypeError) {
        throw new Error(`302.ai类型错误: ${error.message}`)
      }
      throw error
    }
  }
}

const apiKey = import.meta.env.VITE_API_KEY
const threeZeroTwoAI = new ThreeZeroTwoAI(apiKey)

export async function callGeminiAPI(input: RenameInput, signal?: AbortSignal): Promise<void> {
  const fileStore = useFileStore()
  const prompt = `Rename files according to the following rules:
Rule: ${input.userInput}
Files: ${JSON.stringify(input.fileNames)}
Requirements:
- Return JSON format: {"old_filename":"new_filename"}
- Filenames must be system-compatible
- No special characters or spaces
- No duplicate names`

  console.log("input:", input)
  console.log("input.fileNames:", input.fileNames)
  console.log("prompt:", prompt)

  try {
    const response = await threeZeroTwoAI.generateSummary(prompt)
    const reader = response.body?.getReader()
    if (!reader) throw new Error("无法获取响应流")

    let accumulatedLines = ""

    while (true) {
      if (signal?.aborted) {
        console.log("Aborted due to interrupt request")
        break
      }

      const { done, value } = await reader.read()
      if (done) break

      const chunkText = new TextDecoder().decode(value)
      console.log("chunkText:", chunkText)

      const lines = chunkText.split("\n")
      console.log("lines:", lines)

      for (const line of lines) {
        if (line.trim().startsWith("data: ")) {
          const jsonData = line.replace("data: ", "").trim()
          if (jsonData === "[DONE]") continue

          try {
            const parsed = JSON.parse(jsonData)
            const content = parsed.choices[0]?.delta?.content || ""
            accumulatedLines += content
            console.log("accumulatedLines:", accumulatedLines)

            // 增强的JSON提取逻辑，处理可能包含非JSON字符的响应
            const jsonMatch = accumulatedLines.match(/(?:```json\n)?\s*\{["\s\S]*?\}\s*(?:\n```)?/)
            if (jsonMatch) {
              let jsonStr = jsonMatch[0]
              // 清理可能的代码块标记和前后非JSON字符
              jsonStr = jsonStr.replace(/^```json\n|\n```$/g, '').trim()

              try {
                // 尝试解析完整的JSON对象
                const fullJson = JSON.parse(jsonStr)
                console.log("完整JSON对象:", fullJson)
                fileStore.applyRenamingRules(fullJson)
                // 清理已处理的JSON
                accumulatedLines = accumulatedLines.slice(
                  accumulatedLines.indexOf(jsonStr) + jsonStr.length
                )
              } catch (error) {
                console.error("完整JSON解析失败，尝试提取键值对:", error)
                // 增强的键值对提取，处理类似示例中的格式
                const keyValuePattern = /"([^"]+)"\s*:\s*"([^"]+)"/g
                let match
                while ((match = keyValuePattern.exec(jsonStr)) !== null) {
                  try {
                    const jsonPair = JSON.parse(`{"${match[1]}":"${match[2]}"}`)
                    console.log("解析的键值对:", jsonPair)
                    fileStore.applyRenamingRules(jsonPair)
                  } catch (error) {
                    console.error("键值对解析错误:", error)
                  }
                }
                accumulatedLines = accumulatedLines.slice(keyValuePattern.lastIndex)
              }
            }

          } catch (error) {
            console.error("JSON解析错误:", error)
          }
        }
      }
    }
  } catch (error) {
    console.error("callGeminiAPI错误:", error)
    throw error
  }
}

/**
 * AI 文件分类接口
 * 根据用户需求和文件列表生成文件夹分类方案
 */
export async function callGeminiForClassification(
  fileNames: string[],
  userPrompt: string,
  signal?: AbortSignal
): Promise<any> {
  const prompt = `You are a professional file organization assistant. The user has the following files that need to be classified:

File list:
${fileNames.map((name, index) => `${index + 1}. ${name}`).join('\n')}

User requirement: ${userPrompt}

Please return a classification plan in the following JSON format:
{
  "categories": {
    "FolderName1": {
      "files": ["filename1.ext", "filename2.ext"],
      "description": "Brief description of this category"
    },
    "FolderName2": {
      "files": ["filename3.ext"],
      "description": "Brief description of this category"
    }
  }
}

Requirements:
1. Folder names must comply with system naming rules (no special characters like <>:"/\\|?*)
2. Each file MUST be assigned to exactly one folder
3. Folder names should be clear and descriptive
4. Use English for folder names
5. Provide a brief description for each category
6. Return ONLY the JSON object, no additional text

Example response:
{
  "categories": {
    "Images": {
      "files": ["photo1.jpg", "screenshot.png"],
      "description": "Image and photo files"
    },
    "Documents": {
      "files": ["report.pdf", "notes.txt"],
      "description": "Text documents and PDFs"
    },
    "Others": {
      "files": ["data.csv"],
      "description": "Other file types"
    }
  }
}`

  console.log("[Classification] User prompt:", userPrompt)
  console.log("[Classification] File count:", fileNames.length)

  try {
    const response = await threeZeroTwoAI.generateSummary(prompt)
    const reader = response.body?.getReader()
    if (!reader) throw new Error("Unable to get response stream")

    let accumulatedText = ""

    while (true) {
      if (signal?.aborted) {
        console.log("[Classification] Aborted")
        throw new Error("Classification aborted by user")
      }

      const { done, value } = await reader.read()
      if (done) break

      const chunkText = new TextDecoder().decode(value)
      const lines = chunkText.split("\n")

      for (const line of lines) {
        if (line.trim().startsWith("data: ")) {
          const jsonData = line.replace("data: ", "").trim()
          if (jsonData === "[DONE]") continue

          try {
            const parsed = JSON.parse(jsonData)
            const content = parsed.choices[0]?.delta?.content || ""
            accumulatedText += content
          } catch (error) {
            console.error("[Classification] Parse error:", error)
          }
        }
      }
    }

    console.log("[Classification] Accumulated response:", accumulatedText)

    // 提取 JSON 对象
    const jsonMatch = accumulatedText.match(/\{[\s\S]*"categories"[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("AI response does not contain valid classification plan")
    }

    let jsonStr = jsonMatch[0]
    // 清理可能的 markdown 代码块标记
    jsonStr = jsonStr.replace(/```json\n?|\n?```/g, '').trim()

    const classificationPlan = JSON.parse(jsonStr)
    console.log("[Classification] Parsed plan:", classificationPlan)

    // 验证返回的数据结构
    if (!classificationPlan.categories || typeof classificationPlan.categories !== 'object') {
      throw new Error("Invalid classification plan structure")
    }

    return classificationPlan
  } catch (error) {
    console.error("[Classification] Error:", error)
    throw error
  }
}

// --- Scalable Classification Implementation ---

const SMALL_BATCH_THRESHOLD = 50 // Conservative file count limit
const TOKEN_SAFETY_LIMIT = 2000  // Switch to Map-Reduce if input tokens exceed this
const SCAN_BATCH_SIZE = 300
const EXECUTION_BATCH_SIZE = 50  // Reduced from 100 to ensure strict JSON output fits in tokens

// Types for callback phases
export type ClassificationPhase = 'SCANNING' | 'UNIFYING' | 'REVIEWING_SCHEMA' | 'CLASSIFYING' | 'COMPLETED'
export type ProgressCallback = (phase: ClassificationPhase, progress: number, total: number, message?: string) => void
export type SchemaReviewCallback = (schema: ClassificationSchema) => Promise<ClassificationSchema>

import { ClassificationSchema, BatchClassificationResult } from "@/types/organizer"

/**
 * Scalable Classification Entry Point
 */
export async function callGeminiForScalableClassification(
  fileNames: string[],
  userPrompt: string,
  onProgress: ProgressCallback,
  onSchemaReview: SchemaReviewCallback,
  signal?: AbortSignal
): Promise<any> {
  const estimatedTokens = estimateTokens(JSON.stringify(fileNames)) + estimateTokens(userPrompt) + 500 // buffer
  console.log(`[Scalable] Estimated input tokens: ${estimatedTokens}, File count: ${fileNames.length}`)

  const useScalable = fileNames.length > SMALL_BATCH_THRESHOLD || estimatedTokens > TOKEN_SAFETY_LIMIT

  if (!useScalable) {
    // FAST PATH: Direct Classification
    console.log("[Scalable] Using FAST PATH (Direct)")
    onProgress('CLASSIFYING', 0, fileNames.length, "Running direct classification...")
    const plan = await callGeminiForClassification(fileNames, userPrompt, signal)
    onProgress('COMPLETED', fileNames.length, fileNames.length, "Done")
    return plan
  } else {
    // SCALABLE PATH: Map-Reduce-Review
    console.log("[Scalable] Using SCALABLE PATH (Map-Reduce)")
    return await runMapReduceClassification(fileNames, userPrompt, onProgress, onSchemaReview, signal)
  }
}

function estimateTokens(text: string): number {
  // Rough estimation: 1 token ~= 4 chars for English, but closer to 2-3 for mixed code/filenames
  return Math.ceil(text.length / 3.5)
}

async function runMapReduceClassification(
  fileNames: string[],
  userPrompt: string,
  onProgress: ProgressCallback,
  onSchemaReview: SchemaReviewCallback,
  signal?: AbortSignal
): Promise<any> {
  // Phase 1: Structure Discovery (Scan)
  const potentialCategories: string[] = []
  const scanChunks = chunkArray(fileNames, SCAN_BATCH_SIZE)

  for (let i = 0; i < scanChunks.length; i++) {
    const chunk = scanChunks[i]
    onProgress('SCANNING', i * SCAN_BATCH_SIZE, fileNames.length, `Scanning batch ${i + 1}/${scanChunks.length}...`)

    const categories = await phase1_structureDiscovery(chunk, userPrompt, signal)
    potentialCategories.push(...categories)
  }

  // Phase 2: Reduce (Unify Schema)
  onProgress('UNIFYING', 0, 0, "Unifying classification schema...")
  const uniqueCategories = [...new Set(potentialCategories)]
  let schema = await phase2_schemaUnification(uniqueCategories, userPrompt, signal)

  // USER INTERACTION: Review Schema
  onProgress('REVIEWING_SCHEMA', 0, 0, "Waiting for user review...")
  schema = await onSchemaReview(schema)

  // Phase 3: Strict Execution
  const execChunks = chunkArray(fileNames, EXECUTION_BATCH_SIZE)
  const finalPlan: any = { categories: {} }

  // Initialize Plan with Schema
  for (const [catName, info] of Object.entries(schema.categories)) {
    finalPlan.categories[catName] = {
      files: [],
      description: info.description
    }
  }

  for (let i = 0; i < execChunks.length; i++) {
    const chunk = execChunks[i]
    onProgress('CLASSIFYING', i * EXECUTION_BATCH_SIZE, fileNames.length, `Classifying batch ${i + 1}/${execChunks.length}...`)

    const batchParam = { schema, files: chunk }
    const assignments = await phase3_strictAssignment(batchParam, signal)

    // Merge results
    for (const [filename, category] of Object.entries(assignments.fileAssignments)) {
      if (finalPlan.categories[category]) {
        finalPlan.categories[category].files.push(filename)
      } else {
        console.warn(`AI assigned to unknown category: ${category}, putting directly into map but this shouldn't happen with strict mode.`)
        if (!finalPlan.categories[category]) {
          finalPlan.categories[category] = { files: [], description: "Auto-created during execution" }
        }
        finalPlan.categories[category].files.push(filename)
      }
    }
  }

  onProgress('COMPLETED', fileNames.length, fileNames.length, "All Done")
  return finalPlan
}

// --- Helper Phases ---

async function phase1_structureDiscovery(files: string[], prompt: string, signal?: AbortSignal): Promise<string[]> {
  const aiPrompt = `Analyze these files and list ONLY the potential category names needed to organize them based on this requirement: "${prompt}".
File sample:
${files.slice(0, 50).join('\n')}
... and ${files.length - 50} more.

Rules:
1. Return purely a JSON list of strings: ["Category A", "Category B"]
2. Do not explain.
3. English category names.`

  const res = await threeZeroTwoAI.generateSummary(aiPrompt, 4096)
  const text = await readStream(res, signal)
  try {
    const json = extractJSON(text)
    return Array.isArray(json) ? json : []
  } catch (e) {
    console.error("Phase 1 parse error", e)
    return []
  }
}

async function phase2_schemaUnification(categories: string[], prompt: string, signal?: AbortSignal): Promise<ClassificationSchema> {
  const aiPrompt = `You are the architect of a file organization system.
User requirement: "${prompt}"
Collected potential categories from scan: ${JSON.stringify(categories)}

Task: Merge, refine, and deduplicate these into a Master Classification Schema.
Return JSON:
{
  "categories": {
    "FolderName": { "description": "short desc" }
  }
}`
  const res = await threeZeroTwoAI.generateSummary(aiPrompt, 4096)
  const text = await readStream(res, signal)
  const json = extractJSON(text)
  return json as ClassificationSchema
}

async function phase3_strictAssignment(params: { schema: ClassificationSchema, files: string[] }, signal?: AbortSignal): Promise<BatchClassificationResult> {
  const aiPrompt = `Assign these files EXACTLY into the provided Master Schema.
Master Schema: ${JSON.stringify(Object.keys(params.schema.categories))}
Files to assign:
${params.files.join('\n')}

Rules:
1. Every file must be assigned.
2. Use EXACT category names from the Master Schema.
3. Return JSON: { "fileAssignments": { "filename1": "CategoryName" } }`

  // Use higher token limit for batch execution to ensuring full JSON
  const res = await threeZeroTwoAI.generateSummary(aiPrompt, 8192)
  const text = await readStream(res, signal)
  return extractJSON(text) as BatchClassificationResult
}

// --- Utils ---

function chunkArray<T>(array: T[], size: number): T[][] {
  const result = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

// Helper to extract JSON from AI response (which might have markdown)
function extractJSON(text: string): any {
  const match = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/) || text.match(/\[[\s\S]*\]/)
  if (match) {
    try {
      return JSON.parse(match[1] || match[0])
    } catch (e) {
      // fallback: try cleaning
      return JSON.parse(text.replace(/```json/g, '').replace(/```/g, ''))
    }
  }
  throw new Error("No JSON found")
}

// Helper to read stream to completion (reusing logic from existing function potentially, but simple enough to inline for clarity in this new module)
// Helper to read SSE stream to completion and accumulate content
async function readStream(response: Response, signal?: AbortSignal): Promise<string> {
  const reader = response.body?.getReader()
  if (!reader) return ""

  let acc = ""
  let buffer = ""

  while (true) {
    if (signal?.aborted) throw new Error("Aborted")
    const { done, value } = await reader.read()
    if (done) break

    const chunkText = new TextDecoder().decode(value)
    buffer += chunkText

    const lines = buffer.split("\n")
    // Keep the incomplete last line in the buffer
    buffer = lines.pop() || ""

    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.startsWith("data: ")) {
        const data = trimmed.slice(6) // Remove "data: "
        if (data === "[DONE]") continue

        try {
          const parsed = JSON.parse(data)
          const content = parsed.choices?.[0]?.delta?.content || ""
          acc += content
        } catch (e) {
          // Ignore parse errors for intermediate chunks
          console.debug("Stream parse error:", e)
        }
      }
    }
  }
  return acc
}
