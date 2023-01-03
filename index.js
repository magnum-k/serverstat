const { token } = require('./config.json');
const config = require('./config');
const { exec } = require('child_process');

const { Client, GatewayIntentBits, EmbedBuilder, Message } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages,]
});

client.on('ready', () => console.log(`${client.user.tag} has logged in`));

client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    
 //   const embed = new EmbedBuilder()
//        .setDescription('Hello, Wordl!');
//    message.channel.send({ embeds: [embed] });
//});
 if (message.content === '!update') {
   exec('top -bn1', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error}`);
        return;
      }

      const lines = stdout.split('\n');
      const totalMemoryUsage = lines[0];
      const totalCpuUsage = lines[1];
      const top5Processes = getTop5Processes(lines);

      const embed = new EmbedBuilder()
        .setTitle('System Usage')
        .addFields(
          { name: 'Total CPU Usage', value: totalCpuUsage, inline: true },
          { name: 'Total Memory Usage', value: totalMemoryUsage, inline: true },
          { name: 'Top 5 Processes', value: top5Processes, inline: false }
        );

    message.channel.send({ embeds: [embed] });
    });
 // })
//});

function getTop5Processes(lines) {
  const top5Lines = lines.slice(7, 12);
  return top5Lines.join('\n');
}
);
client.login(token);

