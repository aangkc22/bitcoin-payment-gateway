(() => {
    var http = require("http");
    var bitcoinLib = require("bitcoinjs-lib");
    var bip39 = require('bip39');
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

    module.exports = async (req,res, next) => {
        try{
        // const mnemonic = "barrel swing leisure idle fine local hole purchase menu latin strategy hundred";
        // const seed = await bip39.mnemonicToSeed(mnemonic); //creates seed buffer
        // const root = hdkey.fromMasterSeed(seed);
        // const masterPrivateKey = root.privateKey.toString('hex');
        // const pvt_key =  addrnode._privateKey.toString('hex')
        // var tx = new bitcoinLib.TransactionBuilder();
        // const abc = await btcWrapcore.getRawTransaction('e05d972c8ff98901cc598d0e1f49d82b36ef14859842e3ab3a8b889a8ca12a13')
        // console.log(abc)

        const rawTx =  await btcWrapcore.createrawTransaction()
            
        const pvtKey = 'cSbqjmfCb2C8h3LsMNRpAkqD3fdindMtYeavWhdWcL3mwhJsrmch'; //hd
        // const pvtKey = 'cVhXfqgmrbcDSoWxA4sVUjHYmN2FZnW5WeGRuNhRoc177thpDWHg'  //wallet
        const signedHex = await btcWrapcore.signrawTransactionWithkey(rawTx, pvtKey);
        const txid = await btcWrapcore.sendRawTransaction(signedHex);
        res.status(200).json({ txid: txid, 'message': 'Transaction Sucess'});

        }catch(error){
            console.error();
            throw(error)
        }

    }


})();
