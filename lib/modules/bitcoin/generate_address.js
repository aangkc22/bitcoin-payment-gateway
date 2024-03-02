
((btcAddressGeneration) => {

    var bitcoinLib = require("bitcoinjs-lib");
    var bip39 = require('bip39');
    var bip32 = require('bip32');

    var network = bitcoinLib.networks.mainnet
    const currentNetwork = process.env.btc_network
    if (currentNetwork == 'testnet'){
        network = bitcoinLib.networks.testnet
    }

    const helperFunction = {
        decryptMnemonics : async (encryptedMnemonics) => {
            try {
                const cryptography = require('../../common_helpers/cryptography');
                const decryptedKey = await cryptography.decryptAES(encryptedMnemonics);
                return decryptedKey;
            } catch (error) {
                throw new ("Unable To Decrypt Mnemonics")
            }
        },
        encrypttMnemonics : async (rawMnemonics) => {
            try {
                const cryptography = require('../../common_helpers/cryptography');
                const encryptedKey = await cryptography.encryptAES(rawMnemonics);
                return encryptedKey;
            } catch (error) {
                throw new ("Unable To Encrypt Mnemonics")
            }
        },
        
    }
    btcAddressGeneration.p2pkh = async (req, res, next) => {
        try {

            var keyPair = bitcoinLib.ECPair.makeRandom({network: network});
            var address = bitcoinLib.payments.p2pkh({ pubkey : keyPair.publicKey, network: network }).address;
            var public_key = keyPair.publicKey.toString("hex")
            var private_key = keyPair.toWIF();            
            res.status(200).json({ address: address, public_key: public_key, private_key: private_key });

        }catch (error){
            console.log(">>>>>>> error :  ", error);
            throw error;
        }
    }


    btcAddressGeneration.hdAddress = async (req,res, next) => {
        try{
            let mnemonic, encryptedMnemonics;
            var index = (typeof (req.body.index) != "undefined" )? +(req.body.index) : 0;
            if(typeof (req.body.mnemonic) != "undefined"){ // if mnemonics present
                encryptedMnemonics = req.body.mnemonic;
                mnemonic = await helperFunction.decryptMnemonics(encryptedMnemonics);
            }else{
                mnemonic = await bip39.generateMnemonic();
                encryptedMnemonics = await helperFunction.encrypttMnemonics(mnemonic);
            }
            var hd_path = (process.env.btc_network == 'mainnet') ? process.env.btc_main_hd_path  : process.env.btc_test_hd_path;

            const seed = await bip39.mnemonicToSeed(mnemonic);
            const root = bip32.fromSeed(seed, network);
            const account = root.derivePath(hd_path);

            const accountXPub = account.neutered().toBase58(); 
            const node = bip32.fromBase58(accountXPub, network);
            
            const child = node.derive(0).derive(index);
            
            const address = bitcoinLib.payments.p2pkh({ pubkey: child.publicKey, network }).address;
            const pvtKey = account.derive(0).derive(index);

            res.status(200).json({ address: address,  mnemonic : encryptedMnemonics, index: index});


        }catch (err){
            console.log(err)
            throw new Error(err)
        }
    }

})(module.exports);
