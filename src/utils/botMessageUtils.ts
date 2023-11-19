import { getBotChannelFromGuild } from "./botChannelUtils.js"
import { type APIEmbed, type Client, type MessageCreateOptions } from "discord.js"



const sendMessageToBotChannel = async (client:Client, message? : string, embedlist? : APIEmbed[]) => {
    let channel = getBotChannelFromGuild(client)
    if (!channel) {
        throw new Error("Cannot access channel")
    }

    let message_options: MessageCreateOptions = {
        embeds: embedlist,
        content: message
    }
    
    await channel.send(message_options)
}