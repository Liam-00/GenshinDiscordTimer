import * as dotenv from 'dotenv'
import { DiscordEmbed } from './types/DiscordEmbed'
dotenv.config()

const messageWebhook = async (input:DiscordEmbed[]):Promise<boolean> => {
    try{
        let response = await fetch(
            process.env.WEBHOOK_URL + "?wait=true",
            {
                method: "POST",
                body: JSON.stringify({
                    embeds: input
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        )
        
        let responsejson = await response.json()
        return true
    
    } catch (e) {
        return false
    }
}

export {messageWebhook}
