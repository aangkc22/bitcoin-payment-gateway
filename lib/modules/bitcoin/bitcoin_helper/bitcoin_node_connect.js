const { json } = require("express");

((bitcoinNode) => {
    var http = require("http");
    var bitcoinLib = require("bitcoinjs-lib");
    var bs58check = require('bs58check');
 
    const requestHelper = require('../../../common_helpers/request_helper')

    var network = bitcoinLib.networks.mainnet
    const currentNetwork = process.env.btc_network
    if (currentNetwork == 'testnet'){
        network = bitcoinLib.networks.testnet
    }

    bitcoinNode.localnode = async(method, params) => {
        try {
            const url = process.env.bitcoin_node_url;
            const headers = {'Content-type': 'application/json'};
            var payload = {"jsonrpc": "2.0", "id": 1};
            payload['method'] = method;
            payload['params'] = params;
            blockchainResponse = await requestHelper.makeRestApiCallRequest(url, 'POST', JSON.stringify(payload) , headers)
            console.log(blockchainResponse);
            if (blockchainResponse.statusCode == 200){
                return JSON.parse(blockchainResponse.body);
            }else{
                console.log(JSON.parse(blockchainResponse.body))
                throw (blockchainResponse.body)
            }
        } catch (error) {
            console.log(error)
            throw (error)
        }
    }

})(module.exports);
