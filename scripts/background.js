console.log('Background.js')

const ignored = ["https://www.google.com/gen_204", "https://play.google.com/log"]
chrome.webRequest.onBeforeRequest.addListener(async (req) => {
    //if (req.url in ignored) return console.log("Ignored Login [-]")
    // USE A REGEX TO TEST URL FOR LOGIN DATA OR LOGIN WORDS BUT FIRST TEST THE REQ.BODY FOR LOGIN PARAMETERS
    pass_regex = /(pa?s*.*(d|e|s)|login-?pa?s*.*(d|e|s))/gi // fix this regex so it includes "submit: ['Login']" and "submitLogin"
    // create regex to detect email just incase there is no key:value pair or its all in one string (for example youtube.com/signin has a weird req.requestBody)
    /*
    Might need to make a serries of reg expressions to sort through request data
    */

    if (req.method !== "POST") return// console.log('GET request [-]')
    if (req.url.startsWith("https")) {
        //console.log(req.requestBody)
        // decode secured code, some of them arent decoded and some of them are
        if (req.requestBody.formData) {
            console.log("found request (HTTPS) [+?]")
            console.log(req.requestBody.formData)
            console.log("URL: ", req.url)
            console.log("-".repeat(10))
            // run filter, after login submission detected make action pop up
        }
    } else {
        console.log("found request HTTP[+]")
        console.log(req.requestBody.formData)
        console.log("URL: ", req.url)
        console.log("-".repeat(10))

        // run filter

        // check if its saved already; if not, make it pop up and ask to save

        // runs save_notification.js
        let timeout = 1000 
        getCurrentTab().then(async (tab) => {
            setTimeout(async () => {
                chrome.scripting
                    .executeScript({
                        target: { tabId: tab.id },
                        files: ["scripts/requests/save_notification.js"]
                    }).then(async () => {
                        console.log("script injected in " + tab.id + " after " + timeout + " ms")
                        await chrome.tabs.sendMessage(tab.id, req.requestBody.formData)
                    })
                console.log("sent message")
            }, timeout); // implement a tab reload listener to inject the script after the page has loaded instead of a time limit
        })

    }
    //const header = document.getElementById("edit")
    //header.innerHTML = req.body 
}, { urls: ["<all_urls>"] }, ["requestBody"])



async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return await tab;
}