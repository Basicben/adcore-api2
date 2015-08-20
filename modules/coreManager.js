var CORE = require('./core/core.js');
var uuid = require('node-uuid');
var columns = require('./core/columns.js');
var settings = require('./core/settings.js');
var moment = require('moment');

var cores = {};

var defualtPagination = {
    currentPage: 0,
    rows: 10,
    pages: 10
};

function getUniq() {
    while (true) {
        var u = uuid.v4();
        if (cores[u] == undefined) return u;
    }
}

var coreManager = {
    create: function (advertiserId, type, campaignId, cb) {
        // get settings
        var typeSettings = settings.getSettings(type);
        var typeColumns = columns.getColumns(type);
        if (typeSettings == undefined || typeColumns == undefined)
            cb({ err: 'invalid type' });
        
        // create new core object
        var core = new CORE(typeSettings, advertiserId, campaignId, typeColumns, null);
        core.uniq = getUniq();
        core.lastActivity = moment();
        
        // create result objecy
        var result = {
            uniq: core.uniq,
            columns: columns.getColumns(type)
        }
        
        cb({
            result: result
        });
        
        cores[core.uniq] = core;
    },
    getData: function (uniq, pagination, cb) {
        // get current core
        var core = cores[uniq];
       
        // validate that core exist
        if (core == undefined)
            cb({ err: 'no core for this uniq' });
        else
            core.lastActivity = moment();
        
        // pagination defualt
        if (pagination == null) {
            pagination = core.settings.pagination == undefined ? defualtPagination : core.settings.pagination;
        }

        // if data not exist
        core.getData(pagination, cb);
    },
    remove: function (uniq, cb) {
        // get current core
        var core = cores[uniq];
        // validate that core exist
        if (core == undefined)
            cb({ err: 'no core for this uniq' });
        else
            core.lastActivity = moment();
        
        // delete
        delete core[uniq];
        core = null;
        cb({ 'result': uniq + ' core has been removed' });
    },
    filter: function (uniq, filters, cb) {
        // validate filters 
        if (!(filters != undefined && filters != null)) {
            cb({ err: 'filters you provided are invalid' });
        }
        // get current core
        var core = cores[uniq];
        // validate that core exist
        if (core == undefined)
            cb({ err: 'no core for this uniq' });
        else
            core.lastActivity = moment();
        
        // filter
        core.setFilters(filters, cb);
    },
    action: function (uniq, columnName, actions, cb) {
        // validate filters 
        if (!(actions != undefined && actions != null && actions.length > -1)) {
            cb({ err: 'filters you provided are invalid' });
        }
        // get current core
        var core = cores[uniq];
        // validate that core exist
        if (core == undefined)
            cb({ err: 'no core for this uniq' });
        else
            core.lastActivity = moment();
        
        // filter
        core.setActions(columnName, actions, cb);
    },
    sort: function (uniq, sorts, cb) {
        // get current core
        var core = cores[uniq];
        // validate that core exist
        if (core == undefined)
            cb({ err: 'no core for this uniq' });
        else
            core.lastActivity = moment();
        
        // filter
        core.setSort(sorts, cb);
    }
};

var minutsToClearData = 8;
var minutsToRemoveCore = 20;
function coreManagerCleaner() {
    console.log('coreManagerCleaner start');
    setTimeout(
        function () {
            coreCleaner();
            coreManagerCleaner();
        }
    , 1000 * 30);
    console.log('coreManagerCleaner end');
}
// start clean object listiner
coreManagerCleaner();

function coreCleaner() { 
    var currentDate = moment();
    console.log('coreCleaner: started at ' + currentDate.toString());
    var core = null;
    for (var key in cores) {
        core = cores[key];
        console.log('core: ' + key + ' coreManagerCleaner check, core last activity' + core.lastActivity.toString());
        var diff = core.lastActivity.diff(currentDate, 'seconds');
        if (core.data != null) {
            if ((diff + (60 * minutsToClearData) < 0)) {
                console.log('core: ' + key + ' has been detected as unused core deletes the data');
                core.clearData();
            }
        } else {
            if ((diff + (60 * minutsToRemoveCore) < 0)) {
                console.log('core: ' + key + ' has been detected as unused core for above of ' + minutsToRemoveCore + '(' + diff + ' seconds) remove core');
                core.delete();
                // save logs and settings then delete the key
                cores[key] = null;
                delete cores[key];
            }
        }
        core = null;
    }
    console.log('coreManagerCleaner: finished');
}
module.exports = coreManager;