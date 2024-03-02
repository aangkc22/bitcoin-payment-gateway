const { post } = require('request');

(() => {
    var mysql = require('../blockcypher/sql/webhook.sql')    
    const requestHelper = require('../../common_helpers/request_helper')

    const internal_helper = {
        get_balance :  async (address) => {
            const uri = `/addrs/${address}/balance`
            if (process.env.btc_network == 'mainnet'){
                const base_url = process.env.blockcypher_btc_url_mainnet;
                const url = base_url+uri 
                const resp = await requestHelper.makeRestApiCallRequest(url, 'GET')
                const respBody = JSON.parse(resp.body)
                const  bal = (respBody.final_balance)/10 ** 8;
                return bal;
            }else{
                const base_url = process.env.blockcypher_btc_url_testnet;                
                const url = base_url+uri 
                const resp = await requestHelper.makeRestApiCallRequest(url, 'GET')
                const respBody = JSON.parse(resp.body)
                const  bal = (respBody.final_balance)/10 ** 8;
                return bal;
            }
        }
    }
    module.exports = async (req,res, next) => {
        try{
            console.log("processing webhook  >>>  ", req.body.data)

            const post_data = JSON.parse(req.body.data);
            const txid = post_data.hash;
            const oldTx =  await mysql.check_txid_exist(txid);
            if(oldTx){
                console.log("omitting old transcation >>>  ", txid)
                return
            }
            const incoming_addresses = post_data.addresses;
            const valid_addresses_data = await mysql.get_db_addresses(incoming_addresses);
            const valid_addresses = []
            for (var i = 0; i < valid_addresses_data.length; i++){
                valid_addresses.push(valid_addresses_data[i].address)
            }

            const input_addresses = post_data.inputs;
            const input_addresses_list= []
            for (var i  = 0; i < input_addresses.length; i++){
                input_addresses_list.push(input_addresses[i].addresses[0])
            }
            const tx_out = post_data.outputs;
            for (var i = 0; i < tx_out.length; i++){
                var op_address = tx_out[i].addresses[0]; 
                if(valid_addresses.includes(op_address)){
                    var value = 0.0;
                    console.log("processing webhook for  >> " ,op_address)
                    value = (tx_out[i].value / Math.pow(10, 8) );
                    var address_details = await mysql.get_address_detail(op_address);
                    var current_balance = parseFloat(address_details.balance)
                    // var updated_balance = ''+(value + current_balance);
                    if (!input_addresses_list.includes(op_address)){ //excluding change addresses 
                        const updated_balance = await internal_helper.get_balance(address_details.address)
                        await mysql.update_new_balance(address_details.user_id, address_details.address,  updated_balance);
                        await mysql.update_transaction_table(address_details.user_id, txid, value , "Received", address_details.address);
                    }
                }

            }

        }catch (err){
            console.log(err);
            // throw new Error(err)  // so that it wont give error even if skipped
        }
    }

})();
