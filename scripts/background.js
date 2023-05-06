import PouchDb from 'pouchdb-browser'
// This is what our customer data looks like.
const db = new PouchDb('passwords');

//insert_login("facebook.com", "ehit_2708", "password123")
//insert_login("twitch.tv", "supremeerg", "password")
console.log('Background.js')
// start up db N shi
/*
let db = null

chrome.runtime.onInstalled.addListener(() => {
    const request = indexedDB.open('MyTestDB');

    request.onerror = function (event) {
        console.log("Problem opening DB", event)
    }

    request.onupgradeneeded = function (event) {
        db = event.target.result;

        let objectStore = db.createObjectStore('Passwords', {
            keyPath: 'site'
        });

        objectStore.transaction.oncomplete = function (event) {
            console.log("Objectstore created.")
        }
    }

    request.onsuccess = function (event) {
        console.log("DB Opened")

        db = event.target.result;

        //insert_login("facebook", "ethan", "123")
        get_login("facebook")
    }
})
*/


const ignored = ["https://www.google.com/gen_204", "https://play.google.com/log"]
chrome.webRequest.onBeforeRequest.addListener(async (req) => {
    req.requestBody.formData.site = req.url // add this to the object to send to save_noti

    /*
    // USE A REGEX TO TEST URL FOR LOGIN DATA OR LOGIN WORDS BUT FIRST TEST THE REQ.BODY FOR LOGIN PARAMETERS
    const pass_regex = /(pa?s{1,2}[^s]{1,3}(d|e|s):)|(login-?pa?s{1,2}[^s]{1,3}(d|e|s):)/gi // test for pass:, pswd:, passcode:
    const submit_regex = /submit: ?(\[|'|"| ).?login.?(]|'|")|submitlogin/gi // test for "submit: ['Login']" and "submitLogin"
    // create regex to detect email just incase there is no key:value pair or its all in one string (for example youtube.com/signin has a weird req.requestBody)
    */

    if (req.method !== "POST") return
    if (req.url.startsWith("https")) {
        // decode secured code, some of them arent decoded and some of them are
        if (req.requestBody.formData) {
            console.log("found request (HTTPS) [+?]")
            console.log(req.requestBody.formData)
            console.log("URL: ", req.url)
            console.log("-".repeat(10))
            // run filter, after login submission detected make action pop up

            let filter = test_form(req.requestBody.formData)
            getSingleLogin(req.requestBody.formData.site).then((res) => {
                // check if its saved already; if not, make it pop up and ask to save

                if (filter && res == "missing") {
                    console.log("does not exista nd filter result: ", filter)

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
                                    console.log(req.requestBody.formData) // find the key for password and the key for username and create my own object with those variables
                                    /*
                                    find the key for password and the key for username and create my own object with those variables
                                    ex: 
                                    req.requestbody.formData = {
                                        passcode32: "password",
                                        user4: "ethan123",
                                        site: "facebook.com"
                                    } should be chnaged to:
                                    {
                                        password: "password",
                                        username: "ethan123",
                                        site: "facebook.com"
                                    }
                                    */
                                    await chrome.tabs.sendMessage(tab.id, req.requestBody.formData)
                                })
                            // console.log("sent message")
                        }, timeout); // implement a tab reload listener to inject the script after the page has loaded instead of a time limit
                    })

                }
            })
        }
    } else {
        console.log("found request HTTP[+]", req.requestBody.formData, "URL: ", req.url)

        // run filter
        let filter = test_form(req.requestBody.formData)
        getSingleLogin(req.requestBody.formData.site).then((res) => {
            // check if its saved already; if not, make it pop up and ask to save

            if (filter && res == "missing") {
                console.log("does not exista nd filter result: ", filter)

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
                                console.log(req.requestBody.formData) // find the key for password and the key for username and create my own object with those variables
                                /*
                                find the key for password and the key for username and create my own object with those variables
                                ex: 
                                req.requestbody.formData = {
                                    passcode32: "password",
                                    user4: "ethan123",
                                    site: "facebook.com"
                                } should be chnaged to:
                                {
                                    password: "password",
                                    username: "ethan123",
                                    site: "facebook.com"
                                }
                                */
                                await chrome.tabs.sendMessage(tab.id, req.requestBody.formData)
                            })
                        // console.log("sent message")
                    }, timeout); // implement a tab reload listener to inject the script after the page has loaded instead of a time limit
                })

            }
        })

    }
}, { urls: ["<all_urls>"] }, ["requestBody"])

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {

    if (data.msg == "save-login") {
        console.log("saving login")
        // save login data
        // filter keys and find which is password and site
        insert_login(data.data.site, data.data.username, data.data.password) // turn into promise

    } else if (data.msg == "delete-login") { }
    else if (data.msg == "get-logins") {
        getLogins().then((logins) => console.log(logins))

    }
})

