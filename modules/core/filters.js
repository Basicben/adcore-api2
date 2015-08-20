var types = {
    numeric: ['number', 'money', 'precent'],
    string: ['string', 'uniq']
}

var filters = {
    'equal': {
        createFilterText: function (container, column, values, utilContainer) {
            // numbers
            console.log('column', column);
            if (types.numeric.indexOf(column.type) > -1) {
                return utilContainer + '.isEqualNumeric(' + container + '["' + column.name + '"], "' + values[0] + '")';
            } else {
                // strings
                if (types.string.indexOf(column.type) > -1) {
                    return utilContainer + '.isEqualText(' + container + '["' + column.name + '"], "' + values[0] + '")';
                }
            }
        }
    },
    'notEqual': {
        createFilterText: function (container, column, values, utilContainer) {
            // numbers
            if (types.numeric.indexOf(column.type) > -1) {
                return '!' + utilContainer + '.isEqualNumeric(' + container + '["' + column.name + '"], "' + values[0] + '")';
            } else {
                // strings
                if (types.string.indexOf(column.type) > -1) {
                    return '!' + utilContainer + '.isEqualText(' + container + '["' + column.name + '"], "' + values[0] + '")';
                }
            }
        }
    }, 
    'begins': {
        createFilterText: function (container, column, values, utilContainer) {
            // strings
            if (types.string.indexOf(column.type) > -1) {
                return utilContainer + '.isBeginsWith(' + container + '["' + column.name + '"], "' + values[0] + '")';
            } else {
                return '1 == 1'
            }
        }
    }, 
    'ends': {
        createFilterText: function (container, column, values, utilContainer) {
            // strings
            if (types.string.indexOf(column.type) > -1) {
                return utilContainer + '.isEndsWith(' + container + '["' + column.name + '"], "' + values[0] + '")';
            } else {
                return '1 == 1'
            }
        }
    }, 
    'contains': {
        createFilterText: function (container, column, values, utilContainer) {
            // strings
            if (types.string.indexOf(column.type) > -1) {
                return utilContainer + '.isContains(' + container + '["' + column.name + '"], "' + values[0] + '")';
            } else {
                return '1 == 1'
            }
        }
    }, 
    'notContains': {
        createFilterText: function (container, column, values, utilContainer) {
            // strings
            if (types.string.indexOf(column.type) > -1) {
                return '!' + utilContainer + '.isContains(' + container + '["' + column.name + '"], "' + values[0] + '")';
            } else {
                return '1 == 1'
            }
        }
    }, 
    'greater': {
        createFilterText: function (container, column, values, utilContainer) {
            // numbers
            if (types.numeric.indexOf(column.type) > -1) {
                return utilContainer + '.isGreaterThen(' + container + '["' + column.name + '"], "' + values[0] + '", false)';
            } else {
                return '1 == 1';
            }
        }
    }, 
    'greaterEquals': {
        createFilterText: function (container, column, values, utilContainer) {
            // numbers
            if (types.numeric.indexOf(column.type) > -1) {
                return utilContainer + '.isGreaterThen(' + container + '["' + column.name + '"], "' + values[0] + '", true)';
            } else {
                return '1 == 1';
            }
        }
    }, 
    'lower': {
        createFilterText: function (container, column, values, utilContainer) {
            // numbers
            if (types.numeric.indexOf(column.type) > -1) {
                return utilContainer + '.isLowerThen(' + container + '["' + column.name + '"], "' + values[0] + '", false)';
            } else {
                return '1 == 1';
            }
        }
    }, 
    'lowerEquals': {
        createFilterText: function (container, column, values, utilContainer) {
            // numbers
            if (types.numeric.indexOf(column.type) > -1) {
                return utilContainer + '.isLowerThen(' + container + '["' + column.name + '"], "' + values[0] + '", true)';
            } else {
                return '1 == 1';
            }
        }
    },
    'range': {
        createFilterText: function (container, column, values, utilContainer) {
            // numbers
            if (types.string.indexOf(column.type) > -1)
                return '1 == 1';
            
            var range = values[0];
            if (range.indexOf("-") > 0) {
                range = range.split('-');
                return utilContainer + '.isInRange(' + container + '["' + column.name + '"], { min: "' + range[0] + '" , max: "' + range[1] + '" } , false)';
            } else if (range.indexOf(",")) {
                range = range.split(',');
                range = range.reduce(function (result, item, index) {
                    if (!isNaN(item)) {
                        result += item + ',';
                    }
                    return result;
                }, '');
                if (range.length == 0)
                    return '1==1';
                range = range.substring(0, range.length - 1);
                return utilContainer + '.isInRange(' + container + '["' + column.name + '"], [' + range + '] , true)';
            } else {
                return '1==1'
            }
            
        }
    },
    'value': {
        createFilterText: function (container, column, values, utilContainer) {
            // numbers
            if (types.numeric.indexOf(column.type) > -1) {
                return utilContainer + '.isLowerThen(' + container + '["' + column.name + '"], "' + values[0] + '", true)';
            } else {
                return '1 == 1';
            }
        }
    },
    'length': {
        createFilterText: function (container, column, values, utilContainer) {
            // numbers
            if (types.numeric.indexOf(column.type) > -1) {
                return utilContainer + '.isLowerThen(' + container + '["' + column.name + '"], "' + values[0] + '", true)';
            } else {
                return '1 == 1';
            }
        }
    },
    'duplicates': {
        createFilterText: function (container, column, values, utilContainer) {
            // numbers
            if (types.numeric.indexOf(column.type) > -1) {
                return utilContainer + '.isLowerThen(' + container + '["' + column.name + '"], "' + values[0] + '", true)';
            } else {
                return '1 == 1';
            }
        }
    }
}

module.exports = filters;


function safeNumber(number) {
    if (empty(number))
        return 0;
    number = parseFloat2(number);
    return isNaN(number) ? 0 : number;
}