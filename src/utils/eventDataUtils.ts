import { parse, type HTMLElement } from 'node-html-parser'
import type { GenshinEvent, event_type } from '../types/GenshinEvent.js'
import { timeRemaining } from './timeUtils.js'
import { getBotSettings } from './botSettingUtils.js'

const scrapeAndParseEvents = async () : Promise<GenshinEvent[]> => {
    let events : GenshinEvent[] = []
    
    let bot_settings = getBotSettings()

    try {
        let resp:Response = await fetch('https://genshin-impact.fandom.com/wiki/Event')
        let resp_text:string = await resp.text()
        
        let page = parse(resp_text)
        let events_tableHtml = page.querySelector("#Current")!.parentNode.nextElementSibling
        
        //query for rows in first tbody, then process through children
        events_tableHtml.querySelectorAll("tbody tr").forEach(item => {
            
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

                //generate date values with timezone(announcements use CST+8 ?)
                let server_timezone_modifier = bot_settings.server_time_zone > 0 ? ` +${bot_settings.server_time_zone}` : `${bot_settings.server_time_zone}`

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

const getSpiralAbyssEvent = (realtime:boolean = false, modifier:number = 0):GenshinEvent => {

    //setup info on current time and date
    let time_now = new Date()
    let time_currentDay = time_now.getDate()
    let time_currentMonth = time_now.getMonth()
    let time_currentYear = time_now.getFullYear()

    //when current date is after 16th, the start date is set to first of next month
    let passedMidMonth = time_currentDay >= 16 ? true : false
    
    let event_startMonthDate = new Date(
        time_currentYear,
        passedMidMonth ? time_currentMonth + 1 : time_currentMonth,
        1
    )
    
    //mid month date will always be 16th of current month
    let event_midMonthDate = new Date(
        time_currentYear,
        time_currentMonth,
        16
    )

    //create event object
    let event: GenshinEvent = {
        name: "Spiral Abyss",
        dateStart: 1,
        dateEnd: 1,
        type: ["In-Game", "Spiral Abyss"]
    }

    //set dates on event
    if (passedMidMonth) {
        event.dateStart = event_midMonthDate.getTime()
        event.dateEnd = event_startMonthDate.getTime()
    } else {
        event.dateStart = event_startMonthDate.getTime()
        event.dateEnd = event_midMonthDate.getTime()
    }

    return event
} 


export { scrapeAndParseEvents, getSpiralAbyssEvent }
