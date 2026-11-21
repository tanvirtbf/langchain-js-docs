import { tool } from "@langchain/core/tools";
import { MemorySaver } from "@langchain/langgraph";
import { createAgent, initChatModel } from "langchain";
import * as z from "zod";

const checkPointer = new MemorySaver();

const search = tool(({ query }) => `Search for ${query}`, {
  name: "search_for_internet",
  description: "Search for Information",
  schema: z.object({
    query: z.string().describe("Query for search"),
  }),
});

const llm = await initChatModel("openai/gpt-oss-120b", {
  modelProvider: "groq",
});

const model = createAgent({
  model: llm,
  tools: [search],
  checkpointer: checkPointer,
});

const result = await model.invoke(
  {
    messages: [
      {
        role: "human",
        content: "I am Tanvir",
      },
    ],
  },
  {
    configurable: { thread_id: "chat-1" },
    context: { userId: "chat-1" },
  },
);

const result2 = await model.invoke({
    messages: [
        {
            role: 'human',
            content: 'Who am i?'
        }
    ]
}, {
    configurable: { thread_id: 'chat-1' },
    context: { userId: 'chat-1' }
})

console.log("Result 1: ",result.messages[result.messages.length - 1].content);
console.log("Result 2: ",result2.messages[result2.messages.length - 1].content);
