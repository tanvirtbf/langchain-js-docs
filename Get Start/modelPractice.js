import { tool } from "@langchain/core/tools";
import { initChatModel, createAgent } from "langchain";

const llmConfig = await initChatModel("openai/gpt-oss-120b", {
  modelProvider: 'groq',
  temperature: 0.2,
})

const model = createAgent({
  model: llmConfig,
  tools: []
})

console.log(await model.invoke({
  messages: [
    {
      role: 'human',
      content: 'Hi'
    }
  ]
}))