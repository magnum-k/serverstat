const Discord = require("discord.js");
const { updateMessage } = require("./system-usage");
const config = require("./config.json");

const intents = new Discord.Intents();
intents.add(Discord.Intents.GUILDS);
intents.add(Discord.Intents.GUILD_MEMBERS);

const client = new Discord.Client({
  intents: intents
});

client.on("ready", async () => {
  const channel = client.channels.get(config.channelId);
  if (!channel) return;

  // Send the initial message and save the message ID
  const topOutput = await updateMessage(client);
  if (!topOutput) return;
  const message = await channel.send("", { embed: topOutput });
  if (!message) return;
  const messageId = message.id;

  // Update the message every 15 minutes
  setInterval(async () => {
    const topOutput = await updateMessage(client);
    if (!topOutput) return;
    updateMessage(channel, message, topOutput);
  }, 15 * 60 * 1000);
});

client.login(config.token);
