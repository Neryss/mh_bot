# mh_bot
Discord monster hunter bot

This project is undergoing a "massive" rework along the whole database for the new game (Wilds), the currently deployed version for public discord usage is the reworked one, some things are missing (such as monsters pictures), and I didn't have much time to test errors etc... 
If you see some, feel free to contact me or fill an issue!

# Install and launch
Since I'm not able to currently host the bot myself, you can clone this repository and use the bot without any issue!
If you want to use it publicly and/or modify it, I would appreciate if you can credit me :D

In the Database section further down, there should be a link to invite the bot to your server but the bot is currenty offline, I'm hosting it on my server and have some issues right now, it should be back in a month if you want to wait so you don't have to handle the hosting part!
You should be able to install the package list with `npm install`, then just create a `.env` file in the root folder of the repo using the [template.env](template.env) file.
To fill it head to the Discord developper portal and register a new project, then fill both the token and id.

After that just grab an invite link from the Discord dev portal and invite the bot to your server!
After these steps, just run `node index.js` or you can use something such as Screen or PM2 to let it do its thing in the background!

# MHW

`/world <name>` will search through [MHW db](./monster_hunter_db/wilds_monster_db.json) for monsters stats. The db was taken from [MHW-api](https://docs.mhw-db.com/) and completed by myself for Iceborne.

# MH: Rise

`/rise <name>` will search through [RISE db](./monster_hunter_db/rise_monster_db.json) for monsters stats. Db was made by myself, way less complete than the mhw one.

# MH: Wilds

`/wilds <name>` will search through [WILDS db](./monster_hunter_db/wilds_monster_db.json)

# Database

If you want to contribute, modify, report anything concerning the db, here's the link to the [repository](https://github.com/Neryss/monster_hunter_db).
I've described how things work in the readme, what is currently missing and why, also how to help if you want!

Invite the bot to your server with this [link](https://discord.com/api/oauth2/authorize?client_id=946876504615317524&permissions=2147608576&redirect_uri=https%3A%2F%2Fdiscord.com%2Fapi%2Foauth2%2Fauthorize&response_type=code&scope=bot%20messages.read%20applications.commands)

Or download the source code, `npm ci` to install the dependecies, then `node index.js` to run the bot locally. 
You'll also need to save a `.env` on the same template present in [template.env](template.env) but completed of course.

Authorizations are subject to changes in the future :
- embed : required to send monsters infos
- read/edit/send messages : need it for the embed too
- send files : will be required in the future to get the monster icons in the embed

If you have any question, feel free to ask! Same goes for bug reports, post an issue on the repo!
