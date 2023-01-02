const Discord = require("discord.js");
const client = new Discord.Client();
const { parseTopOutput, updateMessage } = require("./system-usage");
const config = require("./config.json");

const intents = Discord.Intents.GUILDS | Discord.Intents.GUILD_MEMBERS;

const client = new Discord.Client({
  intents: intents
});

client.on("ready", async () => {
  const channel = client.channels.get(config.channelId);
  if (!channel) return;

  // Send the initial message and save the message ID
  const topOutput = await parseTopOutput();
  if (!topOutput) return;
  const message = await channel.send("", { embed: topOutput });
  if (!message) return;
  const messageId = message.id;

  // Update the message every 15 minutes
  setInterval(async () => {
    const topOutput = await parseTopOutput();
    if (!topOutput) return;
    updateMessage(channel, messageId, topOutput);
  }, 15 * 60 * 1000);
});

client.login(config.token);
