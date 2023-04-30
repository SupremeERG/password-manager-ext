// listen for login msg
let save_noti_css = `<!-- save_notification injection --> <style>#popup {width: 200px;height: 100px;background-color: white;position: absolute;border: 3px solid green;padding-left: 20px;padding-right: 20px;top: 10px;right: 20ch;}#cancel {position: absolute;top: 10px;right: 10px;}.choices {justify-content: center;align-items: center;height: 5px;width: 5px;position: relative;bottom: -1%;right: -20%;padding-right: 12px;padding-left: 12px;padding-top: 8px;padding-bottom: 8px;font-size:10px;} p {font-size: 18px;}</style>`
// later implement a check that jquery is not already on the webpage
document.head.insertAdjacentHTML("afterbegin", save_noti_css) // css style for pop up
document.body.insertAdjacentHTML("beforeend", '<div id="popup"> <button id="cancel" id="cancel" type="button">X</button> <p>Would you like to save this password?</p> <button class="choices" id="yes-button" type="button">Yes</button> <button class="choices" id="no-button" type="button">No</button> </div>')

document.getElementById("cancel").addEventListener("click", () => {
    document.getElementById("popup").remove()
    //console.log("clicked on x button")
})
document.getElementById("no-button").addEventListener("click", () => {
    document.getElementById("popup").remove()
    //console.log("clicked on x button")
})

document.getElementById("yes-button").addEventListener("click", () => {
    console.log("yes button clicked")
})

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log(msg, sender, sendResponse, "recieved in save_notification.js")
    //chrome.action.openPopup() //shit still dont work
})
/*
const res = confirm("Would you like to save this password?")

if (!res) console.log("didn't save")
else {
    // save function
}*/


console.log("save_notification.js injected [+]")

// FIGURE OUT A WAY TO INSERT HTML FILES INTO A DOCUMENT

