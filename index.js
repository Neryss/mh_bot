const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require("discord-api-types/v9");
const DbHandler = require('./srcs/db_handler');

const commands = [];

async function main() {
    try {
        const mh_db = new DbHandler("./monster_hunter_db");
        await mh_db.initDbs();

        console.log(mh_db.getMonsterByName("wilds", "Ajarakan"));

        const client = new Client({
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
        });

        client.commands = new Collection();

        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const commandFactory = require(`./commands/${file}`);
            const command = commandFactory(mh_db);
            commands.push(command.data.toJSON());
            client.commands.set(command.data.name, command);
        }

        client.login(process.env.DISCORD_TOKEN);

        client.once('ready', async () => {
            console.log(`Logged in as ${client.user.tag}`);

            const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);
            try {
                await rest.put(
                    Routes.applicationCommands(process.env.CLIENT_ID),
                    { body: commands }
                );
                console.log("Commands registered successfully.");
            } catch (err) {
                console.error("Failed to register commands:", err);
            }
        });

        client.on('interactionCreate', async interaction => {
            if (!interaction.isCommand()) return;

            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (err) {
                console.error("Command execution error:", err);
                await interaction.reply({
                    content: "An error occurred while executing the command!",
                    ephemeral: true
                });
            }
        });

    } catch (error) {
        console.error("Error during bot startup:", error);
    }
}

main();
