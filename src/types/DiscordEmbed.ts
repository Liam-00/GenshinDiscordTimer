export interface DiscordEmbed {
    title: string,
    color: string,
    fields:{
            name: string,
            value: string,
            inline: boolean,
        }[]
}