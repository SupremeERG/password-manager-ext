import PouchDb from 'pouchdb-browser'
// This is what our customer data looks like.

const db = new PouchDb('passwords');

getLogins().then((logins) => {
    let i = 1
    logins.forEach(async (element) => {
        try {
            let tablebody = document.getElementById("tablebody");
            tablebody.insertAdjacentHTML("beforeend", `<tr>
        <th scope="row">${element.doc._id}</th>
        <td>${element.doc.username}</td>
        <td>${element.doc.password}</td>
      </tr>`)``
            console.log(element);
            i++;
        } catch (err) {
            console.log(i, err)
        }
    });
})


// might sendMessage to the background script to execute insert_login function
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


function getLogins() {
    return new Promise((resolve, reject) => {
        db.allDocs({ include_docs: true, descending: true }, function (err, doc) {
            if (err) reject(err)
            else resolve(doc.rows)
        })
    })
}

function resetDB() {
    db.destroy().catch((err) => console.log(err))
}