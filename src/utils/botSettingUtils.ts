import fs from 'fs'
import type { BotSettings } from '../types/BotSettings'



const getBotSettings = () => { 
    let data = fs.readFileSync('./bot_config.json', {encoding: "utf-8"})
    let settings_object: BotSettings = JSON.parse(data)

    //enforce channel naming rules
    settings_object.bot_channel_name = settings_object.bot_channel_name
        .toLowerCase()
        .replace(/[^a-z0-9_\s-]/g,"")
        .replace(/\s/g, "-")


    return settings_object
}