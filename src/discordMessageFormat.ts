import type { GenshinEvent } from "./types/GenshinEvent.js";
import type { EmbedData } from "discord.js";
import { timeRemaining } from "./utils/timeUtils.js";


const createEventMessage = (event: GenshinEvent): EmbedData => {
    let event_title_buffer = '\\_'.repeat(50)
    let event_title = `**${event.name}:**`

    //get remaining event time and format it
    let timeleft = timeRemaining(event)
    let event_timeLeft = `\`\`\`${timeleft.days} days ${timeleft.hours} hrs\`\`\``
    
    //formatted strings for event dates
    let eventstart = new Date(event.dateStart).toDateString()
    let eventend = new Date(event.dateEnd).toDateString()

    //get number of dashes ahead of and behind current day in timeine bar
    let event_days_passed = Math.floor( (Date.now() - event.dateStart) / (1000 * 60 * 60 * 24) )
    let event_days_ahead = Math.floor( (event.dateEnd - Date.now()) / (1000 * 60 * 60 * 24) )
    
    let event_timeline_bar = 
        '-'.repeat(event_days_passed) +
        '[-]' + 
        '-'.repeat(event_days_ahead)

    let event_timeline = `\`\`\`${eventstart} ${event_timeline_bar} ${eventend}\`\`\``
    
    //assemble data in an embed
    let embed: EmbedData = {
        title: event.name,
        color: 16777215,
        fields: [
            {
                name: `T i m e   L e f t :`,
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