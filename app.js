var _ = require('lodash');
var request = require("request");


var users = [
    {id: 0, cookie:{}},
    {id: 1, cookie:{}}
];

var loginOptions = {
    url: 'http://localhost:8086/api/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'      
    },
    body: {
        password: "password",
        realm: "intraday",
        username: "admin"
    },
    json: true,
};

function updateCookie(request, userId){
    var rc = {},
        cookie = request.headers['set-cookie'][0];

    parts = cookie.split(';');
    parts.forEach(function(part){
        keyval = part.split('=');
        rc[keyval[0]] = keyval[1];
    });
    users[userId].cookie = rc;
}

function cookieToString(cookie){
    console.log(cookie);
    var strOut;
    // if propertyName not in ['Path', 'Expires', 'Max-Age'];
    _.forIn(cookie, function(property, key){
        if (strOut){
            strOut = strOut +  '; ' + property + '=' + key;    
        } else {
            strOut = property + '=' + key;
        }
    });
    return strOut;
}

// function getCookies (request) {
//     var rc = {},
//         cookie = request.headers['set-cookie'][0];

//     parts = cookie.split(';');
//     parts.forEach(function(part){
//         keyval = part.split('=');
//         rc[keyval[0]] = keyval[1];
//     });
//     return rc;
// }

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = body;
        console.log(response.statusCode);
        // console.log(response.headers)
        cookies = updateCookie(response, 0);
        console.log(cookieToString(users[0].cookie));
        options2.headers.Cookie = 'lb-session-key_intraday=' + users[0].cookie['lb-session-key_intraday'];
        request(options2, callback2); 
    } else {
        console.log(response.statusCode);
        console.log(response.body);
    }
}




options2 = {
    url: 'http://localhost:8086/api/bankHierarchy',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: {},
    json: true,
};

function callback2(error, response, body) {
    if (!error && response.statusCode == 200) {
        // var info = body;
        console.log(response.body);
    } else {
        console.log(response.statusCode);
        console.log(response.body);
    }
}


request(loginOptions, callback); 

