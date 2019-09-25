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

process.title = 'my-chat-server';
const http = require('http');
const webSocketServer = require('websocket').server;
const md5 = require('md5');
const TripPlanner = require('./tripPlanner.js');
const Helper = require('./helper.js');
const MsgHandling = require('./msgHandling.js');
const DB = require('./database');
const CONSTANTS = require('./constants.js');

// make db connection
DB.createConnection();
// ends

/**
 * Global variables
 */

// Port where we'll run the websocket server
const webSocketsServerPort = 1337;
// list of currently connected clients (users)
const activeUserIds = [];
const activeAgents = [];
const agentUserMapping = {};
const validTokens = {};
const pendingChats = [];
// connection object to be used for 2 way communication between user & agent
const connectionObj = {};

// ... in random order
activeAgents.sort((a, b) => Math.random() > 0.5);
/**
 * HTTP server
 */
const server = http.createServer((request, response) => {
    // Not important for us. We're writing WebSocket server,
    // not HTTP server
});
server.listen(webSocketsServerPort, () => {
    console.log(`${new Date()} Server is listening on port ${
        webSocketsServerPort}`);
});

/**
  * get history for activeUserIds
  */
if(activeUserIds.length > 0) {
  MsgHandling.getHistoryForActiveUsers(activeUserIds);
}

// get all active chats
DB.getActiveNPendingChats()
.then((result) => {
  result.forEach((chat) => {
    if(chat.status == 'a') {
      activeAgents.splice(activeAgents.indexOf(chat.agentID), 1);
    }else{
      pendingChats.push({
          userName: chat.customerID,
          agentName: chat.agentID,
          chatID: chat.chatID,
          selectedDept: chat.department,
      });
    }
  });
}, (e) => {
    console.log('error fethcing history of activer users', e);
});

// get agents list
DB.getAllAgents()
.then((result) => {
  result.forEach((agent) => {
    MsgHandling.agentsList[agent.agentID] = agent;
  });
}, (e) => {
    console.log('error fethcing agent list', e);
});

/**
 * WebSocket server
 */
