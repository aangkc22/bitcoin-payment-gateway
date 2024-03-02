(() => {
    'use strict';
    const mysqlHelper = require("../../../common_helpers/mysql_helper");
    const moduleConfig = require('../../../configs')
  
    function get_db_addresses(incoming_addresses) {

        return new Promise(async (resolve, reject) => {
        try {
            const db_client = await mysqlHelper.init()
            var formatted_incoming_address = "'"+incoming_addresses.join("','")+"'"

          const query = `SELECT email, address, balance FROM ${moduleConfig.table.address_list} where address in (${formatted_incoming_address})`;
          
          let [db_res] = await mysqlHelper.execute(query);
          resolve(db_res.length === 0 ? false : db_res);
        } catch (error) {
          // logger.error(metaData, 'get customer data error', error);
          reject(error);
        }
      });
    }

    function get_address_detail(address) {

      return new Promise(async (resolve, reject) => {
      try {
          const db_client = await mysqlHelper.init()

        const query = `SELECT * FROM ${moduleConfig.table.address_list} where address = (?)`;
        
        let [db_res] = await mysqlHelper.execute(query,[address]);
        
        resolve(db_res.length === 0 ? false : db_res[0]);
      } catch (error) {
        // logger.error(metaData, 'get customer data error', error);
        reject(error);
      }
    });
  }

    const update_new_balance = async (user_id, address, balance) => {
      try {

        return mysqlHelper.query('update `address_list` SET balance=? where user_id=? and address=?', [balance, user_id, address]);
      } catch (error) {
        // logger.error(metaData, 'updateTxn ', error);
        throw error;
      }
    }
    const update_transaction_table = async(user_id, txid, balance,status, address) => {
      try {
        return mysqlHelper.query('insert into `transaction_master` (user_id, txid, balance, status, to_address ) VALUES (?,?,?,?,?)', [user_id, txid, balance, status, address]);
      } catch (error) {
        // logger.error(metaData, 'update_transaction_table ', error);
        throw error;
      }
    }

    const check_txid_exist = async(txid) => {
      return new Promise(async (resolve, reject) => {
        try {
          const db_client = await mysqlHelper.init()

          const query = `SELECT * FROM ${moduleConfig.table.transaction_master} where txid = '${txid}' and status = 'Received'`;
          
          let [db_res] = await mysqlHelper.query(query);
          resolve(db_res.length === 0 ? false : db_res);
        } catch (error) {
          // logger.error(metaData, 'get customer data error', error);
          reject(error);
        }
      });
    }
    module.exports = {
        get_db_addresses: get_db_addresses,
        get_address_detail: get_address_detail,
        update_new_balance: update_new_balance,
        update_transaction_table : update_transaction_table,
        check_txid_exist: check_txid_exist
    }
  })();
  
  
  // CREATE TABLE `issuer_onboard` (
  // 	`id` INT NOT NULL AUTO_INCREMENT,
  // 	`name` varchar(100) NOT NULL,
  // 	`email` varchar(100) NOT NULL,
  // 	`uuid` varchar(50) NOT NULL,
  // 	`phone_no` varchar(10) NOT NULL,
  // 	`upi_id` varchar(15) NOT NULL,
  // 	PRIMARY KEY (`id`,`uuid`,`upi_id`)
  // );