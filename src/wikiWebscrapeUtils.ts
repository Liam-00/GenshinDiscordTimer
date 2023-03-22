import { parse } from 'node-html-parser'
import type { GenshinEvent } from './GenshinEvent.js'

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
                events.push(event)
            }
            
        })
        
        return events

    } catch (e) {
        console.error(e)
    }
}

export { scrapeAndParseEvents }