/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
/* eslint-disable no-use-before-define */
/* eslint-disable eqeqeq */
/* eslint-disable no-console */
/* eslint-disable indent */
/* eslint-disable keyword-spacing */
/* eslint-disable space-before-function-paren */
/* eslint-disable func-names */
/* eslint-disable max-len */
const DB = require('./database');
const Helper = require('./helper.js');
const TripPlanner = require('./tripPlanner.js');
const CONSTANTS = require('./constants.js');

module.exports = {
    history: {},
    agentsList: {},
    getHistoryForActiveUsers(activeUserIds) {
      DB.getHistoryData(activeUserIds)
      .then((result) => {
        result.forEach((chat) => {
          if(typeof this.history[chat.customerID] != 'undefined') {
            this.history[chat.customerID] = [chat];
          }else{
            this.history[chat.customerID].push(chat);
          }
        });
      }, (e) => {
          console.log('error fethcing history of activer users', e);
      });
    },
    sendHistoryToUser(wsConnection, userData, callback) {
      let userHistory = [];
      if(typeof this.history[userData.userName] != 'undefined') {
        userHistory = this.history[userData.userName];
        this.sendMsgToWebsocket(wsConnection, userHistory, CONSTANTS.HISTORY);
        if(callback) {
          callback();
        }
      } else {
        // get history from db
        DB.getHistoryData(userData.userName)
        .then((result) => {
            this.sendMsgToWebsocket(wsConnection, result, CONSTANTS.HISTORY);
            this.history[userData.userName] = result;
            if(callback) {
              callback();
            }
        }, (e) => {
          console.log('error fetching history', e);
        });
      }
    },
    sendHistoryToAgent(wsConnection, userData) {
      DB.getHistoryData(userData.userName, userData.agentName)
        .then((result) => {
            this.sendMsgToWebsocket(wsConnection, result, CONSTANTS.HISTORY);
        }, (e) => {
          console.log('error getting history for agent', e);
        });
    },
    sendMsgToWebsocket(wsConnection, data, type) {
        if(wsConnection && wsConnection.length > 0) {
          wsConnection.forEach((WS) => {
            WS.sendUTF(
                JSON.stringify({ type, data }),
            );
          })
        }
    },
    sendUserMsgToHistory(userData, msg, intent) {
        // we want to keep history of all sent messages
        const obj = {
            createdOn: (new Date()).toISOString(),
            message: Helper.htmlEntities(msg),
            customerID: userData.userName,
            agentID: userData.agentName,
            msgBy: CONSTANTS.USER,
            intent: intent || null,
        };
        try{
          this.history[userData.userName].push(obj);
        }catch(e) {
          console.log('error pushing to history object', userData.userName, e);
        }
        DB.saveChatMsg([userData.agentName, userData.chatID, msg, userData.userName, CONSTANTS.USER, obj.intent])
            .then((result) => {
                console.log(result.message);
            }, (e) => {
                console.log(e);
            });
    },
    sendAgentMsgToHistory(userData, msg) {
        // we want to keep history of all sent messages
        const obj = {
            createdOn: (new Date()).toISOString(),
            message: Helper.htmlEntities(msg),
            customerID: userData.userName,
            agentID: userData.agentName,
            msgBy: null,
            intent: null,
            chatID: userData.chatID,
        };
        try{
          this.history[userData.userName].push(obj);
        }catch(e) {
          console.log('error pushing to history object', userData.userName, e);
        }

        DB.saveChatMsg([userData.agentName, userData.chatID, msg, userData.userName, null, null])
            .then((result) => {
                console.log(result.message);
            }, (e) => {
                console.log(e);
            });
    },
    closeChat(wsConnection, userData) {
        const msg = 'Thankyou for sharing your details. We will get back to you as soon as possible with your trip details.';
        this.sendAgentMsgToHistory(userData, msg);
        DB.closeChat(userData)
            .then((result) => {
                this.sendMsgToWebsocket(wsConnection, msg, CONSTANTS.CLOSECHAT);
            }, (e) => {

            });
    },
    sendFirstMsg(wsConnection, userData, intent) {
        if (intent && intent != '') {
            this.sendMsgToWebsocket(wsConnection, TripPlanner[intent](), CONSTANTS.BOT);
        } else if (userData.selectedDept == CONSTANTS.BOT) {
            this.sendMsgToWebsocket(wsConnection, TripPlanner.start(), CONSTANTS.BOT);
        } else if(this.agentsList[userData.agentName]) {
          this.sendMsgToWebsocket(wsConnection, { name: this.agentsList[userData.agentName].name, chatid: userData.chatID, showInput: true }, CONSTANTS.AGENT);
        } else {
            this.sendMsgToWebsocket(wsConnection, { name: null, chatid: userData.chatID, showInput: true }, CONSTANTS.AGENT);
        }
    },
};
