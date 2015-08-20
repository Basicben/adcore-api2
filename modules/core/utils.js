var utils = {
    filters: {
        isEqualNumeric: function (value1, value2) {
            value1 = safeNumber(value1);
            value2 = safeNumber(value2);
            return value1 == value2;
        },
        isEqualText: function (value1, value2) {
            value1 = safeText(value1);
            value2 = safeText(value2);
            return value1 == value2;
        },
        isBeginsWith: function (value, beginsWith) {
            value = safeText(value);
            beginsWith = safeText(beginsWith);
            return value.substring(0, beginsWith.length) == beginsWith;
        },
        isEndsWith: function (value, endsWith) {
            value = safeText(value);
            endsWith = safeText(endsWith);
            return value.indexOf(endsWith, value.length - suffix.length) !== -1;
        },
        isContains: function (value, contains) {
            value = safeText(value);
            contains = safeText(contains);
            return value.indexOf(contains) > -1;
        },
        isGreaterThen: function (value1, value2, equals) {
            value1 = safeNumber(value1);
            value2 = safeNumber(value2);
            if (equals == true)
                return value1 >= value2;
            else
                return value1 > value2;
        },
        isLowerThen: function (value1, value2, equals) {
            value1 = safeNumber(value1);
            value2 = safeNumber(value2);
            if (equals == true)
                return value1 <= value2;
            else
                return value1 < value2;
        },
        isInRange: function (value, range, isArray) {
            value = safeNumber(value);
            if (isArray == true)
                return range.indexOf(value) > -1;
            else
                return range.max >= value && range.min <= value;
        }
    },
    actions: {
    
    }
}

module.exports = utils;

function safeText(text) {
    if (none(text))
        return '';
    
    return text;
}

function safeNumber(number) {
    if (empty(number))
        return 0;
    number = parseFloat2(number);
    return isNaN(number) ? 0 : number;
}

function takeNotEmpty(prm1, prm2) {
    if (!ne(safeText(prm1)))
        return safeText(prm1);
    
    return safeText(prm2);
}

function countWords(str) {
    var count = 0, i , foo = str.length;
    for (i = 0; i <= foo; i++) {
        if (str.charAt(i) == " ")
            count++;
    }
    return count + 1;
}



// -------------------------------------------------------------------
// empty (string is null or empty) - returns true if val is null or ''
// -------------------------------------------------------------------
function empty(val) {
    var ret = !(val != null && (val === '0' || val != ''));
    return ret;
}

// -------------------------------------------------------------------
// none ne(), not 0 and not NaN, undefined, etc...
// -------------------------------------------------------------------
function none(val) {
    return empty(val) || (Number(val) != 0 && !val);
}

var regex_parseFloat2_price_pref = /(?:\b|^)[^\d\s.,-]{1,3}(?=[\s.,-]*\d)/;
var regex_parseFloat2_price_suf = /(\d)(?![.,]\d)\s*[^\d\s]{1,3}(?:\b|$)/;
var regex_parseFloat2_price_pref_test = /(?:\b|^)[^\d\s.,-]+(?=[\s.,-]*\d)/;
var regex_parseFloat2_price_suf_test = /(\d)(?![.,]\d)\s*[^\d\s]+(?:\b|$)/;
//credit: https://gist.github.com/LeoDutra/3057153
//greater chance to return number, used for prices, european formats, etc...
function parseFloat2(value) {
    // if none return 
    if (none(value)) return NaN;
    // if is already number
    if (Number(value)) return Number(value);
    // convert to string
    value = String(value).trim();
    // get length
    var len = value.length;
    //first replace optional currecny pref
    value = value.replace(regex_parseFloat2_price_pref, '');
    //allow ONLY pref or suf change, so if we managed in pref, dont do suf
    if (value.length == len) {
        //then suff
        value = value.replace(regex_parseFloat2_price_suf, '$1');
    }
    //if there is still left text in the sides - it's text, return here
    if (regex_parseFloat2_price_pref_test.test(value) || regex_parseFloat2_price_suf_test.test(value)) return NaN;
    
    value = value.replace(/[^\d,.-]/g, '');
    var sign = value.charAt(0) === '-' ? '-' : '+';
    var minor = value.match(/[.,](\d+)$/);
    value = value.replace(/[.,]\d*$/, '').replace(/\D/g, '');
    return Number(sign + value + (minor ? '.' + minor[1] : ''));
}