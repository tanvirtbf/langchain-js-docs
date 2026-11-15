import { tool } from "@langchain/core/tools";
import { createAgent, initChatModel } from "langchain";
import * as z from "zod";

const search = tool(({ query }) => `Search for ${query}`, {
  name: "search",
  description: "Search for information",
  schema: z.object({ query: z.string() }),
});

const model = await initChatModel("openai/gpt-oss-120b", {
  modelProvider: "groq",
  temperature: 0.2,
  maxTokens: 1000,
});

const llm = createAgent({
  model: model,
  tools: [search],
});

const result = await llm.invoke({
  messages: [
    {
      role: "human",
      content: "Who is the prime minister in bangladesh?",
    },
  ],
});

console.log(result.messages[result.messages.length - 1].content);
