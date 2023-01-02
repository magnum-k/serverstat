const Discord = require("discord.js");
const { updateMessage } = require("./system-usage");
const config = require("./config.json");

const intents = Discord.Intents.GUILDS | Discord.Intents.GUILD_MEMBERS;

const client = new Discord.Client({
  intents: intents
});

client.on("ready", async () => {
  const channel = client.channels.get(config.channelId);
  if (!channel) return;

  // Send the initial message and save the message object
  const message = await channel.send("Updating system usage...");
  if (!message) return;

  // Update the message every 15 minutes
  setInterval(async () => {
    updateMessage(channel, message);
  }, 15 * 60 * 1000);
});

client.login(config.token);
