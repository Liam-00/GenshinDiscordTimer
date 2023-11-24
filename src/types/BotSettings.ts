export interface BotSettings {
    bot_channel_name: string;
    bot_user_role_name: string;
    days_left_for_reminder: number[];
    use_true_time: boolean;
    user_time_zone: number;
    server_time_zone: number;
    local_server_time_zone: number;
    local_sever_time_reset: number;
}