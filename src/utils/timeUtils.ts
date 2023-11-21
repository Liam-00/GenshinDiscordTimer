import type { GenshinEvent } from "../types/GenshinEvent.js";
import type { TimeLeft } from "../types/TimeLeft.js"
import { getBotSettings } from "./botSettingUtils.js";


const timeRemaining = (event:GenshinEvent) : TimeLeft => {
    let bot_settings = getBotSettings()

    let timeRemaining_ms:number = event.dateEnd - Date.now()
    let timeRemaining_days_exact:number = timeRemaining_ms / (1000 * 60 * 60 * 24)
    let timeRemaining_days:number = Math.floor(timeRemaining_days_exact)
    let timeRemaining_hrs:number = Math.floor((timeRemaining_days_exact - timeRemaining_days)  * 24)

    return {
        days: timeRemaining_days,
        hours: timeRemaining_hrs
    }
}

const timeForReminder = (event:GenshinEvent, daysLeftForReminder:number[]):boolean => {
    if (daysLeftForReminder.length > 0){
        let callReminder:boolean = daysLeftForReminder.reduce(
            (status, val) => {
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

    return true
}


export { timeRemaining, timeForReminder }