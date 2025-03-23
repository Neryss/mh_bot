const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js");

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
        embed.addField("Weaknesses: ")
        let weaknesses;
        let ailments;
        for (let i in monster.weaknesses)
        {
            if (monster.weaknesses[i].stars > 1)
            {
                if (!checkAilments(monster.weaknesses[i]))
                    weaknesses.push(monster.weaknesses[i].element)
                else
                    ailments.push(monster.weaknesses[i].element);
            }
        }
        for (let i in weaknesses)
            embed.addField(weaknesses[i].element, " : ", putStar(weaknesses[i].stars), true);
        embed.addField("\u200b", "\u200b");
        embed.addField("Ailments: ")
        for (let i in ailments)
            embed.addField(ailments[i].element, " : ", putStar(ailments[i].start), true);
        resolve(embed);
    })
}

module.exports = (db) => {
    return [
        {
            data: new SlashCommandBuilder()
                .setName("wilds")
                .setDescription("Search for a monster in MH: Wilds")
                .addStringOption(option => {
                    option.setName('name')
                        .setDescription("Name of the monster")
                        .setRequired(true)
                }),
            execute: async (interaction) => {
                const name = interaction.options.getString('name');
                const monster = db.getMonsterByName("wilds", name);
                if (monster)
                {
                    const embed = await createEmbedFromMonster(monster);
                    await interaction.reply({embeds: [embed]});
                }
                else
                    await interaction.reply("Monster not found!");
            }
        },
        {
            data: new SlashCommandBuilder()
            .setName("rise")
            .setDescription("Search for a monster in MH: Rise")
            .addStringOption(option => {
                option.setName('name')
                    .setDescription("Name of the monster")
                    .setRequired(true)
            }),
            execute: async (interaction) => {
                const name = interaction.options.getString('name');
                const monster = db.getMonsterByName("rise", name);
                if (monster)
                {
                    const embed = await createEmbedFromMonster(monster);
                    await interaction.reply({embeds: [embed]});
                }
                else
                    await interaction.reply("Monster not found!");
            }
        },
        {
            data: new SlashCommandBuilder()
            .setName("world")
            .setDescription("Search for a monster in MH: World")
            .addStringOption(option => {
                option.setName('name')
                    .setDescription("Name of the monster")
                    .setRequired(true)
            }),
            execute: async (interaction) => {
                const name = interaction.options.getString('name');
                const monster = db.getMonsterByName("world", name);
                if (monster)
                {
                    const embed = await createEmbedFromMonster(monster);
                    await interaction.reply({embeds: [embed]});
                }
                else
                    await interaction.reply("Monster not found!");
            }
        }
    ]
}