export interface DiscordEmbed {
    title: string,
    color: number,
    fields: [
        {
            name: string,
            value: string,
            inline: boolean,
        }
    ]
    
}