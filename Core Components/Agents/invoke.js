import { tool } from "@langchain/core/tools";
import { MemorySaver } from "@langchain/langgraph";
import { initChatModel, createAgent } from "langchain";
import * as z from "zod";

const checkPointer = new MemorySaver(); // checkPointer er mane hocche ekta gudam jekhane akhn theke chaile state store korte parbe jate ager conversation mone rakhte pare.

const search = tool(
  ({ query, config }) => {
    console.log(config.context)
    if (config.context?.userId === "1") {
      return "Search for Tanvir Ahmed Right ? Tanvir Ahmed is a Software Engineer . ";
    } else if (config.context?.userId === "2") {
      return "Searach for Sadia right ? Sadia is a crocheter. ";
    }
  },
  {
    name: "Search_tanvir",
    description: "Search for Tanvir Ahmed",
    schema: z.object({
      query: z.string().describe("Search Query for Tanvir Ahmed"),
    }),
  },
);

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
        content: "Who is Tanvir Ahmed ? ",
      },
    ],
  },
  {
    configurable: { thread_id: "chat-1" },
    context: { userId: "1", userName: "Tanvir Ahmed", userAge: "27" },
  },
);

// const result2 = await agent.invoke(
//   {
//     messages: [
//       {
//         role: "human",
//         content: "who am i?",
//       },
//     ],
//   },
//   {
//     configurable: { thread_id: "chat-1" },
//   },
// );

console.log(result.messages[result.messages.length - 1].content, "\n\n\n");
// console.log(result2.messages[result2.messages.length - 1].content);
