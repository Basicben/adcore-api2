var fs = require('fs');
var xml2js = require('xml2js').parseString;

var googleAdwordsXmlDiff = {
    readFile: function (folder, fileName) {
        try { 
            var path = GLOBAL.conf.common.folder[folder];
            if (path == undefined)
                return null;
            return fs.readFileSync(path + fileName).toString();
        } catch (err) { 
            return null;
        }
    },
    writeFile: function (folder, name, data) { 
        try {
            var path = GLOBAL.conf.common.folder[folder];
            if (path == undefined)
                return false;
            
            fs.writeFileSync(path + name, data);
            return true; 
        } catch (err) {
            return false;
        }
    },
    main: function (cb) {
        var folder = 'temp';
        var file1 = 'rpt_1_searchterms.xml', file2 = 'rpt_2_keywords_actual.xml';
        var filesNumber = 2;
        var searchTerms, keywordsActual;

        xml2js(googleAdwordsXmlDiff.readFile(folder, file1), function (err, jsonObj) {
            searchTerms = jsonObj;
            //googleAdwordsXmlDiff.writeFile(folder, file1.replace('.xml', '.json'), JSON.stringify(obj1));
            xml2js(googleAdwordsXmlDiff.readFile(folder, file2), function (err, jsonObj) {
                keywordsActual = jsonObj;
                //googleAdwordsXmlDiff.writeFile(folder, file2.replace('.xml', '.json'), JSON.stringify(obj2));   
                
                var diff = googleAdwordsXmlDiff.findDiff(searchTerms.report.table[0].row, keywordsActual.report.table[0].row);

                cb(diff)
            });
        });
    },
    findDiff: function (searchTerms, keywordActual) {
        //console.log('searchTerms', searchTerms.length, 'keywordActual', keywordActual.length);
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
        
        return diff;
    }

}

module.exports = googleAdwordsXmlDiff;