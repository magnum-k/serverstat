const fs = require('fs');
const path = require('path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { updateMessage } = require("./system-usage");
const config = require("./config.json");
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.login(token);

client.on("ready", async () => {
  const guild = client.guilds.cache.get(config.guildId);
  if (!guild) return;
  const channel = guild.channels.cache.find(channel => channel.name === config.channelName);
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

client.on("message", async message => {
  if (message.content === config.updateCommand) {
    const topOutput = await updateMessage(client);
    if (!topOutput) return;
    updateMessage(channel, message, topOutput);
    }
  });
});
