/*
TODO
} webscrape timers
}}format event timers for eu server

}format webscraper account and messages

}make executable as a scheduled task in windows
*/


const dotenv = require('dotenv')
dotenv.config()

console.log("========GEN THE SHINS WEBWORKER")

let post_body: string = JSON.stringify({
    //content: "testing webhooks",
    content: "TESTING WEBHOOK"
})

const messageWebhook = async () => {
    let response = await fetch(
        process.env.WEBHOOK_URL + "?wait=true",
        {
            method: "POST",
            body: post_body,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
    )
    let responsejson = await response.json()

    console.log(responsejson)
}

messageWebhook()