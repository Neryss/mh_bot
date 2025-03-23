const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js");

function putStar(nb) {
    return Array(nb + 1).join("<:star:880281496315899955>");
}

function checkAilments(weak) {
    return ["poison", "sleep", "paralysis", "blast", "stun"].includes(weak.element);
}

async function createEmbedFromMonster(monster) {
    return new Promise((resolve) => {
        let embed = new MessageEmbed()
            .setColor("#ff0080")
            .setTitle(monster.name);

        // Inflicts
        if (monster.ailments.length > 0) {
            embed.addField("Inflicts:", "\u200b");
            for (let ailment of monster.ailments) {
                embed.addField(ailment.name || ailment, "<:skull:880625774091178085>", true);
            }
        }

        // Resistances
        if (monster.resistances.length > 0) {
            embed.addField("\u200b", "\u200b");
            embed.addField("Resistances:", "\u200b");
            for (let res of monster.resistances) {
                embed.addField(res.element, "<:shield:883134123898732554>", true);
            }
        }

        // Weaknesses & Ailments
        let weaknesses = [];
        let ailments = [];

        for (let weakness of monster.weaknesses) {
            if (weakness.stars > 1) {
                if (checkAilments(weakness)) {
                    ailments.push(weakness);
                } else {
                    weaknesses.push(weakness);
                }
            }
        }

        if (weaknesses.length > 0) {
            embed.addField("\u200b", "\u200b");
            embed.addField("Weaknesses:", "\u200b");
            for (let weak of weaknesses) {
                embed.addField(weak.element, putStar(weak.stars), true);
            }
        }

        if (ailments.length > 0) {
            embed.addField("\u200b", "\u200b");
            embed.addField("Ailments:", "\u200b");
            for (let ail of ailments) {
                embed.addField(ail.element, putStar(ail.stars), true);
            }
        }

        resolve(embed);
    });
}

async function wildsSearch(db, name) {
    return new Promise((resolve, reject) => {
        try {
            const monster_info = db.getMonsterByName("wilds", name);
            resolve(monster_info);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = (db) => ({
    data: new SlashCommandBuilder()
        .setName("wilds")
        .setDescription("Search for a MH: Wilds monster stats")
        .addStringOption(option =>
            option.setName('name')
                .setDescription("Monster to search for")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply();
        const name = interaction.options.getString('name').toLowerCase();

        try {
            const monster = db.getMonsterByName("wilds", name);
            console.log("Monster: ", JSON.stringify(monster, null, 4));

            if (monster) {
                const embed = await createEmbedFromMonster(monster);
                await interaction.editReply({ embeds: [embed] });
            } else {
                await interaction.editReply("Monster not found...");
            }
        } catch (error) {
            console.error("Error fetching monster:", error);
            await interaction.editReply("An error occurred while searching for the monster.");
        }
    }
});
