var CORE = require('../modules/coreManager.js');

var currRes = null;

var core = {
    create: function (req, res) {
        // get data
        var type = req.body.type || '';
        var advertiserId = req.body.advertiserId || '';
        var campaignId = req.body.campaignId || '';
        
        // validation
        if (type == '' || advertiserId == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for this function"
                }
            });
            return;
        }
        
        CORE.create(advertiserId, type, campaignId, function createReturn(obj) {
            res.json(obj);
        });
        
        
    },
    getData: function (req, res) {
        // get data
        var uniq = req.body.uniq || '';
        var pagination = req.body.pagination || null;
        // validation
        if (uniq == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for this function"
                }
            });
            return;
        }
        
        CORE.getData(uniq, pagination, function getDataReturn(obj) {
            res.json(obj);
        });
    },
    sort: function (req, res) { 
        // get data
        var uniq = req.body.uniq || '';
        var sorts = req.body.sorts || null;
        // validation
        if (uniq == '' || sorts == null) {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for this function"
                }
            });
            return;
        }
        
        CORE.sort(uniq, sorts, function getDataReturn(obj) {
            res.json(obj);
        });
    },
    filter: function (req, res) {
        // get data
        var uniq = req.body.uniq || '';
        var filters = req.body.filters || null;
        // validation
        if (uniq == '' || filters == null) {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for this function"
                }
            });
            return;
        }
        
        CORE.filter(uniq, filters, function getDataReturn(obj) {
            res.json(obj);
        });
    }

}


module.exports = core;
