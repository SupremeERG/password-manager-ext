let test1 = {
    "password": "mypasscode",
    "username": "ehit_2708",
}
let test2 = {
    "blah": "mypasscode",
    "spabklj": "ethang@yahoo.com"
}
let test3 = {
    "submit": "Login",
    "password": "mypasscode",
    "username": "ehit_2708",
}
let test4 = {
    "submit": "Login",
    "pafsd": "mypasscode",
    "username": "ehit_2708"
}
let test5 = {
    "passwd": "mypsscode",
    "username": "ehit_2708"
}




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

console.log(test_form(test4))