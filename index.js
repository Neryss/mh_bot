const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const commands = [];
require('dotenv').config();

module.exports = client = new Client({ intents: [Intents.FLAGS.GUILDS, 'GUILD_MESSAGES'] });
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
console.log(commandFiles);
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
}

const { REST } = require('@discordjs/rest');
const { Routes } = require("discord-api-types/v9");

client.login(process.env.DISCORD_TOKEN);
client.on('ready', () => {
	console.log("Logged in");
	const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

	(async () => {
		try {
			await rest.put(
				// Routes.application
				Routes.applicationGuildCommands(process.env.CLIENT_ID),
				{ body: commands },
			);
			console.log("Commands registered");
		} catch (err) {
			console.log(err);
		}
	})();
})