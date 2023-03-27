import { parse } from 'node-html-parser'
import type { GenshinEvent } from '../types/GenshinEvent.js'
import { timeRemaining } from './timeUtils.js'

const scrapeAndParseEvents = async ():Promise<GenshinEvent[]> => {
    let events:GenshinEvent[] = []
    
    try {
        let resp:Response = await fetch('https://genshin-impact.fandom.com/wiki/Event')
        let resp_text:string = await resp.text()
        
        let page = parse(resp_text)
        let events_tableHtml = page.querySelector("#Current").parentNode.nextElementSibling
        
        //query for rows in first tbody, then process through children
        events_tableHtml.querySelectorAll("tbody tr").forEach(item => {
            //find which rows are tagged In-Game events
            if (item.childNodes[2].innerText === 'In-Game') {
                
                //get data for event date
                let event_dateData:string[] = item.childNodes[1].innerText.split(/ \W /)
                
                //get length of tabledata element that contains the event name
                //then use it to select last child of that tabledata
                let event_nameParentLength:number = item.childNodes[0].childNodes.length
                let event_nameData:string = item.childNodes[0].childNodes[event_nameParentLength - 1].innerText

                let event_startDate:number = Date.parse(event_dateData[0])
                let event_endDate:number = Date.parse(event_dateData[1])

                let event: GenshinEvent = {
                    name: event_nameData,
                    dateStart: event_startDate,
                    dateEnd: event_endDate
                }
                if (timeRemaining(event).hours > 0) {
                    events.push(event)
                }
                
            }
            
        })
        
        return events

    } catch (e) {
        console.error(e)
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
    let event = {
        name: "Spiral Abyss",
        dateStart: 1,
        dateEnd: 1
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
