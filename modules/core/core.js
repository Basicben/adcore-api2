var utils = require('./utils.js');
var filtersManager = require('./filters.js');
var actionsManager = require('./actions.js');

/*** Copyright 2013 Teun Duynstee Licensed under the Apache License, Version 2.0 ***/
var sortBy = function () { function n(n, t) { if ("function" != typeof n) { var r = n; n = function (n, t) { return n[r] < t[r]?-1:n[r] > t[r]?1:0 } } if (1 === n.length) { var u = n; n = function (n, t) { return u(n) < u(t)?-1:u(n) > u(t)?1:0 } } return -1 === t?function (t, r) { return -n(t, r) }:n } function t(t, u) { return t = n(t, u), t.thenBy = r, t } function r(r, u) { var f = this; return r = n(r, u), t(function (n, t) { return f(n, t) || r(n, t) }) } return t }();
// create sort eval code
var sortFirstTemplate = 'sortBy(function (v1) { return v1.[COLUMN_NAME]; }[REVERSE])';
var sortMultiTemplate = '.thenBy(function (v1) { return v1.[COLUMN_NAME]; }[REVERSE])';
var actionEvalTemplate = 'function(){ var [COLUMN_NAME] = [CONTAINER]["[COLUMN_NAME]"]; try{ [COLUMN_ACTOINS] }catch(err){ [COLUMN_NAME]="error"; } return [COLUMN_NAME]; }';

// adcore main
function adcore(settings, advertiserId, campaignId, columns, data, mode) {
    this.uniq = null;
    this.advertiserId = advertiserId;
    this.campaignId = campaignId;
    this.settings = settings;
    this.settings.lastUpdated = Date.now;
    this.settings.columns = columns;
    this.settings.sorts = [];
    this.settings.sortEval = null;
    this.settings.filterEval = null;
    this.data = data;
    this.mode = mode; // ui/job
    this.settings.channel = 'google';
    this.lastActivity = null;
}

// set data to this.data object
adcore.prototype.setData = function (data) {
    this.data = data;
}

// clear data and free memory
adcore.prototype.clearData = function () {
    if(this.data != null)
        this.data.length = 0;
    this.data = null;
}

// if data is null go to the source function and gets data 
adcore.prototype.initData = function (pagination, cb) {
    var _core = this;
    
    // get data from settings
    if (this.settings.source == undefined)
        cb({ err: 'no data  source has been found' });
    
    // prepare data object
    var object = {
        advertiserId: this.advertiserId,
        uniq: this.uniq,
        campaignId: this.campaignId
    }
    
    // get data from source
    this.settings.source[this.settings.channel](object, function (err, result) {
        if (err) {
            cb({ err: err });
        } else {
            _core.setData(result);
            if (typeof (cb) == 'function') {
                _core.getData(pagination, cb);
            }
        }
        result = null;
    })

    _core = null;
}

// get data + filter + actions + sort
adcore.prototype.getData = function (pagination, cb) {
    if (this.data == null) {
        this.initData(pagination, cb);
        return;
    }

    var result = this.data;
    
    if (this.settings.filters) {
        // filter data.
         result = this.filter(result);
    }
    
    if (this.settings.actions) {
        // make formulas
        // result = this.action(result, true);
    }
    
    if (this.settings.sorts) {
        // sort
        result = this.sort(result);
    }
    
    // return data by paging definition 
    this.makePagination(result, pagination, cb);

};

// implements pagination by pagination settings
adcore.prototype.makePagination = function (result, pagination, cb) {
    // set pagention
    this.settings.pagination = pagination;
    
    // get array length
    var length = result.constructor == Array ? result.length : 0;
    if (length == 0) {
        cb({
            length: 0,
            result: []
        });
        return;
    }
    
    // calculate start & end point
    var start = pagination.currentPage * pagination.rows;
    var end = (pagination.rows * pagination.pages) + start;
    
    // validate calculations
    if (start < 0) start = 0;
    if (end <= 0 || end > result.length) end = result.length;
    
    // create pagination.
    var _result = result.slice(start, end);
    
    // return result
    cb({
        length: length,
        result: _result
    });
    
    // init temp data
    _result = null;
    result = null;
}

// filter the data.
adcore.prototype.filter = function (data) {
    if (this.settings.filterEval != null) {
        var _core = this;
        data = data.reduce(function (result, row, index) {
            if (eval(_core.settings.filterEval))
                result.push(row);
            return result;
        }, []);
        _core = null;
    }
    // filter data
    return data;
}

// exec actions on local data - no export.
adcore.prototype.action = function (data, isBasic) {
    // make actions
    return data;
}

// sorting data by sortEval 
adcore.prototype.sort = function (data) {
    // validate sort exists
    if (!isNotNull(this.settings.sortEval))
        return data;
    
    // get sort data
    data = eval('data.sort(' + this.settings.sortEval + ')');
    
    // sort data
    return data;
}

// the export function
adcore.prototype.export = function () {
    // do actions by api.
    var data = this.getData();
    //export 
    this.settings.export[this.settings.channel](object, function (err, result) {
        if (err) {
            cb({ err: err });
        } else {
           
        }
    });
}

