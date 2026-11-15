import { tool } from "@langchain/core/tools";
import { createAgent, initChatModel } from "langchain";
import { tool } from "@langchain/core/tools";
import * as z from "zod";

// Tools

const search = tool(({ query }) => `Search for ${query}`, {
  name: "Search",
  description: "Search for information",
  schema: z.object({ query: z.string() }), // ← এটা যোগ
});

// Model Configure
const model = await initChatModel("openai/gpt-oss-120b", {
  temperature: 0.2,
  modelProvider: "groq",
});

// Model Creation
const llm = createAgent({
  model,
  tools: [search],
});

// Invoke
const result = await llm.invoke({
  messages: [
    {
      role: "human",
      content: "what is the current weather in dhaka?",
    },
  ],
});

// Print

console.log(result);
