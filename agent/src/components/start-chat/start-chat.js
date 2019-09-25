/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
/* eslint-disable no-use-before-define */
/* eslint-disable eqeqeq */
/* eslint-disable no-console */
/* eslint-disable indent */
/* eslint-disable keyword-spacing */
/* eslint-disable space-before-function-paren */
/* eslint-disable func-names */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable max-len */

import React from 'react';
import AgentMessage from '../agent/message';
import AgentName from '../agent/name';
import CustomerMessage from '../customer/message';
import ConnectToWebsocket from '../websocket/connect';
import History from '../history/history';
import PreLogin from '../pre-login/pre-login';
import InputBar from './input-bar';
import '../../css/styles.css';

class StartChat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chatComponents: [],
            showPreLogin: false,
            agentUser: null,
            userDisconnect: false,
            showChat: false,
            key: 0,
            showError: false,
            errorMsg: 'Something went wrong please try agian later',
        };
        this.commonFunctions = {
            addComponent: this.addComponent,
            deleteComponent: this.deleteComponent,
        };
        this.wsData = {
            onMessageCallback: this.onMessageCallback,
            onDisconnect() { console.log('ws disconnect'); },
            onConnectFail() { console.log('ws failed'); },
            onConnect: this.wsOnConnect,
            key: `ws${new Date().getTime()}`,
        };
    }

    componentDidMount() {

    }

    wsOnConnect = (wsConn) => {
        console.log('ws success');
        this.setState({
          wsConn,
        });
        const token = window.sessionStorage.getItem('token');
        if(token) {
          wsConn.send(token);
        }else{
          this.setState({
            showPreLogin: true,
            showChat: true,
          });
        }
    }

    onMessageCallback = (data) => {
        try {
            const msg = JSON.parse(data);
            if (msg.type == 'history') {
                this.setState({
                  showChat: true,
                  showPreLogin: false,
                });
                this.addComponent([{
                    name: History,
                    data: {
                        messages: msg.data,
                        key: `hm${new Date().getTime()}`,
                    },
                }]);
            } else if (msg.type == 'userInactive') {
                this.setState({
                  userDisconnect: true,
                  userName: msg.data,
                });
            } else if (msg.type == 'invalid') {
                this.setState({
                  showPreLogin: true,
                  showError: true,
                  errorMsg: msg.data,
                }, () => {
                  setTimeout(() => {
                    this.setState({
                      showError: false,
                    });
                  }, 1000);
                });
            } else if (msg.type == 'valid') {
                this.setState({
                  showPreLogin: false,
                });
                // for now we are using sesion storage to maintain login
                // can be changed as per one's session token mechanism
                window.sessionStorage.setItem('token', msg.data);
            } else if (msg.type == 'validToken') {
                this.setState({
                  showPreLogin: false,
                });
            } else if (msg.type == 'invalidToken') {
                  this.setState({
                    showPreLogin: true,
                  });
                  this.showErrorStrip('Token is invalid or expired', 1000);
            } else if (msg.type == 'userActive') {
                this.setState({
                  userDisconnect: false,
                  userName: msg.data,
                  showChat: true,
                  showPreLogin: false,
                });
            } else if (msg.type == 'message') {
                this.addComponent([{
                    name: CustomerMessage,
                    data: {
                        message: msg.data,
                        key: `cm${new Date().getTime()}`,
                    },
                }], () => { myChat.utils.scrollToBottom(); });
            } else if (msg.type == 'closechat') {
                this.addComponent([{
                    name: AgentMessage,
                    data: {
                        message: msg.data,
                        key: `am${new Date().getTime()}`,
                    },
                }], () => { myChat.utils.scrollToBottom(); });
            } else if (msg.type == 'noChats') {
                this.setState({
                  showPreLogin: false,
                  showChat: false,
                });
            } else if (msg.type == 'refresh') {
               this.setState({ chatComponents: [], key: Math.random() });
            }
        } catch (e) {
            console.log('msg is corrupted');
        }
    }

    addComponent = (toAdd, callBack) => {
        const componentArr = this.state.chatComponents.slice();
        for (let i = 0; i < toAdd.length; i++) {
            componentArr.push({
                data: toAdd[i].data,
                name: toAdd[i].name,
                time: toAdd[i].time ? toAdd[i].time : new Date().getTime(),
                timeString: myChat.utils.getTimeString(toAdd[i].time ? toAdd[i].time : new Date().getTime()),
            });
        }
        this.setState({ chatComponents: componentArr }, () => {
            if (callBack) callBack();
        });
    }

    deleteComponent = (index, callBack) => {
        const componentArr = this.state.chatComponents.slice();
        componentArr.splice(index, 1);
        this.setState({ chatComponents: componentArr }, () => {
            if (callBack) callBack();
        });
    }

    minimize = () => {
      this.setState({
        hideChat: 'hide',
        minimize: true,
      });
    }

    close = () => {
      this.setState({
        showPreLogin: true,
        hideChat: 'hide',
        minimize: true,
      });
    }

    maximize = () => {
      this.setState({
        hideChat: '',
        showPreLogin: false,
        minimize: false,
      });
    }

    closeChat = () => {
      this.state.wsConn.send(`closechat###${window.sessionStorage.getItem('token')}`);
      this.setState({ showChat: false });
    }

    startChat = (agentUser) => {
        this.setState({
            agentUser,
        }, () => {
          this.state.wsConn.send(this.state.agentUser);
        });
    }

    showErrorStrip = (msg, timer) => {
      this.setState({
        showError: true,
        errorMsg: msg,
      }, () => {
        setTimeout(() => {
          this.setState({
            showError: false,
          });
        }, timer || 500);
      });
    }

    render() {
        return (
            <div id="StartChat" key={this.state.key}>
                <div className="top-bar">
                    Agent Console
                    <span className="topbar-action fr" onClick={this.close}>&#10005;</span>
                    {this.state.minimize && <span className="topbar-action fr" onClick={this.maximize}>&#9633;</span>}
                    {!this.state.minimize && <span className="topbar-action minimize fr" onClick={this.minimize}>_</span>}
                </div>
                {this.state.userDisconnect && (
                <div className="user-disconnect">
                    {this.state.userName}
                    {' '}
                      is disconnected
                    {' '}
                    <span className="closechat" onClick={this.closeChat}>Close Chat</span>
                </div>
                )}
                {!this.state.userDisconnect && this.state.userName && (
                <div className="user-connected">
                    {this.state.userName}
                    {' '}
                      is connected
                    {' '}
                    <span className="closechat" onClick={this.closeChat}>Close Chat</span>
                </div>
                )}
                {!this.state.showChat && !this.state.showPreLogin && (
                <div className="generic-msg txt-center">
                    No chats available
                </div>
                )}
                <div className={`start-chat-box ${this.state.hideChat}`}>
                    {(this.state.showPreLogin) && <PreLogin startChat={this.startChat} />}
                    {!this.state.showPreLogin && this.state.showChat && this.state.chatComponents.map((ComponentData, index) => (
                        <ComponentData.name
                            data={ComponentData.data}
                            key={(ComponentData.data && ComponentData.data.key) ? ComponentData.data.key : index}
                            commonFunctions={this.commonFunctions}
                            timeString={ComponentData.timeString}
                            time={ComponentData.time}
                        />
                    ))}
                </div>
                {!this.state.showPreLogin && this.state.showChat && (
                <div className={`bottom-bar fl ${this.state.hideChat}`}>
                    <InputBar commonFunctions={this.commonFunctions} wsConn={this.state.wsConn} />
                </div>
                )}
                {this.state.showError && (
                    <div className="error-strip">
                        {this.state.errorMsg}
                    </div>
                )}
                <ConnectToWebsocket data={this.wsData} />
            </div>
        );
    }
}

export default StartChat;
