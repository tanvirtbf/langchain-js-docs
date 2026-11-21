import { tool } from "@langchain/core/tools"
import { createAgent, initChatModel } from "langchain"
import z from "zod"

const search = tool(
    ({ query }) => `Search for ${query}`,
    {
        name: 'search',
        description: 'Search for information',
        schema: z.object({
            query: z.string().describe("Search arguments")
        })
    }
)

const llm = await initChatModel("openai/gpt-oss-120b", {
    modelProvider: 'groq',
})

const model = createAgent({
    model: llm,
    tools: [search]
})

const result = await model.invoke({
    messages: [
        {
            role: 'human',v
            content: 'Hi'
        }
    ]
})

console.log(result.messages)