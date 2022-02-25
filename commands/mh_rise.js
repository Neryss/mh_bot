const { SlashCommandBuilder } = require('@discordjs/builders');
const mh = require('./mhw_search');
let embed;
const discord = require('discord.js')
const { MessageEmbed } = require("discord.js");
const fs = require('fs');

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
		if (data[i].icon)
		{
			try {
				weakness.setThumbnail("http://neryss.pw/icons/mhw-" + data[i].name.toLowerCase() + "_icon.png");
			}
			catch (err) {
				console.log("no thumbnail found for -" + data[i].name.toLowerCase() + "-!");
			}
		}
		e_inflicts = data[i].ailments;
		console.log(`data : ${data[i].ailments}`);
		console.log(`value : ${e_inflicts}`);
		for (var j = 0; j < e_inflicts.length; j++)
			weakness.addField(e_inflicts[j], "<:skull:880625774091178085>", true);
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

async function	treat_data(data, name, interaction)
{
	return new Promise (resolve => {
		var found = 0;
		for (var i = 0; i < data.length; i++)
		{
			if (data[i].name.toLowerCase() == name)
			{
				match_found(found, data, i);
				break;
			}
		}
		if (!found)
			resolve(1);
		resolve(0);
	})
}

function	rise_search(name, interaction)
{
	return new Promise(resolve => {
		console.log("Now searching through Rise...")
		fs.readFile("./db/rise_monster_db.json", async function (err, data) {
			try
			{
				data = JSON.parse(data);
				resolve(await treat_data(data, name, interaction));
			}
			catch(e)
			{
				console.log(e);
			}
		})
	})
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName("rise")
		.setDescription("Search for a MH Rise monster stats")
		.addStringOption(option =>
			option.setName('name')
			.setDescription("monster to search for")
			.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		const name = interaction.options.getString('name');
		for (var i = 0; i < name.length; i++)
			name[i].toLowerCase();
		await rise_search(name, interaction);
		if (embed)
			await interaction.editReply({embeds: [embed]});
		else
			await interaction.editReply("Monster not found...");
	}
}