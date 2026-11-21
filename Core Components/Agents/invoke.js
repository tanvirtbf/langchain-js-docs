import { tool } from "@langchain/core/tools";
import { MemorySaver } from "@langchain/langgraph";
import { initChatModel, createAgent } from "langchain";
import * as z from "zod";

const checkPointer = new MemorySaver(); // checkPointer er mane hocche ekta gudam jekhane akhn theke chaile state store korte parbe jate ager conversation mone rakhte pare.

const search = tool(({ query }) => `Search for ${query}`, {
  name: "Search_tool",
  description: "Search for information",
  schema: z.object({
    query: z.string().describe("Search Query"),
  }),
});

const llm = await initChatModel("openai/gpt-oss-120b", {
  modelProvider: "groq",
});

const agent = createAgent({
  model: llm,
  tools: [search],
  checkpointer: checkPointer, // agent ke ager state ekhane store korar kotha janano hocche
});

const result = await agent.invoke(
  {
    messages: [
      {
        role: "human",
        content: "Hi, I am Tanvir. A software Engineer",
      },
    ],
  },
  {
    configurable: { thread_id: "chat-1" },
  },
);

console.log(result.messages[result.messages.length - 1].content);
