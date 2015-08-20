var fs = require('fs');

var files = {
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
    }
}

module.exports = files;