import { getBotChannelFromGuild } from "./botChannelUtils.js"
import { type APIEmbed, type Client, type MessageCreateOptions } from "discord.js"


const sendMessageToBotChannel = async (client: Client, message: string | APIEmbed[]) => {
    let channel = getBotChannelFromGuild(client)
    
    if (!channel) {
        throw new Error("Cannot access channel")
    }

    let message_options_list: MessageCreateOptions[] = []
    
    //message should either be a text message or embed
    if (typeof message === 'string') {
        message_options_list.push({content: message})
    
    } else {
        //only 10 embeds can exist in a single message
        
        for (let i = 0; i < message.length; i += 10) {
            let group = message.slice(i, i + 10)
            message_options_list.push({embeds: group})
        }
    }

    for (let message_options of message_options_list) {
        await channel.send(message_options)
    }
}

export { sendMessageToBotChannel }