import OpenAI from "openai";
import dotenv from "dotenv";

// Load env
dotenv.config({ path: ".env.local" });

const API_KEY = process.env.NEBIUS_API_KEY;
const BASE_URL = "https://api.studio.nebius.ai/v1/";

console.log("--- NEBIUS MODEL LIST TEST ---");
console.log(`Using Base URL: ${BASE_URL}`);

if (!API_KEY) {
    console.error("ERROR: NEBIUS_API_KEY is missing.");
    process.exit(1);
}

const client = new OpenAI({
    baseURL: BASE_URL,
    apiKey: API_KEY,
});

async function listModels() {
    try {
        const response = await client.models.list();
        console.log("\n✅ AVAILABLE MODELS:");
        
        const embeddings = response.data.filter(m => m.id.includes('embed') || m.id.includes('bge') || m.id.includes('e5'));
        const chat = response.data.filter(m => !embeddings.includes(m));

        console.log("\n🔍 EMBEDDING CANDIDATES (Look for these):");
        if (embeddings.length > 0) {
            embeddings.forEach(m => console.log(` - ${m.id}`));
        } else {
            console.log(" - No obvious embedding models found (checked for 'embed', 'bge', 'e5').");
            console.log(" - Here is the full list to check manually:");
            response.data.forEach(m => console.log(`   - ${m.id}`));
        }

        console.log("\n💬 CHAT MODELS:");
        chat.slice(0, 5).forEach(m => console.log(` - ${m.id}`));
        console.log(` ... and ${chat.length - 5} more.`);

    } catch (error: any) {
        console.error("\n❌ FAILED:");
        console.error(error.message);
    }
}

listModels();
