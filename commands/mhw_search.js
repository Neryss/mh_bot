const { SlashCommandBuilder } = require('@discordjs/builders');
const { match } = require('assert');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
let embed;

function	put_star(nb)
{
	return (Array(nb + 1).join("<:star:880281496315899955>"));
}

function check_ailments(weak)
{
	if (weak.element == "poison" || weak.element == "sleep"
	|| weak.element == "paralysis" || weak.element == "blast"
	|| weak.element == "stun")
		return (true);
	return (false);
}

function	match_found(found, data, i)
{
	return new Promise (resolve => {
		found++;
		weakness = new MessageEmbed()
		.setColor("#ff0080")
		.setTitle(data[i].name)
		.addField("Inflicts : ", "(ailments inflicted by the monster)");
		try {
			console.log(data[i].name.toLowerCase());
			weakness.setThumbnail("http://neryss.pw/icons/mhw-" + data[i].name.toLowerCase().replaceAll(" ", "_") + "-icon.png");
		}
		catch (err) {
			console.log("no thumbnail found for -" + data[i].name.toLowerCase() + "-!");
		}
		e_inflicts = data[i].ailments;
		for (var j = 0; j < e_inflicts.length; j++)
			weakness.addField(e_inflicts[j].name, "<:skull:880625774091178085>", true);
		weakness.addField("\u200b", "----------------------------------------------------------")
			.addField("Resist to : ", "(resistances or immunities of the monster)")
		e_resist = data[i].resistances;
		for (var j = 0; j < e_resist.length; j++)
			weakness.addField(e_resist[j].element, "<:shield:883134123898732554>", true);
		weakness.addField("\u200b", "----------------------------------------------------------");
		e_weak = data[i].weaknesses;
		weakness.addField("Weaknesses :", "(absent elements = resist/no effects)");
		for (var j = 0; j < e_weak.length; j++)
			if (e_weak[j].stars > 1 && !check_ailments(e_weak[j]))
				weakness.addField(e_weak[j].element + " : ", put_star(e_weak[j].stars), true);
		weakness.addField('\u200b', '----------------------------------------------------------')
		.addField("Ailments :", "(absent elements = resist/no effects)");
		for (j = 0; j < e_weak.length; j++)
			if (e_weak[j].stars > 1 && check_ailments(e_weak[j]))
				weakness.addField(e_weak[j].element + " : ", put_star(e_weak[j].stars), true);
		embed = weakness;
	});
}

function	search_db(data, name, interaction)
{
	return new Promise(resolve => {
		var found = 0;
		console.log(data.length);
		for (i = 0; i < data.length; i++)
		{
			if (data[i].name.toLowerCase() == name)
			{
				match_found(found, data, i);
				break ;
			}
		}
		if (!found)
			resolve(1);
		resolve(0);
	})
}

function	treat_data(name, interaction)
{
	return new Promise(resolve => {
		fs.readFile("./db/mhw_db.json", async function (err, data) {
			try
			{
				data = JSON.parse(data);
				console.log("Treating data...");
				resolve(await search_db(data, name, interaction));

			} catch (error) {
				console.error(error);
			}
		})
	})
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName("mhw")
		.setDescription("Search for a MHW monster stats")
		.addStringOption(option =>
			option.setName('name')
				.setDescription('monster to search for')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		const name = interaction.options.getString('name');
		for (i = 0; i < name.length; i++)
			name[i].toLowerCase();
		await treat_data(name, interaction);
		if (embed)
			await interaction.editReply({embeds: [embed]});
		else
			await interaction.editReply("Monster not found!");
	}
}