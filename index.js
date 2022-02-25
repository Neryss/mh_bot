const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

module.exports = client = new Client({intents: [Intents.FLAGS.GUILDS, 'GUILD_MESSAGES']});
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.login(process.env.DISCORD_TOKEN);
client.on('ready', () => {
	console.log("Logged in");
})