import { parse, type HTMLElement } from 'node-html-parser'
import type { GenshinEvent, event_type } from '../types/GenshinEvent.js'
import { getBotSettings } from './botSettingUtils.js'

const scrapeAndParseEvents = async () : Promise<GenshinEvent[]> => {
    let events : GenshinEvent[] = []
    
    let bot_settings = getBotSettings()

    try {
        //fetch and parse page
        let resp:Response = await fetch('https://genshin-impact.fandom.com/wiki/Event')
        let resp_text:string = await resp.text()
        
        let page = parse(resp_text)
        let events_tableHtml = page.querySelector("#Current")!.parentNode.nextElementSibling
        
        //query for rows in first tbody, then process through children
        events_tableHtml!.querySelectorAll("tbody tr").forEach(item => {
            
            //get event type tags for in-game events
            let event_type_tags = item.childNodes[2].innerText.split(", ")

            if (event_type_tags.includes('In-Game')) {
                
                
                //get length of tabledata element that contains the event name
                //then use it to select last child of that tabledata
                let event_nameParentLength:number = item.childNodes[0].childNodes.length
                let event_nameData:string = item.childNodes[0].childNodes[event_nameParentLength - 1].innerText
                
                //get data for event date
                let event_dateData : HTMLElement = item.childNodes[1] as HTMLElement

                //regex match the dates from html attribute
                let times = event_dateData.attributes['data-sort-value'].match(/\d{4}\-\d{2}\-\d{2} \d{2}:\d{2}:\d{2}/g)

                //generate date values that represent when the local game server sees the time
                let server_timezone_modifier = bot_settings.local_server_time_zone > 0 ? ` +${bot_settings.local_server_time_zone}` : `${bot_settings.local_server_time_zone}`


                //NOTE: Date.parse returns a UTC epoch timestamp from a given datestring with a given timezone
                let event_startDate:number = Date.parse(`${times![0]} ${server_timezone_modifier}`)
                let event_endDate:number = Date.parse(`${times![1]} ${server_timezone_modifier}`)

                let event: GenshinEvent = {
                    name: event_nameData,
                    dateStart: event_startDate,
                    dateEnd: event_endDate,
                    type: event_type_tags.slice(1) as event_type[]
                }
                
                if (event_endDate - event_startDate > 0) {
                    events.push(event)
                }
            }
            
        })
        
        return events

    } catch (e) {
        throw(e)
    }
}


const getSpiralAbyssEvent = () : GenshinEvent => {
    let bot_settings = getBotSettings()
   
    let today = new Date()
    today.setUTCHours(0,0,0,0)
    
    let year_end = today.getFullYear()
    let month_end = today.getMonth()
    let day_end
    
    let month_start
    let day_start

    //the start and end days of spiral abyss will always be the 1st and 16th or 16th and 1st
    //but if the bot is run on the 1st before server reset, the start/end will be 16th/1st
    //and if run after the reset will be 1st/16th
    if (today.getDate() >= 16) {
        //when date is after 16th, the start must have been the 16 and the end must be the 1st of the next month
        
        month_end = today.getMonth() + 1
        day_end = 1
        
        month_start = today.getMonth()
        day_start = 16
    
    } else if (today.getDate() === 1) {
        //when date is the 1st - before server reset - start must be 16th and end 1st
        //when - after server reset - start must be 1st and end 16th
        
        //get current hour of day by subtracting today (which has been zeroed to UCT00:00:00 above ^) from right now(UCT) adjusted for server timezone
        //this will be the time of day seen by the local server as ms into the day
        let current_day_hour = (Date.now() + bot_settings.local_server_time_zone) - today.getTime()

        //checking if time of day is less than the hour of the local server reset time represented as ms
        if (current_day_hour < (bot_settings.local_sever_time_reset * (1000 * 60 * 60))) {
            day_end = 1
            
            //start date becomes 16th of last month(the date constructor will handle rolling years up or down by month)
            day_start = 16
            month_start = today.getMonth() - 1
        } else {
            day_end = 16

            day_start = 1
            month_start = today.getMonth()
        }
    
    } else {
        //when after the 1st and before the 16th, dates work as expected
        day_end = 16

        day_start = 1
        month_start = today.getMonth()
    }

    
    let date_end = Date.UTC(year_end, month_end, day_end, 4 - bot_settings.local_server_time_zone)
    let date_start = Date.UTC(today.getFullYear(), month_start, day_start, 4 - bot_settings.local_server_time_zone)

    let event : GenshinEvent = {
        name: "Spiral Abyss",
        dateStart: date_start,
        dateEnd: date_end,
        type: ["Spiral Abyss"]
    }

    return event
}

export { scrapeAndParseEvents, getSpiralAbyssEvent }
