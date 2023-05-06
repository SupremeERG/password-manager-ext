// listen for login msg
let save_noti_css = `<!-- save_notification injection --> <style>#popup {width: 200px;height: 100px;background-color: white;position: absolute;border: 3px solid green;padding-left: 20px;padding-right: 20px;top: 10px;right: 20ch;}#cancel {position: absolute;top: 10px;right: 10px;}.choices {justify-content: center;align-items: center;height: 5px;width: 5px;position: relative;bottom: -1%;right: -20%;padding-right: 12px;padding-left: 12px;padding-top: 8px;padding-bottom: 8px;font-size:10px;} p {font-size: 18px;}</style>`

document.head.insertAdjacentHTML("afterbegin", save_noti_css) // css style for pop up
document.body.insertAdjacentHTML("beforeend", '<div id="popup"> <button id="cancel" id="cancel" type="button">X</button> <p>Would you like to save this password?</p> <button class="choices" id="yes-button" type="button">Yes</button> <button class="choices" id="no-button" type="button">No</button> </div>') // might change to iframe

document.getElementById("cancel").addEventListener("click", () => document.getElementById("popup").remove())
document.getElementById("no-button").addEventListener("click", () => document.getElementById("popup").remove())

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
    console.log(data, sender, sendResponse, "recieved in save_notification.js")
    document.getElementById("yes-button").addEventListener("click", async () => {
        // send a message to service-worker saying the data should be saved
        console.log("clicked yes")
        await chrome.runtime.sendMessage({
            msg: "save-login",
            data
        })
        document.getElementsByTagName("p").item(0).innerText = "Saved";
        let choices_len = document.getElementsByClassName("choices").length;
        for (i = choices_len -1;; i--) { // removes button after yes click
            document.getElementsByClassName("choices").item(i).remove();
            if (i == 0) break;
        }
    })
})


console.log("save_notification.js injected [+]")
