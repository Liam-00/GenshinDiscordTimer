import dotenv from 'dotenv'
let path_dotenv = new URL('../.env', import.meta.url)
let dot = dotenv.config({
    path: fileURLToPath(path_dotenv)
})

import {Client, GatewayIntentBits} from 'discord.js'
import { createBotUserRole, getBotUserRoleFromGuild } from './utils/botUserRoleUtils.js'
import { createBotChannel, deleteBotChannel, getBotChannelFromGuild } from './utils/botChannelUtils.js'
import { getSpiralAbyssEvent, scrapeAndParseEvents } from './utils/eventDataUtils.js'
import { createEventMessage } from './discordMessageFormat.js'
import { timeForReminder, timeRemaining } from './utils/timeUtils.js'
import { getBotSettings } from './utils/botSettingUtils.js'
import { sendMessageToBotChannel } from './utils/botMessageUtils.js'
import { fileURLToPath } from 'url'
import { writeLog } from './utils/logUtils.js'

writeLog("LOG: Bot starting.")

//create discordjs client
let client = new Client({intents: GatewayIntentBits.Guilds})

writeLog("LOG: Client created.")

//define onready callback - main function of bot
client.on('ready', async () => {
    try{
        writeLog(`LOG: Bot is ready ${client.user?.tag}`)

        let bot_settings = getBotSettings()

        writeLog("LOG: Checking user role.")
        //ensure user role exists
        let bot_user_role = getBotUserRoleFromGuild(client)
        if (!bot_user_role) {
            bot_user_role = await createBotUserRole(client)
        }

        writeLog("LOG: Checking bot channel.")
        //ensure bot channel exists
        let channel_just_created = false

        let bot_channel = getBotChannelFromGuild(client)
        if (!bot_channel) {
            bot_channel = await createBotChannel(client, bot_user_role)
            channel_just_created = true
        }

        writeLog("LOG: Getting event data.")
        //create list of current events
        let event_list = await scrapeAndParseEvents()
        event_list.push(getSpiralAbyssEvent())

        //init reminder toggle
        let do_send_alert = false

        //build embed list and check for alert time
        let event_list_filtered = event_list.filter(event => {
            if (timeRemaining(event).minutes < 0) {
                return false
            }
            return true             
        })
        
        let embeds = event_list_filtered.map(event => {
            let embed = createEventMessage(event)

            if (timeForReminder(event)) {
                do_send_alert = true
            }

            return embed
        })

        writeLog("LOG: Clearing channel.")
        //clear channel
        //the existing channel's position is kept. Then we delete the channel and recreate it at the same position
        let position = bot_channel.position
        
        if (!channel_just_created){
            await deleteBotChannel(client)
            await createBotChannel(client, bot_user_role, position)
        }

        writeLog("LOG: Sending event data to channel.")
        //send new event embeds
        await sendMessageToBotChannel(client, embeds)

        //send alert to channel if date conditions are met
        if (do_send_alert) {
            await sendMessageToBotChannel(client, `<@&${bot_user_role.id}> An event is ending soon!`)
        }

        process.exit(0)
    } catch(e) {
        writeLog(`ERROR: ${e}`)
        process.exit(1)
    }
})

writeLog("LOG: Bot logging in.")
client.login(process.env.BOT_TOKEN)