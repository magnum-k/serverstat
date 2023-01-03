const fs = require('fs');
const path = require('path');
const { token } = require('./config.json');

const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        // ...
    ]
})
// const client = new Client({ intents: [GatewayIntentBits.Guild] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
  let isWelcomeMessage = msg.type === "GUILD_MEMBER_JOIN";

  if (isWelcomeMessage) {
    msg.author.send(`Welcome to the server, ${msg.author.username}!`);
    client.channels.cache
      .get("1059518316084998254")
      .send(`${msg.author.username} has joined the server!`);
  }

  let prefix = "!";
  let message = msg.content;

  let channel = msg.channelId;
  let botChannel = "1059518316084998254";
  
    const sendMessage = (message) => {
    client.channels.cache.get(botChannel).send(message);
  };

  if (msg.author.username !== "Server-stats") {
    if (message.includes("no")) {
      msg.delete();
      sendMessage(`${msg.author.username} said no!`);
    }
    
    if (channel === botChannel) {
      if (message.startsWith(prefix)) {
        const command = message.slice(prefix.length).split(" ")[0];

        let admins = ["magnumk#6215"];

        // let isAdmin = `${msg.author.username}#${msg.author.discriminator}` in admins;
        let isAdmin = msg.member.roles.cache.find(
          (role) => role.name === "Admin"
        );

        switch (command) {
          case "stats":
            isAdmin
              ? sendMessage(`This server has ${msg.guild.memberCount} members`)
              : sendMessage("You are not an admin");
            break;

          case "help":
            sendMessage("This is a help command");
            break;
        }
      }
    } else {
      msg.channel.send("This is not a bot channel");
    }
  }

  // if (msg.content === "Hello") {
  //   sendMessage("Hello!");
  // }
});

client.login(token);
