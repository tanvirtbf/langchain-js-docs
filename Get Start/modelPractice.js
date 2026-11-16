import { tool } from "@langchain/core/tools";
import { initChatModel, createAgent } from "langchain";
import * as z from "zod";

const search = tool(
  ({ query }) => `Search for ${query}`,
  {
    name: 'web_search',
    description: 'Search for information',
    schema: z.object({
      query: z.string().describe("Search for Information")
    })
  }
)

const llmConfig = await initChatModel("openai/gpt-oss-120b", {
  modelProvider: 'groq',
  temperature: 0.2,
})

const model = createAgent({
  model: llmConfig,
  tools: [search]
})

console.log(await model.invoke({
  messages: [
    {
      role: 'human',
      content: 'Hi'
    }
  ]
}))