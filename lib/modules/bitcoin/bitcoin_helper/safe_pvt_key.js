
((privKeyEncrypt) => {
    var Bip38 = require('bip38');

    privKeyEncrypt.bip38Enc = async(pvtKey, secret) => {
        var bip38 = new Bip38();
        var encrypted = bip38.encrypt(pvtKey, secret);
        return encrypted;
    } 


    privKeyEncrypt.bip38Dec = async(encryptedKey, secret) => {
        var deccrypted = Bip38.decrypt(encryptedKey, secret);
        return deccrypted;
    } 
})(module.exports);
