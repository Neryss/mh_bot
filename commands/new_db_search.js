const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js");
const DbHandler = require("../srcs/db_handler");
db = new DbHandler("./monster_hunter_db");
await db.initDbs();

function	putStar(nb)
{
	return (Array(nb + 1).join("<:star:880281496315899955>"));
}

function checkAilments(weak)
{
	if (weak.element == "poison" || weak.element == "sleep"
	|| weak.element == "paralysis" || weak.element == "blast"
	|| weak.element == "stun")
		return (true);
	return (false);
}

async function  createEmbedFromMonster(monster)
{
    return new Promise((resolve, reject) => {
        let embed = new MessageEmbed();
        embed.setColor("#ff0080");
        embed.setTitle(monster.name);
        // try
        // {
        //     weakness.setThumbnail("http://neryss.pw/icons/mhw-" + data[i].name.toLowerCase().replaceAll(" ", "_") + "-icon.png");
        // }
        // catch(error)
        // {
        //     console.error("Could not set thumbnail: ", error);
        // }
        embed.addField("Inflicts: ")
        for (let i in monster.ailments)
            embed.addField(monster.ailments[i], "<:skull:880625774091178085>", true);
        embed.addField("\u200b", "\u200b");
        for (let i in monster.resistances)
        embed.addField("Reistances: ")
            embed.addField(monster.resistances[i], "<:shield:883134123898732554>", true)
        embed.addField("\u200b", "\u200b");
        for (let i in monster.weaknesses)
            if (monster.weaknesses[i].stars > 1 && !checkAilments(monster.weaknesses[i]))
                embed.addField
    })
}

async function wildsSearch(name)
{
    return new Promise((resolve, reject) => {
        try
        {
            const monster_info = db.getMonster(name);
            resolve(monster_info);
        }
        catch(error)
        {
            reject(error);
        }
    })
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("Wilds")
        .setDescription("Search for a MH: Wilds monster stats")
        .addStringOption(option =>
            option.setName('name')
            .setDescription("monster to search for")
            .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const name = interaction.options.getString('name');
        for (var i = 0; i < name.length; i++)
            name[i].toLowerCase();
        let temp = await wildsSearch(name);
        if (!temp)
            await interaction.editReply({embeds: [embed]});
        else
            await interaction.editReply("Monster not found...");
    }
}