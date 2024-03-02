(() => {
    var http = require("http");
    var bitcoinLib = require("bitcoinjs-lib");
    var bip39 = require('bip39');
    var bip32 = require('bip32');

    var hdkey = require('hdkey');
    var createHash = require('create-hash');
    var bs58check = require('bs58check');
    // var Mnemonic = require('bitcore-mnemonic');
    const btcWrapcore = require('./bitcoin_helper/bitcoin_wrapcore')



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
        }        
    }

    module.exports = async (req,res, next) => {
        try{
            const body = JSON.parse(req.body.data);

            console.log(">>>>>>>>>>..inside forward balance <<<<<<<<<< ")
            var index = +body.index;  //type case to int
            const encryptedMnemonic = body.mnemonic;
            const mnemonic = await helperFunction.decryptMnemonics(encryptedMnemonic);

            const tosign = body.tosign;
            console.log("to sign is >>>>", tosign);
            
            var hd_path = (currentNetwork == 'mainnet') ? process.env.btc_main_hd_path  : process.env.btc_test_hd_path;
            const seed = await bip39.mnemonicToSeed(mnemonic);
            const root = bip32.fromSeed(seed, network);
            const account = root.derivePath(hd_path);
            var pvtKey = account.derive(0).derive(index);
            pvtKey = pvtKey.toWIF();

            // const keyBuffer = Buffer.from(pvtKey, 'hex')
            var keys = bitcoinLib.ECPair.fromWIF(pvtKey,network)


            var signed_utxo = []
            var public_keys = []
            for (var i = 0; i< tosign.length; i++){
                var signature = await bitcoinLib.script.signature.encode(
                    keys.sign(Buffer.from(tosign[i], "hex")),
                    0x01,
                  ).toString("hex").slice(0, -2);
                  signed_utxo.push(signature);
                  var pb = keys.publicKey.toString('hex');
                  public_keys.push(pb);
            }

              return res.status(200).json({signature : signed_utxo, pubkeys : public_keys});

        }catch(error){
            console.log(error);
            return res.status(400).json({});
        }

    }


})();




