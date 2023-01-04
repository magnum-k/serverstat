const { token } = require('./config.json');
const config = require('./config');
const { exec } = require('child_process');
const os = require('os');

const numCpus = os.cpus().length;

const { Client, GatewayIntentBits, EmbedBuilder, Message } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages,]
});

client.on('ready', () => console.log(`${client.user.tag} has logged in`));

client.on('messageCreate', (message) => {
  //  if (message.author.bot) return;
    
 //   const embed = new EmbedBuilder()
//        .setDescription('Hello, Wordl!');
//    message.channel.send({ embeds: [embed] });

if (message.content === '!update') {
exec('ps -Ao %cpu,%mem', (error, stdout, stderr) => {
if (error) {
console.error(`Error: ${error}`);
return;
}

// Calculate the total CPU usage in percent
const cpuUsageLines = stdout.split('\n').slice(1);
let totalCpuUsage = 0;
cpuUsageLines.forEach((line) => {
totalCpuUsage += parseFloat(line.split(' ')[0]);
});
totalCpuUsage = (totalCpuUsage / numCpus).toFixed(2);

exec('free -m', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error}`);
    return;
  }

        // Calculate the total memory usage in percent
  const memoryUsageLines = stdout.split('\n');
  const totalMemory = parseInt(memoryUsageLines[1].split(' ')[1]);
  const usedMemory = parseInt(memoryUsageLines[2].split(' ')[2]);
  const totalMemoryUsage = ((usedMemory / totalMemory) * 100).toFixed(2);

      const embed = new EmbedBuilder()
        .setTitle('System Usage')
        .addFields(
          { name: 'Total CPU Usage', value: `${totalCpuUsage}%`, inline: true },
          { name: 'Total Memory Usage', value: `${totalMemoryUsage}%`, inline: true }
        );

      message.channel.send({ embeds: [embed] });
    });
  });
}

function getTop5Processes(lines) {
  const top5Lines = lines.slice(7, 12);
  return top5Lines.join('\n');
}
    });
    
client.login(token);
