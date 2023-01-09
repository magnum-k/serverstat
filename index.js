const { token } = require('./config.json');
const config = require('./config');
const { exec } = require('child_process');
const os = require('os');

const numCpus = os.cpus().length;

const { Client, GatewayIntentBits, EmbedBuilder, Message } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages]
});

client.on('ready', () => console.log(`${client.user.tag} has logged in`));

client.on('messageCreate', (message) => {
    if (message.content === '!update') {
        // Run command to get free memory
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

            exec('uptime -p', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error}`);
                    return;
                }
                if (stderr) {
                    console.error(`Error: ${stderr}`);
                    return;
                }
                /*if (stdout) {
                    console.log(`Uptime: ${stdout}`);
                    return;
                }*/
                 const Uptime = stdout;

                const embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('System Usage')
                    .setDescription('Total memory and CPU usage')
                    .addFields(
                        { name: 'Total CPU Usage', value: `${totalCpuUsage}%`, inline: true },
                        { name: 'Total Memory Usage', value: `${totalMemoryUsage}% | ${totalMemoryGb} Gb / ${usedMemoryGb} Gb`, inline: true },
                    )
                    .addFields(
                        { name: 'Top 5 processes', value: `${Uptime}`, inline: false }
                    )
                    .setTimestamp()
                    .setFooter({ text: 'Timestamp:', iconURL: 'https://www.dropbox.com/s/zis8oldi19r6thu/12G.png?dl=1' });

                message.channel.send({ embeds: [embed] });
            });
        });
    }
});

client.login(token);
