# mh_bot
Discord monster hunter bot

# MHW

`/mhw <name>` will search through [MHW db](./db/mhw_db.json) for monsters stats. The db was taken from [MHW-api](https://docs.mhw-db.com/) and completed by myself for Iceborne.

# MH: Rise

`/rise <name>` will search through [RISE db](./db/rise_monster_db.json) for monsters stats. Db was made by myself, way less complete than the mhw one.

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