const { token } = require('./config.json');
const config = require('./config');
const { exec } = require('child_process');
const os = require('os');
const gamedig = require('gamedig');

const numCpus = os.cpus().length;
const channelId = config.channelId;

const { Client, GatewayIntentBits, EmbedBuilder, Message } = require('discord.js');
const { Status } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages]
});

client.on('ready', () => {
    const channel = client.channels.cache.get(channelId)
    channel.messages.fetch({ limit: 100 }).then(messages => {
        messages.forEach(message => {
            message.delete();
        });
    });
    console.log(`Logged in as ${client.user.tag}!`);
    client.channels.cache.get(channelId).send('I am online!')
    .then(sentMessage => {
        const messageId = sentMessage.id;    
        console.log(`The message ID is: ${messageId}`);
        setInterval(() => {
            
            // Get the message by ID
       // let message = `${messageId}`;
       client.channels.cache.get(channelId).messages.fetch(`${messageId}`)
       .then(message => {
           
        gamedig.query({
            type: 'valheim',
            host: 'localhost',
            port: '2456',
          }).then((server) => {
            const vhstatus = server.online ? ':red_circle:  Offline' : ':green_circle:  Online';
            const players = server.players.length;
            const ip = server.connect;

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
            
            // Get uptime
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
                 
                 /*
                 exec('sudo -u vhserver /home/vhserver/./vhserver dt', (error, stdout, stderr) => {
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
                        return
                      //  };
                         */
                         
                        let text = (`${stdout}`);
                  /*                             
                let status = text.match(/Status: (.*)/);
                console.log(status[1]); // Output: "STARTED"
                const statusvalheim = `${status[1]}`;
*/
                const embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('12Guys Gameserver')
                    .setDescription('Server status over all gameservers\n\n Running gameservers:\n- Valheim\n- Project Zomboid\n- Satisfactory')
                    .addFields(
                        { name: 'Total Uptime', value: `${Uptime}`, inline: true },
                        { name: 'Total Memory Usage', value: `${totalMemoryUsage}% | ${usedMemoryGb} Gb / ${totalMemoryGb} Gb`, inline: true },
                    )
                    .addFields(
                        //{ name: 'Status Valheim', value: status[1] , inline: false },
                       // { name: 'Status', value: `${vhstatus} ${statusvalheim}`, inline: true },
                        { name: 'Valheim status', value: `${vhstatus}`, inline: false },
                        { name: 'IP and Port', value: `[79.136.0.124:2456](steam://connect/79.136.0.124:2456 'Link to Steam connect')`, inline: true },
                        { name: 'Connected Players', value: `${players}/64` , inline: true },
                    )
                    .setTimestamp()
                    .setFooter({ text: 'Timestamp:', iconURL: 'https://www.dropbox.com/s/zis8oldi19r6thu/12G.png?dl=1' });

                // Edit the message with the updated embed
                message.edit({ embeds: [embed] });
                    });
                });
           });     
        }).catch((error) => {
            console.log(error);
    });        
   }, 900000); // Update every xx minute, specified in miliseconds
});
});
   
client.login(token);
