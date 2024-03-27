import { GoogleGenerativeAI } from "@google/generative-ai"
import { useFileStore } from "@/store/files"

const apiKey = import.meta.env.VITE_API_KEY
const genAI = new GoogleGenerativeAI(apiKey)

export async function callGeminiAPI(input: any, signal?: AbortSignal) {
  // Constructing the prompt
  const fileStore = useFileStore()

  const prompt = `请将以下文件列表按照要求重新命名：\n#命名要求\n'''${
    input.userInput
  }'''\n#文件列表\n${JSON.stringify(
    input.fileNames,
    null,
    2
  )}\n#返回格式参考以下格式\n{\n    "原始文件名称1": "重命名文件名称1",\n    "原始文件名称2": "重命名文件名称2"\n}\n#其他要求\n不要加其他任何符号和文字、不能有空格、所有字符需要符合windows和mac的文件格式要求\n请以{作为回复开头，}作为回复结尾\n不要有重复命名`
  console.log("input:", input)
  console.log("input.fileNames:", input.fileNames)
  console.log("prompt:", prompt)

  // Select the model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" })

  // // Use streaming for faster interaction
  // const result = await model.generateContentStream(prompt)
  const chat = model.startChat()
  const result = await chat.sendMessageStream(prompt)

  let accumulatedLines = ""

  for await (const chunk of result.stream) {
    if (signal?.aborted) {
      console.log("Aborted due to interrupt request")
      break
    }
    const chunkText = chunk.text()
    console.log("chunkText:", chunkText)

    const lines = chunkText.split("\n")
    console.log("lines:", lines)

    for (const line of lines) {
      accumulatedLines += line
      console.log("accumulatedLines:", accumulatedLines)

      // Extract key-value pairs from accumulatedLines
      const keyValuePairs = accumulatedLines.match(/"([^"]+)":\s*"([^"]+)"[^,]*/g)
      console.log("keyValuePairs:", keyValuePairs)

      if (keyValuePairs) {
        const lastPair = keyValuePairs[keyValuePairs.length - 1]

        for (const pair of keyValuePairs) {
          try {
            const jsonPair = JSON.parse(`{${pair}}`)
            console.log("jsonPair:", jsonPair)

            // Apply renaming rules for each key-value pair
            fileStore.applyRenamingRules(jsonPair)
          } catch (error) {
            // Ignore parsing errors for individual key-value pairs
          }
        }

        // Reset accumulatedLines to the remaining partial data after the last pair
        accumulatedLines = accumulatedLines.slice(
          accumulatedLines.indexOf(lastPair) + lastPair.length
        )
      }
    }
  }
}
