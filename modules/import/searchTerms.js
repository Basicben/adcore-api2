var files = require('../utils/files');
var xml2js = require('xml2js').parseString;

// find diff between 2 files
function findDiff(searchTerms, keywordActual) {
    // init new array to return 
    var diff = [];
    
    // create dictionary adgroupID:keyword
    var keywordActualMap = keywordActual.reduce(function (newObj , obj) {
        newObj[obj['$']['adGroupID'] + ':' + obj['$']['keyword']] = true;
        return newObj;
    }, {});
    
    for (var i = 0; i < searchTerms.length; i++) {
        if (keywordActualMap[searchTerms[i]['$']['adGroupID'] + ':' + searchTerms[i]['$']['searchTerm']] == undefined) {
            diff.push(searchTerms[i]['$']);
                //console.log('keywordActualMap not found: ', searchTerms[i]['$']['adGroupID'] + ':' + searchTerms[i]['$']['searchTerm'], keywordActualMap.indexOf(searchTerms[i]['$']['adGroupID'] + ':' + searchTerms[i]['$']['searchTerm']));
        }
    }
    
    keywordActualMap = null;

    return diff;
}

var _searchTerms = {
    getData: function (advertiserId, campaignId, cb) {
        var folder = 'temp';
        var file1 = 'rpt_1_searchterms.xml', file2 = 'rpt_2_keywords_actual.xml';
        var filesNumber = 2;
        var searchTerms, keywordsActual;
        try { 
            xml2js(files.readFile(folder, file1), function (err, jsonObj) {
                searchTerms = jsonObj;
                xml2js(files.readFile(folder, file2), function (err, jsonObj) {
                    keywordsActual = jsonObj;
                    var diff = findDiff(searchTerms.report.table[0].row, keywordsActual.report.table[0].row);
                    cb(null, diff);
                    searchTerms = null;
                    keywordsActual = null;
                    diff = null;
                });
            });
        } catch (err) { 
            cb(err, null);
        }
    }
}


module.exports = _searchTerms;