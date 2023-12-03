import type { GenshinEvent } from "../types/GenshinEvent.js";
import type { TimeLeft } from "../types/TimeLeft.js"
import { getBotSettings } from "./botSettingUtils.js";


const timeRemaining = (event: GenshinEvent) : TimeLeft => {
    let bot_settings = getBotSettings()

    //get current utc day and set hours to day start
    let today = new Date()
    today.setUTCHours(0,0,0,0)
    
    let event_time = event.dateEnd


    //get exact ms of time remaining
    let time_remaining_exact = event_time - today.getTime() + (bot_settings.user_time_zone * (1000 * 60 * 60))

    //get days
    let time_remaining_days = Math.floor( time_remaining_exact / (1000 * 60 * 60 * 24) )
    //get hours
    let time_remaining_hours = Math.floor( ( time_remaining_exact % (1000 * 60 * 60 * 24) ) / (1000 * 60 * 60) )
    //get minutes
    let time_remaining_minutes = Math.ceil ( ( time_remaining_exact % (1000 * 60 * 60) ) / (1000 * 60) )

    //catch minute rounding
    if (time_remaining_minutes === 60) {
        time_remaining_minutes = 0
        time_remaining_hours += 1
    }
    if (time_remaining_hours === 24) {
        time_remaining_hours = 0
        time_remaining_days +=1
    }

    //Time returned will count from midnight of current day, event can be finished and still show hours remaining
    //use isEventOver() to check if event has finished
    return {
        days: time_remaining_days,
        hours: time_remaining_hours,
        minutes: time_remaining_minutes
    }
}

const isEventOver = (event: GenshinEvent) : boolean => {
    let time_now = new Date()
    let time_event_end = new Date(event.dateEnd)

    if (time_event_end.getTime() - time_now.getTime() < 0) {
        return true
    }
    
    return false
}

const timeForReminder = (event: GenshinEvent) : boolean => {
    let bot_settings = getBotSettings()
    
    let daysLeftForReminder = [...bot_settings.days_left_for_reminder]
    
    //if there's a config option set, we reduce it to find if timeRemaining matches the config
    if (daysLeftForReminder.length > 0){
        let callReminder:boolean = daysLeftForReminder.reduce(
            (doCallReminder, val) => {
                if (timeRemaining(event).days === val) {
                    return true
                } else if (doCallReminder === true) {
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


export { timeRemaining, timeForReminder, isEventOver }