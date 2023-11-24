import type { GenshinEvent } from "../types/GenshinEvent.js";
import type { TimeLeft } from "../types/TimeLeft.js"
import { getBotSettings } from "./botSettingUtils.js";


const timeRemaining = (event:GenshinEvent) : TimeLeft => {
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
    let time_remaining_minutes = Math.floor ( ( time_remaining_exact % (1000 * 60 * 60) ) / (1000 * 60) )


    return {
        days: time_remaining_days,
        hours: time_remaining_hours,
        minutes: time_remaining_minutes
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