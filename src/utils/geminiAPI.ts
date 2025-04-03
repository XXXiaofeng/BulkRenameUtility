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

  public async generateSummary(prompt: string): Promise<Response> {
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
          max_tokens: 2048,
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

  const prompt = `按以下规则重命名文件：
规则：${input.userInput}
文件：${JSON.stringify(input.fileNames)}
要求：
- 返回JSON格式：{"旧文件名":"新文件名"}
- 文件名符合系统要求
- 不含特殊字符和空格
- 名称不重复`

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
