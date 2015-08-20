var Advertiser = require('../modules/advertiser.js');

var currRes = null;

var advertiser = {
    addAgency: function (req, res) {
        var agency = req.body.agency || '';
        var credentials = req.body.credentials || '';
        var parent = req.body.parent || '';
        
        //
        if (agency == '' || parent == '' || credentials == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid data for this function"
            });
            return;
        }
        
        // more validations.
        

        // go to module
        Advertiser.addAgency(agency, parent, credentials, function (obj) {
            res.json(obj);
        });
            
    },
    addClient: function (req, res) {
        var client = req.body.client || '';
        var credentials = req.body.credentials || '';
        var parent = req.body.parent || '';
        
        if (client == '' || credentials == '' || parent == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid data for this function"
            });
            return;
        }
        
        // more validations.
        // email exists 
        // password length - convention.
        
        // go to module
        Advertiser.addClient(client, parent, credentials, function (obj) {
            res.json(obj);
        });
    },
    addSystem: function (req, res) {
        var system = req.body.system || '';
        var credentials = req.body.credentials || '';
        
        if (system == '' || credentials == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid data for this function"
            });
            return;
        }
        
        // more validations.
        // email exists 
        // password length - convention.
        
        // go to module
        Advertiser.addSystem(system, credentials, function (obj) {
            res.json(obj);
        });
    },
    get: function (req, res) {
        var id = req.query.id || '';
        
        if (id == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid data for this function"
            });
            return;
        }

        Advertiser.get(id , function (obj) {
            res.json(obj);
        });
    },
    getChildrens: function (req, res) { 
    
    },
    addChildren: function (req, res) { 
    
    },
    updateAgency: function (req, res) { 
      
    },
    updateClient: function (req, res) { 
      
    },
    updateSystem: function (req, res) { 
      
    },
    update: function (req, res) { 
      
    }
}


module.exports = advertiser;
