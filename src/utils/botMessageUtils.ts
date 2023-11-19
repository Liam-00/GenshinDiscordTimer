import { getBotChannelFromGuild } from "./botChannelUtils.js"
import { type APIEmbed, type Client, type MessageCreateOptions } from "discord.js"



const sendMessageToBotChannel = async (client:Client, message: string | APIEmbed[]) => {
    let channel = getBotChannelFromGuild(client)
    if (!channel) {
        throw new Error("Cannot access channel")
    }

    let message_options: MessageCreateOptions
    if (typeof message === 'string') {
        message_options = {content: message}
    } else {
        message_options = {embeds: message}
    }
    
    await channel.send(message_options)
}

export {sendMessageToBotChannel}