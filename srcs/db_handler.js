const fs = require("fs");
const path = require("path");

const WORLD = "world";
const RISE = "rise";

class   Monster
{
    id;
    name;
    description;
    elements = [];
    ailments = [];
    resistances = [];
    weaknesses = [];

    setInfo(json)
    {
        this.id = json.id;
        this.name = json.name;
        this.description = json.description;
        this.elements = json.elements;
        this.ailments = json.ailments;
        this.resistances = json.resistances;
        this.weaknesses = json.weaknesses;
    }
}

class   DbHandler
{
    path;
    wilds_monsters;
    world_monsters;
    rise_monsters;
    constructor(path)
    {
        this.path = path;
    }

    listFromDb(game)
    {
        return new Promise((resolve, reject) => {
            let mobs = [];
            fs.readFile(path.join(this.path, game), "utf-8", (err, data) => {
                if (err)
                    reject(err);
                var db = JSON.parse(data);
                for (let item in db)
                    mobs.push(this.treatMonster(db[item]));
                resolve(mobs);
            });
        });
    }

    treatMonster(monster_json)
    {
        let a_monster = new Monster();
        a_monster.setInfo(monster_json);
        return(a_monster)
    }

    getMonsterByName(game, name)
    {
        let monster_list;
        if (game == WORLD)
            monster_list = this.world_monsters;
        else if (game == RISE)
            monster_list = this.rise_monsters;
        else if (game == "wilds")
            monster_list = this.wilds_monsters
        for (const monster in monster_list)
            if (monster_list[monster].name.toLowerCase() == name.toLowerCase())
                return(monster_list[monster]);
        return("Monster not found!");
    }

    getMonsterById(game, id)
    {
        let monster_list;
        if (game == WORLD)
            monster_list = this.world_monsters;
        else if (game == RISE)
            monster_list = this.rise_monsters;
        else if (game == "wilds")
            monster_list = this.wilds_monsters;
        for (const monster in monster_list)
            if (monster_list[monster].id == id)
                return(monster_list[monster]);
        return("Monster not found!");
    }

    initDbs()
    {
        return new Promise(async(resolve, reject) => {
            try
            {
                this.world_monsters = await this.listFromDb("mhw_db.json");
                this.rise_monsters = await this.listFromDb("rise_monster_db.json");
                this.wilds_monsters = await this.listFromDb("wilds_monster_db.json");
                resolve();
            }
            catch(error)
            {
                reject(error);
            }
        })
    }
}

async function main()
{
    new_db = new DbHandler("./monster_hunter_db");
    try
    {
        await new_db.initDbs();
        console.log(new_db.getMonsterByName(WORLD, "Rajang"));
        console.log(new_db.getMonsterByName(RISE, "Mizutsune"));
    }
    catch(error)
    {
        console.error("Could not initialize dbs: ", error);
    }
}

// main();

module.exports = DbHandler;