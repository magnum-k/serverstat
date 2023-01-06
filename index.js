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

    //Run command to get free memory
exec('free -m', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error}`);
    return;
  }

        // Calculate the total memory usage in percent
  const memoryUsageLines = stdout.split('\n');
  const totalMemory = parseInt(memoryUsageLines[1].match(/(\d+)/g)[0]);
  const usedMemory = parseInt(memoryUsageLines[1].match(/(\d+)/g)[1]);
  const totalMemoryUsage = ((usedMemory / totalMemory) * 100).toFixed(2);
  const totalMemoryGb = (totalMemory / 1024).toFixed(0);
  const usedMemoryGb = (usedMemory / 1024).toFixed(0);
    
        //Added new code to get top 5 processes
      const command = 'top -b -n1'

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`)
      return
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`)
      return
    }

    const { mem, cpu, processes } = parseTopOutput(stdout)

    const memoryUsage = mem.used / mem.total * 100
    const cpuUsage = cpu[0].idle / cpu[0].total * 100
    const top5Processes = processes
      .slice(0, 5)
      .map((p) => `${p.pid} ${p.user} ${p.cpu} ${p.mem} ${p.command}`)
      .join('\n');
    
let uptime;

exec('uptime -p', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`Error: ${stderr}`);
    return;
  }
  uptime = `Uptime: ${stdout}`;
  console.log(uptime);
});

const Uptime = uptime

      const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('System Usage')
        .setDescription('Total memory and CPU usage')
        .addFields(
          { name: 'Total CPU Usage', value: `${totalCpuUsage}%`, inline: true },
          { name: 'Total Memory Usage', value: `${totalMemoryUsage}% | ${totalMemoryGb} Gb / ${usedMemoryGb} Gb`, inline: true },
        )
          .addFields(
          { name: 'Top 5 processes', value: `${uptime}`, inline: false }
        )
        .setTimestamp()
        .setFooter({ text: 'Timestamp:', iconURL: 'https://www.dropbox.com/s/zis8oldi19r6thu/12G.png?dl=1' });
        
        
      message.channel.send({ embeds: [embed] });
    });
  });
    
    const parseTopOutput = output => {
  const lines = output.split('\n')

  const mem = {
    total: parseInt(lines[0].match(/\d+/g)[0]),
    used: parseInt(lines[0].match(/\d+/g)[1]),
  }

  const cpu = lines[1]
    .trim()
    .split(',')
    .map((u) => ({
      user: parseInt(u.match(/\d+/g)[0]),
      nice: parseInt(u.match(/\d+/g)[1]),
      system: parseInt(u.match(/\d+/g)[2]),
      idle: parseInt(u.match(/\d+/g)[3]),
      total:
        parseInt(u.match(/\d+/g)[0]) +
        parseInt(u.match(/\d+/g)[1]) +
        parseInt(u.match(/\d+/g)[2]) +
        parseInt(u.match(/\d+/g)[3]),
    }))

  const processes = lines
    .slice(7)
    .map((l) => {
      const [pid, user, cpu, mem, ...rest] = l.trim().split(/\s+/)
      return { pid, user, cpu, mem, command: rest.join(' ') }
    })

  return { mem, cpu, processes }
}
    });
    
    
}

function getTop5Processes(lines) {
  const top5Lines = lines.slice(7, 12);
  return top5Lines.join('\n');
}
    });
    
client.login(token);
