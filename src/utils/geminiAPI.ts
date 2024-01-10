import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = "AIzaSyDdOp7q9yJWppfASfsjgkjkRgQwetgqysc"
const genAI = new GoogleGenerativeAI(apiKey)

export async function callGeminiAPI(input) {
  // Constructing the prompt
  const prompt = `请将以下文件列表按照以下要求重新命名：\n${
    input.userInput
  }\n文件列表：\n${JSON.stringify(
    input.fileNames,
    null,
    2
  )}\n返回格式参考以下格式：{\n    "原始文件名称1": "重命名文件名称1",\n    "原始文件名称2": "重命名文件名称2"\n}\n不要加其他任何符号和文字、不能有空格、所有字符需要符合windows和mac的文件格式要求\n请以{作为回复开头，}作为回复结尾\n`

  console.log("input:", input)
  console.log("input.fileNames:", input.fileNames)

  console.log("prompt:", prompt)

  // Select the model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" })

  // Use streaming for faster interaction
  const result = await model.generateContentStream(prompt)

  let text = ""
  for await (const chunk of result.stream) {
    const chunkText = chunk.text()
    console.log("chunkText:", chunkText)

    text += chunkText

    // Implement logic to handle long responses or control token length if necessary
  }

  // 找到第一个大括号 '{' 的位置
  const startIndex = text.indexOf("{")
  // 找到最后一个大括号 '}' 的位置
  const endIndex = text.lastIndexOf("}")

  // 提取开始和结束括号之间的文本
  // 如果没有找到大括号，则整个文本保持不变
  const processedText =
    startIndex !== -1 && endIndex !== -1 ? text.slice(startIndex, endIndex + 1) : text

  return processedText
}
