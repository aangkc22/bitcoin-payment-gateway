const { json } = require("express");

((btcWrapCore) => {
    var http = require("http");
    var bitcoinLib = require("bitcoinjs-lib");
    var bip39 = require('bip39');
    var hdkey = require('hdkey');
    var createHash = require('create-hash');
    var bs58check = require('bs58check');
    // var Mnemonic = require('bitcore-mnemonic');
    const bitcoinNode = require('./bitcoin_node_connect')


    var network = bitcoinLib.networks.mainnet
    const currentNetwork = process.env.btc_network
    if (currentNetwork == 'testnet'){
        network = bitcoinLib.networks.testnet
    }

    btcWrapCore.getRawTransaction = async(txid) => {
        try {
            const method = 'getrawtransaction';
            const param = [txid, 1];
            const resp = await bitcoinNode.localnode(method, param);
            console.log(resp);
        }catch (error){
            console.log(error);
        }
    }

    btcWrapCore.createrawTransaction = async () => {
        const method = 'createrawtransaction';
        const input = [{
            txid: '9702b0cf6b0695e935c08460ff19ddcc38c2965378d21a49b2cfd6cee4614ce2',
            vout : 0
        }]
        const output = {
            'bcrt1qv3a2rln5rayhwutkn684r2f08a0jr7035f82y0' : 10,
            'miZhj2sxgcahNuyFotBtMDRxsnvyZ2EVjc': 39.993
        }

        param = [input, output]
        const resp = await bitcoinNode.localnode(method, param);

        const rawTrxn = resp.result;
        return rawTrxn; 
    
    }

    btcWrapCore.signrawTransactionWithkey = async (hexString, privatekey) => {
        const method = 'signrawtransactionwithkey';

        param = [hexString, [privatekey]]
        var resp = await bitcoinNode.localnode(method, param);
        const signedhex = resp.result.hex
        console.log(signedhex);
        return signedhex;
    }

    btcWrapCore.sendRawTransaction = async (hexString) => {
        const method = 'sendrawtransaction';

        param = [hexString]
        var resp = await bitcoinNode.localnode(method, param);
        const txid = resp.result;
        console.log(txid)
        return txid;
    }

})(module.exports);
