# GenshinDiscordTimer
## Description:
This is a script/bot capable of scraping Genshin Impact event information from the [Genshin Impact Fandom Wiki](https://genshin-impact.fandom.com/wiki/Genshin_Impact_Wiki), then formatting and sending it to a Discord channel. The Channel and necessary Roles are handled and managed automatically by the bot. 

On launch, the bot will check if necessary Channels and Roles exist, creating them if missing, then will wipe the alert channel by deleting and rebuilding it. Ideally the bot would be run once per day as a cron job or schedueled task, to make this easier a `run.ps1` and `run.sh` script are provided to use for launching the bot, these scripts specifically handle working directory changes to keep relative paths in tact and can be used as examples or in deployment.

>[!IMPORTANT]
>The bot is only meant to run on one server at a time and requires that you make a bot application/account with the Discord Developer Portal. You will need the bot token and invite link with `permissions=268692528&scope=bot` for permissions and scope.


## Installation and Usage:
### To install:
1. Clone the project or download a release
2. Install dependencies with npm by executing `npm install`
3. Create a `.env` file with your Discord Bot Token (use the `.env-example` file as a guide)
4. Build project with `npm run build`
### To run:
* Execute `npm run start`
* Or execute `run.ps1` or `run.sh` from any directory
## Example of message output:
![Screenshot of bot message](https://github.com/Liam-00/GenshinDiscordTimer/assets/93989398/7e321ee4-29e9-4be0-97ba-65c85b8171bb)
