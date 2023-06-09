import type { GenshinEvent } from "../types/GenshinEvent";
import type { ReminderConfig } from "../types/ReminderConfig";
import type { TimeLeft } from "../types/TimeLeft"


const timeRemaining = (event:GenshinEvent, realtime:boolean = false, modifier:number = 0):TimeLeft => {
    let end:Date;
    if (realtime) {
        end = new Date(event.dateEnd)
        end.setHours(4 + modifier,0,0,0)

        
    } else {
        end = new Date(event.dateEnd)// - (1000 * 60 * 60 * 24))
    }

    let timeRemaining_ms:number = end.getTime() - Date.now()
    let timeRemaining_hrs_exact:number = timeRemaining_ms / (1000 * 60 * 60 * 24)
    let timeRemaining_days:number = Math.floor(timeRemaining_hrs_exact)
    let timeRemaining_hrs:number = Math.floor((timeRemaining_hrs_exact - timeRemaining_days)  * 24)
 
    return {
        days: timeRemaining_days,
        hours: timeRemaining_hrs
    }
}

const timeForReminder = (event:GenshinEvent, config:ReminderConfig):boolean => {
    let callReminder:boolean = config.reminderDays.reduce((status, val) => {
        if (timeRemaining(event).days === val) {
            return true
        } else if (status === true) {
            return true
        } else {
            return false
        }
    },
    false
    )

    return callReminder
}


export { timeRemaining, timeForReminder }