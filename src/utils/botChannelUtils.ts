import type {Client, Channel, Role, OverwriteResolvable} from 'discord.js'
import {ChannelType} from 'discord.js'

import { getBotSettings } from './botSettingUtils'
import { getGuild } from './botGuildUtils'


const getBotChannelFromGuild = (client: Client): Channel | null => {
    let bot_settings = getBotSettings()

    let guild = getGuild(client)

    let channels = guild.channels.cache

    let channels_text = channels.filter(
        channel => channel.type === ChannelType.GuildText
    )

    let bot_channel = channels_text.find(channel => channel.name === bot_settings.bot_channel_name)
    
    if (bot_channel) {
        return bot_channel
    }
    
    return null
}

const createBotChannel = async (client: Client, bot_user_role?: Role) => {
    let guild = getGuild(client)
    
    let guild_channel_manager = guild.channels

    let bot_settings = getBotSettings()


    let channel_permissionOverwrites: OverwriteResolvable[] = [
        {
            id: guild.roles.everyone,
            deny: ["ViewChannel"]
        }
    ]

    if (bot_user_role) {
        channel_permissionOverwrites.push({
            id: bot_user_role.id,
            allow: ["ViewChannel"]
        })
    }

    let bot_channel = await guild_channel_manager.create(
        {
            type: ChannelType.GuildText,
            name: bot_settings.bot_channel_name,
            permissionOverwrites: [...channel_permissionOverwrites]
        })
    
    return bot_channel
}

export { getBotChannelFromGuild, createBotChannel }