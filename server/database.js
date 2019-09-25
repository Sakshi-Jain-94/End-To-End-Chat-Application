/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
/* eslint-disable no-use-before-define */
/* eslint-disable eqeqeq */
/* eslint-disable no-console */
/* eslint-disable indent */
/* eslint-disable keyword-spacing */

const mysql = require('mysql');

module.exports = {
    test: 'sakshi',
    connection: null,
    createConnection() {
    // creating mysql Connection

        const con = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'my-chat',
        });

        con.connect((err) => {
            if (err) throw err;
            console.log('database Connected!');
        });

        // making sql query to be used as promise
        con.promise = sql => new Promise((resolve, reject) => {
            con.query(sql, (err, result) => {
                if (err) {
                    reject(new Error());
                } else {
                    resolve(result);
                }
            });
        });
        this.connection = con;
        console.log('create conn ');
        // my sql connection ends
    },
    getHistoryData(customerID, agentID) { // agent id will always be string
      console.log('get history', customerID);
      let sql = '';
      if(Array.isArray(customerID)) {
          sql = `SELECT chatID,customerID,agentID,message,msgBy,intent,createdOn FROM customerChats WHERE customerID IN (${customerID.join(',')}) ${agentID ? (` AND agentID = '${agentID}'`) : ''}`;
      }else{
          sql = `SELECT chatID,customerID,agentID,message,msgBy,intent,createdOn FROM customerChats WHERE customerID = ${customerID} ${agentID ? (` AND agentID = '${agentID}'`) : ''}`;
      }
      console.log(sql);
      return this.connection.promise(sql);
    },
    createChatId(agentID, customerID, department) {
        let sql = '';
        if(agentID) {
            sql = `INSERT INTO chatInfo (agentID, customerID, department, status) VALUES ('${agentID}','${customerID}','${department}','${agentID ? 'a' : 'p'}')`;
        }else{
            sql = `INSERT INTO chatInfo (customerID, department, status) VALUES ('${customerID}','${department}','${agentID ? 'a' : 'p'}')`;
        }
        console.log(sql);
        return this.connection.promise(sql);
    },
    saveChatMsg(data) {
        const dataString = data.join("','");
        const sql = `INSERT INTO customerChats (agentID, chatID,message,customerID,msgBy,intent) VALUES ('${dataString}')`;
        console.log(sql);
        return this.connection.promise(sql);
    },
    closeChat(data) {
      const sql = `UPDATE chatInfo SET status = 'c' WHERE ID = ${data.chatID}`;
      console.log(sql);
      return this.connection.promise(sql);
    },
    updatePendingChat(data) {
      const sql = `UPDATE chatInfo SET status = 'a' , agentID = '${data.agentName}' WHERE ID = ${data.chatID}`;
      console.log(sql);
      return this.connection.promise(sql);
    },
    getChatInfoForUser(data) {
      const sql = `SELECT * FROM chatInfo WHERE customerID = '${data.userName}' AND status <> 'c' ORDER BY createdOn DESC`;
      console.log(sql);
      return this.connection.promise(sql);
    },
    getActiveNPendingChats() {
      const sql = 'SELECT * FROM chatInfo WHERE status IN ( \'a\', \'p\')';
      console.log(sql);
      return this.connection.promise(sql);
    },
    validateAgent(agentID, password) {
      const sql = `SELECT * FROM agentsInfo WHERE agentID = '${agentID}' AND password = '${password}'`;
      console.log(sql);
      return this.connection.promise(sql);
    },
    getAllAgents() {
      const sql = 'SELECT * FROM agentsInfo';
      console.log(sql);
      return this.connection.promise(sql);
    },
};
