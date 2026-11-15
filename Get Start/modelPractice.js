import { tool } from "@langchain/core/tools";
import { createAgent } from "langchain";
import * as z from 'zod'

const search = tool(({ query }) => `Search for ${query}`, {
  name: "search",
  description: "Search for information",
  schema: z.object({ query: z.string() }),
});

const model = createAgent({
  model: "groq:openai/gpt-oss-120b",
  tools: [search],
});

const result = await model.invoke({
    messages: [
        {
            role: 'human',
            content: 'Who is the prime minister in bangladesh?'
        }
    ]
})

console.log(result.messages[result.messages.length-1].content)