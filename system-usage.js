const { exec } = require('child_process')
const Discord = require('discord.js')
const { EmbedBuilder } = require('discord.js');

const updateMessage = async (client, message) => {
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
      .join('\n')

    const embed = new EmbedBuilder()
      .setColor(#0099ff)
      .setTitle('System Usage')
      .addFields(
        { name: 'CPU', value: `${cpuUsage}%`, inline: true },
        { name: 'Memory', value: `${memoryUsage}%`, inline: true },
      )
      .addField('Top 5 Processes:', top5Processes)

    message.edit({ embeds: [embed] });
  })
}

const parseTopOutput = (output) => {
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

module.exports = {
  updateMessage
}
