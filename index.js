const Discord = require("discord.js");
const client = new Discord.Client();
const { parseTopOutput, updateMessage } = require("./system-usage");

client.on("ready", async () => {
  const channel = client.channels.get("YOUR_CHANNEL_ID_HERE");
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

client.login("YOUR_TOKEN_HERE");
