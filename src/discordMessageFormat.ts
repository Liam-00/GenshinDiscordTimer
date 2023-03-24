import type { GenshinEvent } from "./types/GenshinEvent.js";
import { timeRemaining } from "./utils/timeUtils.js";

/*message template
----------------------
**Fungus Mechanicus:**
----------------------
> **10** *days* **2** *hrs* remaining
> ```Thu Mar 23 2023 -----[-]----- Mon Apr 03 2023```

*/


const createEventMessage = (event:GenshinEvent):string => {
    let event_title_buffer = '\\_'.repeat(50)
    let event_title = `**${event.name}:**`

    //get remaining event time and format it
    let timeleft = timeRemaining(event)
    let event_timeLeft = `**${timeleft.days}** *days*  **${timeleft.hours}** *hrs* remaining`
    
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

    return `` +
        `${event_title_buffer}\n` +
        `${event_title}\n` + 
        `> ${event_timeLeft}\n` + 
        `> ${event_timeline}\n`
}

export { createEventMessage }