// scripts/test-nebius.ts
import OpenAI from "openai";
import dotenv from "dotenv";

// Load .env.local
dotenv.config({ path: ".env.local" });

const API_KEY = process.env.NEBIUS_API_KEY;
const BASE_URL = "https://api.studio.nebius.ai/v1/"; // Standard Studio URL
// const BASE_URL = "https://api.tokenfactory.nebius.com/v1/"; // Alternative URL you mentioned

console.log("--- NEBIUS CONNECTION TEST ---");
console.log(`API Key Present: ${!!API_KEY}`);
console.log(`Using Base URL: ${BASE_URL}`);

if (!API_KEY) {
    console.error("ERROR: NEBIUS_API_KEY is missing in .env.local");
    process.exit(1);
}

const client = new OpenAI({
    baseURL: BASE_URL,
    apiKey: API_KEY,
});

async function runTest() {
    try {
        console.log("\n1. Testing List Models...");
        const models = await client.models.list();
        console.log("✅ Success! Found models:");
        models.data.forEach(m => console.log(` - ${m.id}`));

        const targetModel = "meta-llama/Meta-Llama-3.1-70B-Instruct";
        console.log(`\n2. Testing Chat Completion with ${targetModel}...`);

        const completion = await client.chat.completions.create({
            model: targetModel,
            messages: [{ role: "user", content: "Hello, are you working?" }],
            max_tokens: 50
        });

        console.log("✅ Success! Response:");
        console.log(completion.choices[0].message.content);

    } catch (error: any) {
        console.error("\n❌ FAILURE:");
        console.error(`Status: ${error.status}`);
        console.error(`Message: ${error.message}`);
        
        if (error.status === 404) {
            console.log("\nDEBUG TIP: A 404 on 'List Models' usually means the Base URL is wrong.");
            console.log("Try changing BASE_URL to 'https://api.studio.nebius.ai/v1/' or remove '/v1/'");
        }
    }
}

runTest();
