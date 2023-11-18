import { getBotSettings } from "./botSettingUtils.js"
import { getGuild } from "./botGuildUtils.js"

import type {Client, Role} from 'discord.js'
 
const getBotUserRoleFromGuild = (client: Client): Role | null => {
    let bot_settings = getBotSettings()

    let roles = getGuild(client).roles.cache

    let bot_user_role = roles.find(role => role.name === bot_settings.bot_user_role_name)

    if (bot_user_role) {
        return bot_user_role
    }

    return null
}

const createBotUserRole = async (client: Client) => {
    let bot_settings = getBotSettings()

    let role_manager = getGuild(client).roles

    let role = await role_manager.create({
        name: bot_settings.bot_user_role_name
    })

    return role
}

export {getBotUserRoleFromGuild, createBotUserRole}