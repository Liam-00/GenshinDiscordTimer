import fs from 'fs'
import type { BotSettings } from '../types/BotSettings.js'



const getBotSettings = () => { 

    let file_absolute_path = new URL('../../bot_config.json', import.meta.url)

    console.log(file_absolute_path)
    
    let data = fs.readFileSync(file_absolute_path, {encoding: "utf-8"})

    let settings_object: BotSettings = JSON.parse(data)

    //enforce channel naming rules
    settings_object.bot_channel_name = settings_object.bot_channel_name
        .toLowerCase()
        .replace(/[^a-z0-9_\s-]/g,"")
        .replace(/\s/g, "-")


    return settings_object
}

export {getBotSettings}