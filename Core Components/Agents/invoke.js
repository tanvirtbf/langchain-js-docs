import * as readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";
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

const agent = createAgent({
  model: llm,
  tools: [search],
  checkpointer: checkPointer,
});

// পুরো কথোপকথনে একই config, তাই agent আগের কথা মনে রাখবে
const config = { configurable: { thread_id: "chat-1" } };

const rl = readline.createInterface({ input, output, prompt: "You: " });

console.log('চ্যাট শুরু। শেষ করতে "End" লিখুন।\n');
rl.prompt();

for await (const line of rl) {
  const userInput = line.trim();

  if (userInput.toLowerCase() === "end") break;        // End / end / END সবই চলবে
  if (userInput === "") {                              // ফাঁকা Enter হলে আবার জিজ্ঞেস
    rl.prompt();
    continue;
  }

  try {
    const result = await agent.invoke(
      { messages: [{ role: "human", content: userInput }] },
      config,
    );
    console.log(`AI: ${result.messages.at(-1).text}\n`);
  } catch (err) {
    // একটা error হলে (যেমন rate limit) পুরো চ্যাট যেন বন্ধ না হয়
    console.error(`Error: ${err.message}\n`);
  }

  rl.prompt();
}

rl.close();
console.log("চ্যাট শেষ।");