// main settings object 
// for each type includes source & export function
var settings = {
    searchTerms: {
        source: {
            google: function (object, cb) {
                // validate object
                if (object.advertiserId == undefined || object.campaignId == undefined)
                    cb('error on data source for type', null);
                
                var _source = require('../import/searchTerms.js');
                _source.getData(object.advertiserId, object.campaignId, cb);

            }
        },
        export: {
            google: function (object, cb) { 
        
            }
        }
    }
}


var settingsManager = {
    getSettings: function (type) {
        return settings[type];
    }
}

module.exports = settingsManager;
