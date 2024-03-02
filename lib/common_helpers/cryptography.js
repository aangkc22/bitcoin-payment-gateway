
((addressCryptography) => {
    
    var CryptoJS = require("crypto-js");
    const path = require("path");
    const fs = require('fs');

    addressCryptography.encryptAES = async (mnemonics, password) => {
        try{
            if(!password){
                password = fs.readFileSync(path.resolve(__dirname, ".secret")).toString().trim();
            }
            var ciphertext = CryptoJS.AES.encrypt(mnemonics, password).toString();
            return ciphertext

        }catch (err){
            console.log(err);
            throw new Error(err);
        }
    }

    addressCryptography.decryptAES = async (encryptedKey, password) => {
        try{
            if(!password){
                password = fs.readFileSync(path.resolve(__dirname, ".secret")).toString().trim();
            }
            var bytes  = CryptoJS.AES.decrypt(encryptedKey, password);
            var originalText = bytes.toString(CryptoJS.enc.Utf8);
            return originalText;

        }catch (err){
            console.log(err);
            throw new Error(err)
        }
    }

})(module.exports);
