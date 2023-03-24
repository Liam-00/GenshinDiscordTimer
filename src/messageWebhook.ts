import * as dotenv from 'dotenv'
dotenv.config()

const messageWebhook = async (input:string):Promise<boolean> => {
    try{
        let response = await fetch(
            process.env.WEBHOOK_URL + "?wait=true",
            {
                method: "POST",
                body: JSON.stringify({
                    content: input
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        )
        
        let responsejson = await response.json()
        return true
    
    } catch (e) {
        return false
    }
}

export {messageWebhook}
