import { messageWebhook } from "./messageWebhook.js";
import { scrapeAndParseEvents, getSpiralAbyssEvent } from "./utils/eventDataUtils.js";
import { timeRemaining, timeForReminder } from "./utils/timeUtils.js";
import { createEventMessage } from "./discordMessageFormat.js";

import type { GenshinEvent } from "./types/GenshinEvent.js";
import type{ ReminderConfig } from "./types/ReminderConfig.js";

const msg = async () => {
    //config reminder days
    let reminderConf:ReminderConfig = {
        reminderDays: [5, 2, 0]
    }

    //build list of current events
    let eventlist = await scrapeAndParseEvents()
    eventlist.push(getSpiralAbyssEvent())

    //init blank message
    let message = ''
    //init reminder check
    let performReminder: boolean = false;

    //build message and check if today is a reminder day for any events
    eventlist.forEach(event => {
        message += createEventMessage(event)
        if (timeForReminder(event, reminderConf)) {
            performReminder = true;
        }
    })

    //if reminder day, send message
    if (performReminder) {
        messageWebhook(message)
    }
}

msg()
