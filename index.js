const Eris = require("eris");
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
const openai = new OpenAIApi(configuration);

const bot = new Eris(process.env.DISCORD_BOT_TOKEN, {
    intents: [
        "guildMessages"
    ]
});

let context = "Hello! How can I assist you today?\n\ncaiiiooo: você pode falar em portugues?\nGPT OpenAI: Sim, eu posso falar em português. Em que posso ajudar você hoje?.\n\n\ncaiiiooo: Estou procurando por ideias para escrever uma história.\nGPT OpenAI: Claro, adoraria ajudá-lo com isso. Você já tem algum tema em mente?\n";

async function runCompletion (message) {
    const prompt = context + message;
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 200,
    });
    const result = completion.data.choices[0].text;
    context = prompt + result;
    return result;
}

bot.on("ready", () => {
    console.log("Bot is connected and ready!");
});

bot.on("error", (err) => {
  console.error(err);
});

bot.on("messageCreate", (msg) => {
    if(msg.content.startsWith("#")) {
        runCompletion(msg.content.substring(1)).then(result => bot.createMessage(msg.channel.id, result));
    }
});

bot.connect();