'use-strict';
const mysql = require('mysql2/promise');
// const log = require('./logger.helper');
// const { logger } = require('.');
((connection) => {
  let dbClient = null;
  let tranConn = null;
  connection.init = async () => {
    try {
      if (!dbClient) {
        dbClient = await mysql.createPool({
          user: process.env.MYSQL_DB_USER,
          password: process.env.MYSQL_DB_PASSWORD,
          host: process.env.MYSQL_DB_HOST,
          port: process.env.MYSQL_DB_MIGRATION_PORT,
          database: process.env.MYSQL_DB_NAME,
          waitForConnections: true,
          connectionLimit: 100,
          queueLimit: 0,
        });
      }
      return dbClient;
    } catch (err) {
    //   log.error({}, err, 'mysql.database.helper.js', 'connection.init');
      throw err;
    }
  };

  connection.getConnection = async () => {
    try {
      if (!tranConn) tranConn = await dbClient.getConnection();
      return tranConn;
    } catch (error) {
      log.error({}, error, 'mysql.database.helper.js', 'connection.execute');
      throw error;
    }
  };

  connection.execute = (query, fields) => {
    try {
      return (tranConn || dbClient).execute(query, fields);
      // return (tranConn || dbClient).execute(query);
    } catch (error) {
      // log.error({}, error, 'mysql.database.helper.js', 'connection.execute');
      throw error;
    }
  };

  connection.query = async (query, fields, metaData) => {
    try {
      console.log(query, fields)
      let dbResponse = await (tranConn || dbClient).query(query, fields);
      return dbResponse;
    } catch (error) {
      throw error;
    }
  };

  connection.beginTransaction = async () => {
    try {
      if (!tranConn) {
        await connection.getConnection();
      }
      return tranConn.beginTransaction();
    } catch (error) {
      log.error({}, error, 'mysql.database.helper.js', 'connection.beginTransaction');
      throw error;
    }
  };

  connection.commit = async () => {
    try {
      if (!tranConn) {
        await connection.getConnection();
      }
      await tranConn.commit();
      return await connection.release();
    } catch (error) {
      log.error({}, error, 'mysql.database.helper.js', 'connection.commit');
      throw error;
    }
  };

  connection.rollback = async () => {
    try {
      if (!tranConn) {
        await connection.getConnection();
      }
      await tranConn.rollback();
      return await connection.release();
    } catch (error) {
      log.error({}, error, 'mysql.database.helper.js', 'connection.rollback');
      throw error;
    }
  };

  connection.release = () => {
    try {
      if (!tranConn) {
        return;
      }
      tranConn.release();
      tranConn = null;
      return;
    } catch (error) {
      log.error({}, error, 'mysql.database.helper.js', 'connection.end');
      throw error;
    }
  };

  connection.end = () => {
    try {
      return dbClient.end();
    } catch (error) {
      log.error({}, error, 'mysql.database.helper.js', 'connection.end');
      throw error;
    }
  };

  connection.escape = (string) => {
    try {
      return dbClient.escape(string);
    } catch (error) {
      log.error({}, error, 'mysql.database.helper.js', 'connection.escape');
      throw error;
    }
  };

  connection.escapeId = (string) => {
    try {
      return dbClient.escapeId(string);
    } catch (error) {
      log.error({}, error, 'mysql.database.helper.js', 'connection.escapeId');
      throw error;
    }
  };

  connection.format = (query, ...args) => {
    try {
      return dbClient.format(query, args);
    } catch (error) {
      log.error({}, error, 'mysql.database.helper.js', 'connection.format');
      throw error;
    }
  };

  connection.count = (query) => {
    try {
      query = query.replace(/"/g, "'").toLowerCase().trim();
      const selectIndex = this.getIndexofKey(query, 'select');
      const fromIndex = this.getIndexofKey(query, 'from ');
      query = query.substring(selectIndex, 6) + ' count(*) count ' + query.substring(fromIndex, query.length);
      if (selectIndex === -1 || fromIndex === -1 || selectIndex !== 0 || fromIndex === 0) {
        throw new Error('Bad count query request');
      }
      const orderIndex = this.getIndexofKey(query, 'order by ');
      if (orderIndex > 0) {
        query = query.substring(0, orderIndex);
      } else {
        const limitIndex = this.getIndexofKey(query, 'limit ');
        if (limitIndex > 0) {
          query = query.substring(0, limitIndex);
        }
        const offsetIndex = this.getIndexofKey(query, 'offset ');
        if (offsetIndex > 0) {
          query = query.substring(0, offsetIndex);
        }
      }
      return dbClient.query(query);
    } catch (error) {
      log.error({}, error, 'mysql.database.helper.js', 'connection.format');
      throw error;
    }
  };
  connection.getIndexofKey = (query, key) => {
    return query.search(`${key}(?=(?:[^']*'[^']*')*[^']*$)`);
  };

  connection.queryFormat = (query, values) => {
    try {
      return (dbClient.config.queryFormat = function (query, values) {
        if (!values) return query;
        return query.replace(
          /\:(\w+)/g,
          function (txt, key) {
            if (values.hasOwnProperty(key)) {
              return this.escape(values[key]);
            }
            return txt;
          }.bind(this)
        );
      });
    } catch (error) {
      log.error({}, error, 'mysql.database.helper.js', 'connection.init');
      throw error;
    }
  };

  connection.makeWhereQuery = (opts) => {
    let string = `WHERE `;
    Object.entries(opts).forEach(([key, value]) => {
      typeof value !== 'undefined' ? (string += `${key} = ${value} AND `) : '';
    });
    string = string.substring(0, string.length - 5);
    return string;
  };

  connection.makeUpdateQuery = (opts) => {
    let updateString = `updated_date = ?, `,
      updateArr = [new Date().getTime()];
    Object.entries(opts).forEach(([key, value]) => {
      typeof value !== 'undefined' ? (updateString += `${key} = ?, `) : '';
      updateArr.push(value);
    });
    updateString = updateString.substring(0, updateString.length - 2);
    return {
      updateString,
      updateArr,
    };
  };
})(module.exports);
