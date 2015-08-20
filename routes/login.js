var Login = require('../modules/login.js');
var aes = require('../middleware/hash/aes.js');

var login = {
    
    login: function (req, res) {
        
        var username = req.body.username || '';
        var password = req.body.password || '';
        
        if (username == '' || password == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid credentials"
            });
            return;
        }
        
        aes.encrypt(password);

        /*
        //
        
        var userObj = Login.login(username, password);
        if (!dbUserObj) { // If authentication fails, we send a 401 back
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid credentials"
            });
            return;
        }
        
        */

    }, 
    validateUser: function (key) { 
    
    }
}


module.exports = login;
