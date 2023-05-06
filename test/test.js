import PouchDb from 'pouchdb-browser'
// This is what our customer data looks like.

const db = new PouchDb('passwords');

console.log("test in main.js")

//insert_login('facebook.com', "ehit_2708", "test123").then(res => console.log(res))

function insert_login(site, user, pswd) {
    return new Promise((resolve, reject) => {
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

getLogins()


function getLogins() {
    db.allDocs({ include_docs: true, descending: true }, function (err, doc) {
        console.log(doc.rows)
    })
}

function resetDB() {
    db.destroy().catch((err) => console.log(err))
}