// set filters from outside and creating filter Eval
adcore.prototype.setFilters = function (filters, cb) {
    // some validation
    this.settings.filters = isNotNull(filters) ? filters : [];
    if (this.settings.filters.length > 0) {
        this.settings.filterEval = this.createFilterEval(this.settings.filters);
    } else {
        this.settings.filterEval = null;
    }
    // get filtered data
    this.getData(this.settings.pagination, cb);
}

// creating filter Eval by filter list
adcore.prototype.createFilterEval = function (filters) {
    var container = 'row';
    var utilContainer = 'utils.filters';
            
    // remove invalid filters
    for (var i = 0; i < filters.length; i++) {
        if (!this.isValidFilter(filters[i])) {
            filters.splice(i, 1);
            i--;
        }
    }
    
    var filterText = '(';
    // crete filter text
    for (var i = 0; i < filters.length; i++) {
        var filter = filters[i];
        var nextFilter = null;
        var prevFilter = null;
        
        if (i - 1 >= 0)
            prevFilter = filters[i - 1];
        
        if (i + 1 < filters.length)
            nextFilter = filters[i + 1];
        
        if (prevFilter == null || filter.columnName != prevFilter.columnName)
            filterText += '('
        
        filterText += filtersManager[filter.key].createFilterText(container, this.settings.columns[filter.columnName] , filter.params, utilContainer);
        
        if (nextFilter != null) {
            if (filter.columnName != nextFilter.columnName)
                filterText += ')';
            
            if (prevFilter != null && filter.operator != prevFilter.operator)
                filterText += ') ' + filter.operator + ' (';
            else {
                if (filter.columnName != nextFilter.columnName)
                    filterText += ')';
                
                filterText += ' ' + filter.operator;
                
                if (filter.columnName != nextFilter.columnName)
                    filterText += '(';
            }
        } else {
            filterText += '))'
        }
    }
    
    // return if the text is (()) or something like that.
    return filterText.length <= 4 ? null : filterText;
}

// validating filter and return boolean
adcore.prototype.isValidFilter = function (filter) {
    if (filter == undefined || filter.columnName == undefined || filter.key == undefined || filter.operator == undefined)
        return false;
    
    if (this.settings.columns[filter.columnName] == undefined)
        return false;
    
    return true;
}

// set sorts from outside and creating sort Eval
adcore.prototype.setSort = function (sorts , cb) {
    // some validation
    this.settings.sorts = sorts;
    // sort eval string
    this.settings.sortEval = null;
    if (sorts.length > 0) {
        for (var i = 0; i < sorts.length; i++) {
            if (isNotNull(sorts[i].columnName)) {
                this.settings.sortEval = i == 0 ? '' : this.settings.sortEval;
                this.settings.sortEval += this.createSortEval(sorts[i].columnName, sorts[i].order, i == 0);
            }
        }
    }
    // get filtered data
    this.getData(this.settings.pagination, cb);
}

// creating sort Eval for single sort
adcore.prototype.createSortEval = function (columnName, order, isFirst) {
    var template = isFirst ? sortFirstTemplate : sortMultiTemplate;
    var reverse = order == 'desc' ? ', -1' : '';
    return template.replace('[COLUMN_NAME]', columnName).replace('[REVERSE]', reverse);
}

// set actions from outside and creating action Eval for column
adcore.prototype.setActions = function (columnName, actions, cb) {
    // column validation
    if (this.settings.columns[columnName] == undefined) {
        cb({ err : 'no such column: ' + columnName });
    }
    
    // some validation
    this.settings.columns[columnName].actions = actions && actions.length > 1 ? actions : [];
    this.settings.columns[columnName].actionEval = null;
        
    // get filtered data
    this.getData(this.settings.pagination, cb);
}

// creating sort Eval for single sort
adcore.prototype.createActionEval = function (columnName, actions, isFirst) {
    // defualts
    var container = 'row';
    var utilContainer = 'utils.actions';
    
    // remove invalid actions
    for (var i = 0; i < actions.length; i++) {
        if (!this.isValidAction(actions[i])) {
            actions.splice(i, 1);
            i--;
        }
    }
    

    if (actions.length > 1) {
        var actionEvalTemp = actionEvalTemplate.replace(/\[COLUMN_NAME\]/g, columnName).replace(/\[CONTAINER\]/g, container);
        console.log('actionEvalTemp', actionEvalTemp);
        var actionsTemp = '';
        for (var i = 0; i < actions.length; i++) {
                
        }
        return;
    } else { 
        return null;
    }
}

// validating action and return boolean
adcore.prototype.isValidAction = function (action) {
    if (action == undefined || action.key == undefined || actionsManager[action.key] == undefined)
        return false;
    
    return true;
}

// deletes and free memory
adcore.prototype.delete = function () {
    this.uniq = null;
    this.advertiserId = null;
    this.campaignId = null;
    this.settings.lastUpdated = null;
    this.settings.columns = null;
    this.settings.sorts = null;
    this.settings.sortEval = null;
    this.settings.filterEval = null;
    this.settings.channel = null;
    this.settings = {};
    this.settings = null;
    if(this.data != null)
        this.data.length = 0;
    this.data = null;
    this.mode = null; 
    this.lastActivity = null;  
}

module.exports = adcore;

function isNotNull(value) {
    if (value != undefined && value != null && value.length > 0)
        return true;
    else
        return false;
}