export type event_type = "In-Game" | "Test Run" | "Battle Pass" | "The Forge Realm's Temper" | "Spiral Abyss"

export interface GenshinEvent {
    name: string,
    dateStart: number,
    dateEnd: number,
    type: event_type[]
}