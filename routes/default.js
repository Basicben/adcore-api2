//var db = require('../middleware/mssql');
// var TYPES = require('tedious').TYPES;
var googleAdwordsXmlDiff = require('../modules/googleAdwordsXmlDiff.js');
var _default = {
    
    _default: function (req, res) {
        console.log(GLOBAL.conf);
        
        // db.query(
        //     "SELECT [outlookID],[date],[outlookPage],[outlookSender],[outlookMsg],[outlookUserIDs],[outlookSubject],[outlookJson] FROM [dbadcore].[report].[tblOutlook]",
        //     function (data, rowCount) {
        //         console.log(data, '* rowCount: ', rowCount);
        //         res.json(data);
        //     },
        //     function (err) {
        //         console.log(err);
        //     });
        
        // db.dynamic(
        //     "SELECT TOP 1 [outlookID],[date],[outlookPage],[outlookSender],[outlookMsg],[outlookUserIDs],[outlookSubject],[outlookJson] FROM [dbadcore].[report].[tblOutlook] where outlookUserIDs = @id",
        //     [{ name: 'id', type: TYPES.VarChar, mode: 'input', value: '13', length: 2 }],
        //     function (data, rowCount) {
        //         console.log(data, '* rowCount: ', rowCount);
        //         res.json(data);
        //     },
        //     function (err) {
        //         console.log(err);
        //     });
        
        googleAdwordsXmlDiff.main(function (obj) {
            res.json(obj);
        });

    }

};

module.exports = _default;
