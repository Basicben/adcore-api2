var Crypto = require('crypto');
//var Buffer = require('buffer');

// consts
var salt = new Buffer('1Ef2R8Gt386d5SAx29y54F');
var secret = 'z2z2g37X78kLpZoZqwzq77';
var aesOptions = {
    keySize : 22,
    blockSize : 128,
    algorithm: 'aes256',
    iterations: 1000
};

var aes = {
    encrypt: function (text) {
        var encText = '';
        
        try {
            var key = Crypto.pbkdf2Sync(secret, salt, aesOptions.iterations, aesOptions.keySize);
            var aesData = {};
            aesData['key'] = Crypto.pseudoRandomBytes(aesOptions.keySize / 8);
            aesData['iv'] = Crypto.pseudoRandomBytes(aesOptions.blockSize / 8);
            encryptor = Crypto.createCipheriv(aesOptions.algorithm, aesData.key, aesData.iv);
            encryptor.setEncoding('base64');
            encryptor.write(text);
            encryptor.end();
            encText = encryptor.read();
            console.log(encText);
        } catch (err) {
            console.log(err);
        };
        
        
        return encText;
    },
    decrypt: function (encText) {
        var text = '';
        
        return text;
    }
}

module.exports = aes;