//build list of current events
//     let eventlist = await scrapeAndParseEvents()
//     eventlist.push(getSpiralAbyssEvent())// import { messageWebhook } from "./messageWebhook.js";
// import { scrapeAndParseEvents, getSpiralAbyssEvent } from "./utils/eventDataUtils.js";
// import { timeRemaining, timeForReminder } from "./utils/timeUtils.js";
// import { createEventMessage } from "./discordMessageFormat.js";

// import type { GenshinEvent } from "./types/GenshinEvent.js";
// import type{ ReminderConfig } from "./types/ReminderConfig.js";


import {Client, GatewayIntentBits} from 'discord.js'
import 'dotenv/config'
import { createBotUserRole, getBotUserRoleFromGuild } from './utils/botUserRoleUtils.js'
import { createBotChannel, getBotChannelFromGuild } from './utils/botChannelUtils.js'


let client = new Client({intents: GatewayIntentBits.Guilds})

client.on('ready', async () => {
    console.log(`Bot is ready ${client.user?.tag}`)

    let bot_user_role = getBotUserRoleFromGuild(client)
    if (!bot_user_role) {
        bot_user_role = await createBotUserRole(client)
    }

    let bot_channel = getBotChannelFromGuild(client)
    if (!bot_channel) {
        bot_channel = await createBotChannel(client, bot_user_role)
    }
 
    //fetch new data generate message

    //clear channel

    //send new message
    
    //send alert to channel if date conitions are met
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