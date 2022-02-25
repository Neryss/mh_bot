const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const commands = [];
require('dotenv').config();

module.exports = client = new Client({ intents: [Intents.FLAGS.GUILDS, 'GUILD_MESSAGES'] });
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
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
				Routes.applicationCommands(process.env.CLIENT_ID),
				{ body: commands },
			);
			console.log("Commands registered");
		} catch (err) {
			console.log(err);
		}
	})();
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand())
		return ;
	const command = client.commands.get(interaction.commandName);
	if (!command)
		return;
	try
	{
		await command.execute(interaction);
	} catch (err) {
		console.error(err);
		await interaction.reply({
			content: "An error has occured!",
			ephemeral: true
		});
	}
})