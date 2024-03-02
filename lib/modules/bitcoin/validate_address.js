
(() => {
    var bitcoin = require("bitcoinjs-lib");
    var network = bitcoin.networks.mainnet
    const currentNetwork = process.env.btc_network
    if (currentNetwork == 'testnet'){
        network = bitcoin.networks.testnet
    }

    module.exports = async (req,res, next) => {
        try{
            var address = req.body.address;
            bitcoin.address.toOutputScript(address, network);
            res.status(200).json({validate : true});
        }catch(error){
            console.log(error);
            res.status(400).json({validate : false});
        }
    }
})();
