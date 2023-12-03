import type { Client, Channel, Role, OverwriteResolvable, TextChannel, GuildBasedChannel } from 'discord.js'
import { ChannelType } from 'discord.js'
import { getBotSettings } from './botSettingUtils.js'
import { getGuild } from './botGuildUtils.js'


const getBotChannelFromGuild = (client: Client) : TextChannel | null => {
    let bot_settings = getBotSettings()

    let guild = getGuild(client)

    let channels = guild.channels.cache

    let channels_text = channels.filter(
        channel => channel.type === ChannelType.GuildText
    )

    let bot_channel = channels_text.find(channel => channel.name === bot_settings.bot_channel_name) as TextChannel
    
    if (bot_channel) {
        return bot_channel
    }
    
    return null
}

const createBotChannel = async (client: Client, bot_user_role?: Role, position?: number) => {
    let guild = getGuild(client)
    
    let guild_channel_manager = guild.channels

    let bot_settings = getBotSettings()

    //build channel permissions
    let channel_permissionOverwrites: OverwriteResolvable[] = [
        {
            id: guild.roles.everyone,
            deny: ["ViewChannel"]
        },
        {
            id: guild.client.user.id,
            allow:["ViewChannel"]
        }
    ]

    //create private channel permission settings for bot user role
    if (bot_user_role) {
        channel_permissionOverwrites.push({
            id: bot_user_role.id,
            allow: ["ViewChannel"]
        })
    }

    //create channel
    let bot_channel = await guild_channel_manager.create(
        {
            type: ChannelType.GuildText,
            name: bot_settings.bot_channel_name,
            permissionOverwrites: [...channel_permissionOverwrites],
            position: position
        })
    
    return bot_channel
}

const deleteBotChannel = async (client: Client) => {
    let bot_channel = getBotChannelFromGuild(client)

    let guild = getGuild(client)

    await guild.channels.delete(bot_channel as GuildBasedChannel)
}

export { getBotChannelFromGuild, createBotChannel, deleteBotChannel }