var types = {
    numeric: ['number', 'money', 'precent'],
    string: ['string', 'uniq']
}

var actions = {
    'math': {
        createActionText: function (container, column, values, utilContainer) {
            // numbers
            if (types.numeric.indexOf(column.type) > -1) {
                return utilContainer + '.isEqualNumeric(' + container + '["' + column.name + '"], "' + values[0] + '")';
            } else {
                // strings
                if (types.string.indexOf(column.type) > -1) {
                    return utilContainer + '.isEqualText(' + container + '["' + column.name + '"], "' + values[0] + '")';
                }
            }
        }
    }
}

module.exports = actions;


function safeNumber(number) {
    if (empty(number))
        return 0;
    number = parseFloat2(number);
    return isNaN(number) ? 0 : number;
}