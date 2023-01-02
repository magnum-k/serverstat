const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { updateMessage } = require("./system-usage");
const config = require("./config.json");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.login(config.token);

client.on("ready", async () => {
  const guild = client.guilds.get(config.guildId);
  if (!guild) return;
  const channel = guild.channels.find(channel => channel.name === config.channelName);
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
