const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("mhw")
		.setDescription("Search for a MHW monster stats")
		.addStringOption(option =>
			option.setName('name')
				.setDescription('monster to search for')
				.setRequired(true)),
	async execute(interaction) {
		interaction.reply("yikes it works mate");
	}
}