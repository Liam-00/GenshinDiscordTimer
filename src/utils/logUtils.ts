import { getBotSettings } from "./botSettingUtils.js"

const writeLog = (msg: string) => {
    let bot_settings = getBotSettings()

    //extract log type
    let regex_pattern = /(?<type>[A-Z]*):\s*(?<message>.*)/
    
    //check that pattern matches
    let message_split = msg.match( regex_pattern )
    
    if (!message_split?.groups) {
        throw new Error("ERROR: Incorrect use of writeLog.")
    }
    
    //pull groups from regex match
    let log_type = message_split.groups['type']
    let log_message = message_split.groups['message']

    //get time
    let time_now = new Date(Date.now() + bot_settings.user_time_zone)

    //construct message
    let output_message = `| ${time_now.toISOString()} | ${log_message}\n`

    //output message
    switch (log_type) {
        case "LOG:":
            console.log(log_message)
            break;
        case "ERROR:":
            console.error(log_message)
            break;
    }
}


export { writeLog }