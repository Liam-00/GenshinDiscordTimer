import type { Client } from 'discord.js'

const getGuild = (client: Client) => {
    let guild = client.guilds.cache.first()
    if (!guild) {
        throw new Error("Guild not found")
    }
    return guild
}

export { getGuild }