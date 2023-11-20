export interface BotSettings {
    bot_channel_name: string;
    bot_user_role_name: string;
    days_left_for_reminder: number[];
    use_true_time: boolean;
    time_offset: number
}