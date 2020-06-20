const { ERROR_CODE_SERVER_ERROR } = require('./errorCodes');
const mysql = require('mysql');
const mysqlconfig = require('../.mysqlconfig.json');

const connection = mysql.createConnection(mysqlconfig);

connection.connect();

function query(request) {
  return new Promise((resolve, reject) => {
    connection.query(request, (error, results) => {
      if (error) {
        console.log(error);
        reject(new Error(ERROR_CODE_SERVER_ERROR));
      } else {
        resolve(results);
      }
    });
  })
}

module.exports = {
  query,
};
