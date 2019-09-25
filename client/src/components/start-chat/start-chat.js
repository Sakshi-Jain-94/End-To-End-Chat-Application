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
import ActionButton from '../customer/actionButton';
import ConnectToWebsocket from '../websocket/connect';
import History from '../history/history';
import PreLogin from '../pre-login/pre-login';
import Departments from '../departments/dept';
import InputBar from './input-bar';
import '../../css/styles.css';

class StartChat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chatComponents: [],
            showPreLogin: true,
            mobileNo: null,
            showInput: false,
            lastMessage: null,
            hideChat: '',
            selectedDept: null,
            showError: false,
            errorMsg: 'Some error occurred !!',
            noConnect: false,
        };
        this.commonFunctions = {
            addComponent: this.addComponent,
            deleteComponent: this.deleteComponent,
            showErrorStrip: this.showErrorStrip,
        };
        this.connectCount = 0;
    }

    componentDidMount() {
        const userInfo = window.sessionStorage.getItem('mobileNo');
        if(userInfo) {
          this.startChat(userInfo);
        }
    }

    startChat = (mobileNo) => {
      this.setState({
        mobileNo,
        showPreLogin: false,
        chatComponents: [],
      }, () => {
        this.addComponent([
          {
              name: ConnectToWebsocket,
              data: {
                  onMessageCallback: this.onMessageCallback,
                  onDisconnect: this.wsOnDisconnect,
                  onConnectFail: this.wsOnConnectFail,
                  onConnect: this.wsOnConnect,
                  key: `ws${new Date().getTime()}`,
              },
          },
        ]);
      });
    }

    wsOnConnect = (wsConn) => {
        console.log('ws success');
        this.setState({
          wsConn,
        });
        window.wsConn = wsConn;
        wsConn.send(this.state.mobileNo);
        this.connectCount = 0;
    }

    wsOnDisconnect = (reconnect) => {
      this.connectCount++;
      if(this.connectCount < 5) {
        reconnect();
      }else{
        this.setState({
          noConnect: true,
        });
      }
      console.log(this.connectCount);
    }

    wsOnConnectFail = (reconnect) => {
        this.connectCount++;
        if(this.connectCount < 5) {
          reconnect();
        }else{
          this.setState({
            noConnect: true,
          });
        }
        console.log(this.connectCount);
    }

    onMessageCallback = (data) => {
        try {
            const msg = JSON.parse(data);
            if (msg.type == 'history') {
                this.addComponent([{
                    name: History,
                    data: {
                        messages: msg.data,
                        key: `hm${new Date().getTime()}`,
                    },
                }]);
            } else if (msg.type == 'agent') {
                this.addComponent([{
                    name: AgentName,
                    data: {
                        agentName: msg.data.name,
                        key: `am${new Date().getTime()}`,
                    },
                }]);
            } else if (msg.type == 'message') {
                this.addComponent([{
                    name: AgentMessage,
                    data: {
                        message: msg.data,
                        key: `am${new Date().getTime()}`,
                    },
                }], () => { myChat.utils.scrollToBottom(); });
            } else if (msg.type == 'closechat') {
                this.addComponent([{
                    name: AgentMessage,
                    data: {
                        message: msg.data,
                        key: `am${new Date().getTime()}`,
                    },
                }], () => { myChat.utils.scrollToBottom(); this.restartChat(); });
            } else if (msg.type == 'bot') {
              if(msg.data) {
                  this.addComponent([{
                    name: ActionButton,
                    data: {
                        message: msg.data,
                        key: `ab${new Date().getTime()}`,
                    },
                  }]);
              }else{
                this.addComponent([{
                  name: AgentMessage,
                  data: {
                      message: 'Sorry, currently we are unable to resolve your query. Please come back again later.',
                      key: `am${new Date().getTime()}`,
                  },
                }]);
              }
            } else if (msg.type == 'department') {
              this.showDepartment();
            } else if (msg.type == 'refresh') {
              this.startChat(this.state.mobileNo);
            }
            if(msg.type == 'message') {
              this.setState({
                showInput: true,
                inputConfig: msg.data.inputConfig,
                lastMessage: msg,
              });
            }else if(msg.data) {
                this.setState({
                  showInput: msg.data.showInput,
                  inputConfig: msg.data.inputConfig,
                  lastMessage: msg,
                });
              }
        } catch (e) {
            console.log('msg is corrupted');
        }
    }

    restartChat = () => {
      this.state.wsConn.close();
      this.addComponent([
        {
          name: ActionButton,
          data: {
              message: {
                 showInput: false,
                    actionType: 'button',
                    text: [
                      'Do you still have a query?',
                    ],
                    actions: [
                      { text: 'Yes', intent: this.restartYes },
                      { text: 'No', intent: this.restartNo },
                    ],
                },
              key: `ab${new Date().getTime()}`,
          },
        },
      ], () => { myChat.utils.scrollToBottom(); });
    }

    restartYes = () => {
      this.setState({
        showPreLogin: true,
      }, () => {
        this.setState({ showPreLogin: false });
      });
    }

    restartNo = () => {
      this.close();
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

    showErrorStrip = (msg) => {
      this.setState({
        showError: true,
        errorMsg: msg,
      }, () => {
        setTimeout(() => {
          this.setState({
            showError: false,
          });
        }, 500);
      });
    }

    showDepartment = () => {
      this.addComponent([
          {
            name: Departments,
            data: {
              key: `dept${new Date().getTime()}`,
              callback: this.onSelectDepartment,
            },
          },
      ]);
    }

    onSelectDepartment = (selectedDept) => {
      this.setState({
        selectedDept,
      });
      this.state.wsConn.send(selectedDept);
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

    render() {
        return (
            <div id="StartChat">
                <div className="top-bar">
                  Chat with us
                    <span className="topbar-action fr" onClick={this.close}>&#10005;</span>
                    {this.state.minimize && <span className="topbar-action fr" onClick={this.maximize}>&#9633;</span>}
                    {!this.state.minimize && <span className="topbar-action minimize fr" onClick={this.minimize}>_</span>}
                </div>
                <div className={`start-chat-box ${this.state.hideChat}`}>
                    {this.state.showPreLogin && <PreLogin startChat={this.startChat} />}
                    {!this.state.showPreLogin && this.state.chatComponents.map((ComponentData, index) => (
                        <ComponentData.name
                            data={ComponentData.data}
                            index={index}
                            key={(ComponentData.data && ComponentData.data.key) ? ComponentData.data.key : index}
                            commonFunctions={this.commonFunctions}
                            timeString={ComponentData.timeString}
                            time={ComponentData.time}
                            wsConn={this.state.wsConn}
                        />
                    ))}
                    {this.state.noConnect && <div className="generic-msg">Currently we are facing some issue. Please try again later or try reloading.</div>}
                </div>
                {!this.state.showPreLogin && this.state.showInput && (
                    <div className={`bottom-bar fl ${this.state.hideChat}`}>
                        <InputBar inputConfig={this.state.inputConfig} commonFunctions={this.commonFunctions} wsConn={this.state.wsConn} lastmessage={this.state.lastMessage} />
                    </div>
                )}
                {this.state.showError && (
                    <div className="error-strip">
                        {this.state.errorMsg}
                    </div>
                )}
            </div>
        );
    }
}

export default StartChat;
