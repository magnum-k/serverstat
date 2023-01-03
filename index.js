const fs = require('fs');
const path = require('path');
const { Client, Collection, Events, GatewayIntentBits, Intents } = require('discord.js');
const { updateMessage } = require("./system-usage");
const config = require("./config.json");
const { token } = require('./config.json');

// const client = new Client({ intents: [GatewayIntentBits.Guild] });

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
  let isWelcomeMessage = msg.type === "GUILD_MEMBER_JOIN";

  if (isWelcomeMessage) {
    msg.author.send(`Welcome to the server, ${msg.author.username}!`);
    client.channels.cache
      .get("config.guildID")
      .send(`${msg.author.username} has joined the server!`);
  }

  let prefix = "!";
  let message = msg.content;

  let channel = msg.channelId;
  let botChannel = "config.guildId";
  
client.login(token);
