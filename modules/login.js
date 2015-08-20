var db = require('../middleware/mssql.js');
var jwt = require('jwt-simple');

var login = {
    // login function returns null or object with user and token.
    login: function (username, password) {
        
        // encrypt password
        
        // Fire a query to your DB and check if the credentials are valid
        //var UserObj = auth.validate(username, password);
        
        if (UserObj) {
            // If authentication is success, we will generate a token and dispatch it to the client
            // save log.
            var token = genToken(dbUserObj);
            return token;
        }
        
        // save log
        return null;
    },
    validate: function (username, password) {
        var user = {};
        // call to db.
        return user;
    }
}

// private method
function genToken(user) {
    var expires = expiresIn(7); // 7 days
    var token = jwt.encode({
        exp: expires,
        email: user.email,
        // all user additional info.
        // roleLevel: user.roleLevel
    }, require('../config/secret')());
    
    return {
        token: token,
        expires: expires,
        user: user
    };
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = login;