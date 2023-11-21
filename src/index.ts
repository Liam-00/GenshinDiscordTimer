//build list of current events
//     let eventlist = await scrapeAndParseEvents()
//     eventlist.push(getSpiralAbyssEvent())// import { messageWebhook } from "./messageWebhook.js";
// import { scrapeAndParseEvents, getSpiralAbyssEvent } from "./utils/eventDataUtils.js";
// import { timeRemaining, timeForReminder } from "./utils/timeUtils.js";
// import { createEventMessage } from "./discordMessageFormat.js";

// import type { GenshinEvent } from "./types/GenshinEvent.js";
// import type{ ReminderConfig } from "./types/ReminderConfig.js";


import {Client, GatewayIntentBits} from 'discord.js'

import dotenv from 'dotenv'
let path_dotenv = new URL('../.env', import.meta.url)
let dot = dotenv.config({
    path: fileURLToPath(path_dotenv)
})
console.log(process.env.BOT_TOKEN)
console.log(path_dotenv)

import { createBotUserRole, getBotUserRoleFromGuild } from './utils/botUserRoleUtils.js'
import { createBotChannel, deleteBotChannel, getBotChannelFromGuild } from './utils/botChannelUtils.js'
import { getSpiralAbyssEvent, scrapeAndParseEvents } from './utils/eventDataUtils.js'
import { createEventMessage } from './discordMessageFormat.js'
import { timeForReminder } from './utils/timeUtils.js'
import { getBotSettings } from './utils/botSettingUtils.js'
import { sendMessageToBotChannel } from './utils/botMessageUtils.js'
import { fileURLToPath } from 'url'

//create discordjs client
let client = new Client({intents: GatewayIntentBits.Guilds})

//define onready callback - main function of bot
client.on('ready', async () => {
    console.log(`Bot is ready ${client.user?.tag}`)

    let bot_settings = getBotSettings()

    //ensure user role exists
    let bot_user_role = getBotUserRoleFromGuild(client)
    if (!bot_user_role) {
        bot_user_role = await createBotUserRole(client)
    }

    //ensure bot channel exists
    let channel_just_created = false

    let bot_channel = getBotChannelFromGuild(client)
    if (!bot_channel) {
        bot_channel = await createBotChannel(client, bot_user_role)
        channel_just_created = true
    }
 
    //create list of current events
    let event_list = await scrapeAndParseEvents()
    event_list.push(getSpiralAbyssEvent())

    //init reminder toggle
    let do_send_alert = false

    //build embed list and check for alert time
    let embeds = event_list.map(event => {
        let embed = createEventMessage(event)
        
        if (timeForReminder(event, bot_settings.days_left_for_reminder)) {
            do_send_alert = true
        }
        
        return embed
    })

    //clear channel
    //the existing channel's position is kept. Then we delete the channel and recreate it at the same position
    let position = bot_channel.position
    
    if (!channel_just_created){
        await deleteBotChannel(client)
        await createBotChannel(client, bot_user_role, position)
    }

    //send new event embeds
    await sendMessageToBotChannel(client, embeds)
    
    //send alert to channel if date conditions are met
    if (do_send_alert) {
        await sendMessageToBotChannel(client, `<@&${bot_user_role.id}> An event is ending soon!`)
    }
})

client.login(process.env.BOT_TOKEN)



// const msg = async () => {
//     //config reminder days
//     let reminderConf:ReminderConfig = {
//         reminderDays: [5, 2, 0]
//     }

//     //build list of current events
//     let eventlist = await scrapeAndParseEvents()
//     eventlist.push(getSpiralAbyssEvent())

//     //init blank message
//     let embeds = []
//     //init reminder check
//     let performReminder: boolean = false;

//     //build message and check if today is a reminder day for any events
//     eventlist.forEach(event => {
//         embeds.push(createEventMessage(event)) 
//         if (timeForReminder(event, reminderConf)) {
//             performReminder = true;
//         }
//     })

//     //if reminder day, send message
//     if (performReminder) {
//         messageWebhook(embeds)
//     }
// }

// msg()