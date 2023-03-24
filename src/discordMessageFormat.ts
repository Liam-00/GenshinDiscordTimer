import type { GenshinEvent } from "./types/GenshinEvent";
import type { DiscordEmbed } from "./types/DiscordEmbed";
import { timeRemaining } from "./utils/timeUtils.js";


const createEventMessage = (event:GenshinEvent):DiscordEmbed => {
    let event_title_buffer = '\\_'.repeat(50)
    let event_title = `**${event.name}:**`

    //get remaining event time and format it
    let timeleft = timeRemaining(event)
    let event_timeLeft = `**${timeleft.days}** _days_ **${timeleft.hours}** _hrs_`
    
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

    let embed = {
        title: `${event.name}`,
        color: `16777215`,
        fields: [
            {
                name: `__Time Left__:`,
                value: `${event_timeLeft}`,
                inline: false
            },
            {
                name: `__Event Timeline__:`,
                value: `${event_timeline}`,
                inline: false
            }
        ]
    }

    return embed

    /*return `` +
        `${event_title_buffer}\n` +
        `${event_title}\n` + 
        `> ${event_timeLeft}\n` + 
        `> ${event_timeline}\n`
    */
}

export { createEventMessage }