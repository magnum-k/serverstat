const fs = require('fs');
const path = require('path');
const { token } = require('./config.json');
const config = require('./config');
const { updateMessage } = require("./system-usage");
const os = require('os');

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent
        // ...
    ]
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  if (message.content === '!update') {
    const totalMemoryUsage = os.totalmem();
    const totalCpuUsage = os.cpus().length;
    const top5Processes = getTop5Processes();

    const embed = new EmbedBuilder()
      .setTitle('System Usage')
      .addFields(
        { name: 'Total CPU Usage', value: totalCpuUsage, inline: true },
        { name: 'Total Memory Usage', value: totalMemoryUsage, inline: true },
        { name: 'Top 5 Processes', value: top5Processes, inline: false }
      );

    message.channel.send({ embeds: [embed] });
  }
});

function getTop5Processes() {
  // TODO: Implement this function
  return 'Not implemented';
}

client.login(token);

