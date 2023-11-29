import type { GenshinEvent } from "./types/GenshinEvent.js";
import { APIEmbed, EmbedBuilder, type EmbedData } from "discord.js";
import { timeRemaining } from "./utils/timeUtils.js";


const createEventMessage = (event: GenshinEvent) : APIEmbed => {
    let event_title_buffer = '\\_'.repeat(50)
    let event_title = `**${event.name}:**`

    //get remaining event time
    let event_time_remaining = timeRemaining(event)

    //build string for event time
    let time_string = ``+
    `${event_time_remaining.hours < 10 ? "0" : ""}${event_time_remaining.hours}:`+
    `${event_time_remaining.minutes < 10 ? "0" : ""}${event_time_remaining.minutes}`

    //build string for event days
    let days_string = event_time_remaining.days === 0 ? `Today at`:
        event_time_remaining.days === 1 ? `Tomorrow at` : `In ${event_time_remaining.days} Days at`

    //assemble finished string
    let event_timeLeft = `\`\`\`${days_string} ${time_string}\`\`\``
    
    
    //formatted strings for event dates
    let eventstart = new Date(event.dateStart).toDateString()
    let eventend = new Date(event.dateEnd).toDateString()

    
    //get number of dashes ahead of and behind current day in timeine bar
    let start = new Date(event.dateStart)
    start.setUTCHours(0,0,0,0)

    let today = new Date(Date.now())
    today.setUTCHours(0,0,0,0)

    let event_days_passed = (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    let event_days_ahead = event_time_remaining.days


    let event_timeline_bar = 
        '-'.repeat(event_days_passed) +
        '[-]' + 
        '-'.repeat(event_days_ahead)

    let event_timeline = `\`\`\`${eventstart} ${event_timeline_bar} ${eventend}\`\`\``
    
    //assemble data in an embed
    let embed: APIEmbed = {
        title: event.name,
        color: 16777215,
        fields: [
            {
                name: `E v e n t  E n d s :`,
                value: `${event_timeLeft}`,
                inline: false
            },
            {
                name: `E v e n t   T i m e l i n e :`,
                value: `${event_timeline}`,
                inline: false
            }
        ]
    }

    return embed
}


export { createEventMessage }