// create a function to sort through req data
/*
function test_form(data) {
    // USE A REGEX TO TEST URL FOR LOGIN DATA OR LOGIN WORDS BUT FIRST TEST THE REQ.BODY FOR LOGIN PARAMETERS
    const pass_regex = /(pa?s{1,2}[^s]{1,3}(d|e|s):)|(login-?pa?s{1,2}[^s]{1,3}(d|e|s):)/gi // test for pass:, pswd:, passcode:
    const submit_regex = /submit: ?( |\[|'|"){0,2}login( |]|'|"){0,2}|submitlogin/gi // test for "submit: ['Login']" and "submitLogin" add lookback (?) to say 0 or more of ""|'|[
    // create regex to detect email just incase there is no key:value pair or its all in one string (for example youtube.com/signin has a weird req.requestBody)
    //console.log("FORM DATA")
    //console.log(Object.entries(data))
    for (const [key, value] of Object.entries(data)) {
        let str_test = `${key}: ${value}`
        let test = pass_regex.test(str_test)
        //console.log("TEST = " + pass_regex)
        //console.log(str_test, test)
        if (test) return test
        else {
            test = submit_regex.test(str_test)
            //console.log("TEST = " + submit_regex)
            //console.log(str_test, test)
            if (test) return test
        }
    }
    return false

    // get key + val pairs and test them
}*/
function test_form(data) {
    // USE A REGEX TO TEST URL FOR LOGIN DATA OR LOGIN WORDS BUT FIRST TEST THE REQ.BODY FOR LOGIN PARAMETERS
    const pass_regex = /(pa?s{1,2}[^s]{1,3}(d|e|s):)|(login-?pa?s{1,2}[^s]{1,3}(d|e|s):)/gi // test for pass:, pswd:, passcode:
    const submit_regex = /submit: ?( |\[|'|"){0,2}login( |]|'|"){0,2}|submitlogin/gi // test for "submit: ['Login']" and "submitLogin" add lookback (?) to say 0 or more of ""|'|[
    const obfus_regex = null;// create regex to detect email just incase there is no key:value pair or its all in one string (for example youtube.com/signin has a weird req.requestBody)
    console.log("FORM DATA")
    console.log(Object.entries(data))
    for (let [key, value] of Object.entries(data)) {
        let str_test = `${key}: ${value}`
        let test = pass_regex.test(str_test)
        console.log("TEST = " + pass_regex)
        console.log(str_test, test)
        if (test) {
            
            data['password'] = data[key];
            delete data[key]
            
            return data
        }
        else {
            test = submit_regex.test(str_test)
            console.log("TEST = " + submit_regex)
            console.log(str_test, test)
            if (test) return test
        }
    }
    return false

    // get key + val pairs and test them
}

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return await tab;
}


function insert_login(site, user, pswd) {
    return new Promise((resolve, reject) => {
        console.log(site, user, pswd)
        db.put({
            _id: site,
            username: user,
            password: pswd
        }, (err, res) => {
            if (err) reject(err)
            else resolve(res)
        })
    }
    )
}


function getLogins() {
    return new Promise((resolve, reject) => {
        db.allDocs({ include_docs: true, descending: true }, function (err, doc) {
            if (err) reject(err)
            resolve(doc.rows);
        })
    })
}

async function getSingleLogin(site) {
    try {
        let document = await db.get(site);
        return document
    } catch (err) {
        return err.message
    }
}

function removeLogin() { }

function resetDB() {
    db.destroy().catch((err) => console.log(err))
}