const wsServer = new webSocketServer({
    // WebSocket server is tied to a HTTP server. WebSocket
    // request is just an enhanced HTTP request. For more info
    // http://tools.ietf.org/html/rfc6455#page-6
    httpServer: server,
});
// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', (request) => {
    console.log(`${new Date()} wsConnection from origin ${
        request.origin}.`);
    // accept wsConnection - you should check 'request.origin' to
    // make sure that client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)
    const wsConnection = request.accept(null, request.origin);

    // check for origin Type to identify between user & agent
    let originType = CONSTANTS.USER;
    if(request.origin == CONSTANTS.AGENT_ORIGIN) {
      originType = CONSTANTS.AGENT;
    }

    // we need to know client index to remove them on 'close' event
    const index = new Date().getTime();
    // save this in ws obj
    wsConnection.wsConnectIndex = index;

    let userData = {
        userName: false,
        agentName: false,
        historySent: false,
        chatID: null,
        selectedDept: null,
        token: null,
    };

    console.log(`${new Date()} wsConnection accepted.`);

    if(originType == CONSTANTS.AGENT) {
      // redefine user object
      userData = {
        agentName: false,
        token: null,
      };

      // agent sent some message
      wsConnection.on('message', (message) => {
          if (message.type === 'utf8') { // accept only text
              // first message sent by agent is agentID###password or token
              if (userData.agentName === false) {
                  // check if valid token sent
                  if(typeof validTokens[message.utf8Data] != 'undefined') {
                    MsgHandling.sendMsgToWebsocket([wsConnection], 'Token valid', CONSTANTS.VALID_TOKEN);
                    userData = validTokens[message.utf8Data];
                    // push into connection object
                    if(typeof connectionObj[userData.agentName] != 'undefined') {
                      connectionObj[userData.agentName].push(wsConnection);
                    }else{
                      connectionObj[userData.agentName] = [wsConnection];
                    }
                    checkNSendHistoryToAgent();
                    return;
                  }
                  if((message.utf8Data).indexOf('###') < 0) {
                    MsgHandling.sendMsgToWebsocket([wsConnection], 'Token Invalid', CONSTANTS.INVALID_TOKEN);
                    return;
                  }
                  const msgArr = (message.utf8Data).split('###');
                  const token = md5(message.utf8Data + new Date().getTime());
                  // check if agent exist or not
                  DB.validateAgent(msgArr[0], msgArr[1])
                  .then((result) => {
                    if(result.length > 0) {
                      MsgHandling.sendMsgToWebsocket([wsConnection], token, CONSTANTS.VALID);
                      // remember user name
                      userData.agentName = Helper.htmlEntities(msgArr[0]);
                      activeAgents.push(userData.agentName);
                      // push into connection object
                      if(typeof connectionObj[userData.agentName] != 'undefined') {
                        connectionObj[userData.agentName].push(wsConnection);
                      }else{
                        connectionObj[userData.agentName] = [wsConnection];
                      }
                      // check n send user history to agent if available
                      checkNSendHistoryToAgent();
                      userData.token = token;
                      validTokens[token] = userData;
                    }else{
                      MsgHandling.sendMsgToWebsocket([wsConnection], 'Invalid credentials', CONSTANTS.INVALID);
                    }
                  }, (e) => {
                    console.log('error validating agent', msgArr[0], msgArr[1]);
                  });
              } else{
                  // check condition for closing chat
                  if(message.utf8Data === `closechat###${userData.token}`) {
                      closeChat(connectionObj[agentUserMapping[userData.agentName].userName], agentUserMapping[userData.agentName]);
                      return;
                  }
                  MsgHandling.sendAgentMsgToHistory(agentUserMapping[userData.agentName], message.utf8Data);
                  // send msg to user
                  MsgHandling.sendMsgToWebsocket(connectionObj[agentUserMapping[userData.agentName].userName], message.utf8Data, CONSTANTS.MESSAGE);
                  // broadcast msg to refresh to user logged in with same credentials
                  const broadcastConnection = connectionObj[userData.agentName].filter(ws => ws.wsConnectIndex !== index);
                  MsgHandling.sendMsgToWebsocket(broadcastConnection, 'refresh chat', CONSTANTS.REFRESH);
              }
          }
          function checkNSendHistoryToAgent() {
            if(agentUserMapping[userData.agentName] && agentUserMapping[userData.agentName].userName) {
              if(connectionObj[agentUserMapping[userData.agentName].userName]) {
                MsgHandling.sendMsgToWebsocket(connectionObj[userData.agentName], agentUserMapping[userData.agentName].userName, CONSTANTS.USER_ACTIVE);
              }else{
                MsgHandling.sendMsgToWebsocket(connectionObj[userData.agentName], agentUserMapping[userData.agentName].userName, CONSTANTS.USER_INACTIVE);
              }
              // finally send history to agent
              MsgHandling.sendHistoryToAgent([wsConnection], agentUserMapping[userData.agentName]);
            }else{
              MsgHandling.sendMsgToWebsocket([wsConnection], 'No chats assigned', CONSTANTS.NOCHAT);
            }
          }
      });
    }else {
      // user sent some message
      wsConnection.on('message', (message) => {
          if (message.type === 'utf8') { // accept only text
              // first message sent by user is their name
              if (userData.userName === false) {
                  // remember user name
                  userData.userName = Helper.htmlEntities(message.utf8Data);
                  activeUserIds.push(userData.userName);
                  // push into connection object
                  if(typeof connectionObj[userData.userName] != 'undefined') {
                    connectionObj[userData.userName].push(wsConnection);
                  }else{
                    connectionObj[userData.userName] = [wsConnection];
                  }
                  // send back chat history of that user
                  if (!userData.historySent) {
                      MsgHandling.sendHistoryToUser([wsConnection], userData, () => {
                        userData.historySent = true;
                      });
                  }

                  // check if user has any current pending / active chats
                  DB.getChatInfoForUser(userData)
                  .then((result) => {
                    if(result && result.length > 0) {
                        const row = result[0];
                        if(row.status == 'a') {
                            userData.agentName = row.agentID;
                            userData.chatID = row.ID;
                            userData.selectedDept = row.department;
                            if(userData.agentName != CONSTANTS.BOT) {
                              activeAgents.splice(activeAgents.indexOf(row.agentID), 1);
                              agentUserMapping[userData.agentName] = userData;
                            }
                            // send signal that user is active
                            MsgHandling.sendMsgToWebsocket(connectionObj[userData.agentName], userData.userName, CONSTANTS.USER_ACTIVE);
                        }else if (row.status == 'p') {
                            userData.chatID = row.ID;
                            userData.selectedDept = row.department;
                            // get random agent and send it back to the user
                            console.log('activeAgents', activeAgents);
                            if(activeAgents.length > 0) {
                              userData.agentName = activeAgents.shift();
                              agentUserMapping[userData.agentName] = userData;
                              // send signal that user is active
                              MsgHandling.sendMsgToWebsocket(connectionObj[userData.agentName], userData.userName, CONSTANTS.USER_ACTIVE);
                              DB.updatePendingChat(userData)
                              .then((res1) => {
                                  console.log('chat status upated successfully', userData.chatID);
                              }, (e) => {
                                  console.log('error updating chat status to active', userData.chatID);
                              });
                              let pIndex = -1;
                              pendingChats.forEach((pC, i) => {
                                if(pC.userName == userData.userName) {
                                  pIndex = i;
                                }
                              });
                              pendingChats.splice(pIndex, 1);
                            }
                        }
                        if(MsgHandling.history[userData.userName]) {
                          const len = MsgHandling.history[userData.userName].length;
                          if(len > 0) {
                            MsgHandling.sendFirstMsg([wsConnection], userData, MsgHandling.history[userData.userName][len - 1].intent);
                          }else{
                            MsgHandling.sendFirstMsg([wsConnection], userData, null);
                          }
                        }
                    }else{
                        // select department
                        MsgHandling.sendMsgToWebsocket([wsConnection], userData, CONSTANTS.DEPT);
                    }
                    console.log(`${new Date()} User is known as: ${userData.userName} with ${userData.agentName} agent.`);
                  }, (e) => {
                      console.log('error retreiving chat infor for user', e);
                  });
              } else if(!userData.selectedDept) {
                    // create new chat

                    // second message sent by user is their department
                    userData.selectedDept = message.utf8Data;

                    // assign agent to user
                    if(userData.selectedDept == CONSTANTS.BOT) {
                      userData.agentName = CONSTANTS.BOT;
                    }else{
                      userData.agentName = activeAgents.length > 0 ? activeAgents.shift() : null;
                    }
                    DB.createChatId(userData.agentName, userData.userName, userData.selectedDept)
                        .then((row) => {
                            userData.chatID = row.insertId;
                            MsgHandling.sendFirstMsg([wsConnection], userData, null);
                            if(userData.agentName) {
                              agentUserMapping[userData.agentName] = userData;
                              MsgHandling.sendMsgToWebsocket(connectionObj[userData.agentName], userData.userName, CONSTANTS.USER_ACTIVE);
                            }else{
                              pendingChats.push(userData);
                            }
                        }, (e) => {
                            console.log('error create chat id', e);
                        });
                  }else{
                      let parseMsg = null;
                      try{
                          parseMsg = JSON.parse(message.utf8Data);
                      }catch(e) {
                        console.log('Received msg is not json');
                      }
                      if(parseMsg) {
                        if(parseMsg.type == CONSTANTS.BOT) {
                          // send msg to historySent
                          MsgHandling.sendAgentMsgToHistory(userData, escape(parseMsg.agentText));
                          MsgHandling.sendUserMsgToHistory(userData, escape(parseMsg.message), parseMsg.intent);
                          if(parseMsg.intent == 'end') { // close chat
                              closeChat([wsConnection], userData);
                          }else{
                            if(typeof TripPlanner[parseMsg.intent] !== 'undefined') {
                              MsgHandling.sendMsgToWebsocket([wsConnection], TripPlanner[parseMsg.intent](), CONSTANTS.BOT);
                            }else{
                                closeChat([wsConnection], userData);
                            }
                            // broadcast msg to refresh to user logged in with same credentials
                            const broadcastConnection = connectionObj[userData.userName].filter(ws => ws.wsConnectIndex !== index);
                            MsgHandling.sendMsgToWebsocket(broadcastConnection, 'refresh chat', CONSTANTS.REFRESH);
                          }
                        }
                      }else{
                        console.log(`${new Date()} Received Message from ${
                            userData.userName}: ${message.utf8Data}`);

                        // send msg to historySent
                        MsgHandling.sendUserMsgToHistory(userData, message.utf8Data);
                        MsgHandling.sendMsgToWebsocket(connectionObj[userData.agentName], message.utf8Data, CONSTANTS.MESSAGE);
                        // broadcast msg to refresh to user logged in with same credentials
                        const broadcastConnection = connectionObj[userData.userName].filter(ws => ws.wsConnectIndex !== index);
                        MsgHandling.sendMsgToWebsocket(broadcastConnection, 'refresh chat', CONSTANTS.REFRESH);
                      }
                  }
          }
      });
    }

    // user disconnected
    wsConnection.on('close', (con) => {
        if (userData.userName && userData.userName !== false && userData.agentName !== false) {
            console.log(`${new Date()} Peer ${
                con.remoteAddress} disconnected.`);
            // remove from list of active users
            activeUserIds.splice(activeUserIds.indexOf(userData.userName), 1);

            // push back user's agent to be reused by another user
            if(userData.agentName && userData.agentName != CONSTANTS.BOT) {
                MsgHandling.sendMsgToWebsocket(connectionObj[userData.agentName], userData.userName, CONSTANTS.USER_INACTIVE);
            }

            const indexToRemove = connectionObj[userData.userName].findIndex(ws => ws.wsConnectIndex == index);
            connectionObj[userData.userName].splice(indexToRemove, 1);
        }else if (userData.agentName !== false) {
          const indexToRemove = connectionObj[userData.agentName].findIndex(ws => ws.wsConnectIndex == index);
          connectionObj[userData.agentName].splice(indexToRemove, 1);
        }
    });
});

function closeChat(wsConnection, userData) {
  if(userData.agentName !== CONSTANTS.BOT) {
    if(pendingChats.length > 0) {
      let pIndex = -1;
      pendingChats.forEach((pC, i) => {
        if(activeUserIds.indexOf(pC.userName) > -1) {
          pIndex = i;
          agentUserMapping[userData.agentName] = pC;
          pC.agentName = userData.agentName;
          DB.updatePendingChat(pC)
          .then((res1) => {
              console.log('chat status upated successfully', pC.chatID);
          }, (e) => {
              console.log('error updating chat status to active', pC.chatID);
          });
          MsgHandling.sendMsgToWebsocket(
            connectionObj[agentUserMapping[userData.agentName].userName],
            {
              name: userData.agentName,
              chatid: agentUserMapping[userData.agentName].chatID,
              showInput: true,
            },
            CONSTANTS.AGENT,
          );
        }
      });
      pendingChats.splice(pIndex, 1);
    }else{
      agentUserMapping[userData.agentName] = undefined;
      activeAgents.push(userData.agentName);
    }
  }
  MsgHandling.closeChat(wsConnection, userData);
}
