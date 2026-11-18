import { createAgent, initChatModel, SystemMessage } from "langchain";
import * as z from "zod";

const response = z.object({
    year: z.string(),
    team: z.string(),
})

const llm = await initChatModel("openai/gpt-oss-120b", {
    modelProvider: 'groq',
})

const model = createAgent({
    model: llm,
    tools: [],
    responseFormat: response,
    systemPrompt: new SystemMessage("You are a smart personal assistant who answers the asked question!")
})

const result = await model.invoke({
    messages: [
        {
            role: 'human',
            content: '10th fifa world cup winner'
        }
    ]
})

const res = JSON.parse(result.messages[result.messages.length-1].content)
console.log(res.title)