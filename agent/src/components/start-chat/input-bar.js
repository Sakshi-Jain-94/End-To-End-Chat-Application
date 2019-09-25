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
/* eslint-disable react/prop-types */
/* eslint-disable max-len */

import React from 'react';
import AgentMessage from '../agent/message';
import SendIcon from '../../images/send-icon.png';

class InputBar extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    sendMessage = () => {
        const msg = document.getElementById('comments').value;
        if (!myChat.utils.isEmpty(msg)) {
            this.props.wsConn.send(msg);
            console.log('SENT: ', msg);
            this.props.commonFunctions.addComponent([{
                name: AgentMessage,
                data: { message: msg },
                key: `am${new Date().getTime()}`,
            }], () => {
                myChat.utils.scrollToBottom();
                document.getElementById('comments').value = '';
                document.getElementById('comments').style.height = '18.2px';
            });
        }
        return true;
    }

    onKeyDown = (event) => {
      const input = document.getElementById('comments').value;
      if(myChat.utils.isEmpty(input)) {
        document.getElementById('comments').style.height = '18.2px';
      }else{
        const code = event.keyCode || event.which;
        if(code === 13 && !event.shiftKey) {
          event.preventDefault();
          this.sendMessage();
        }else if (code === 13 && event.shiftKey) {
          this.changeHeightOfContainer();
        }
      }
    }

    changeHeightOfContainer = () => {
      const heightStr = document.getElementById('comments').style.height;
      const heightNum = Number(heightStr.replace('px', ''));
      if(heightNum < 60) {
        document.getElementById('comments').style.height = `${heightNum * 2}px`;
      }
  }

    render() {
        return (
            <React.Fragment>
                <div className="chat-input fl">
                    <textarea
                        id="comments"
                        className=""
                        style={{ height: '18.2px' }}
                        spellCheck="false"
                        onKeyDown={this.onKeyDown}
                        placeholder="Type your message..."
                    />
                </div>
                <img src={SendIcon} alt="icon" className="send-icon" onClick={this.sendMessage} />
            </React.Fragment>
        );
    }
}

export default InputBar;
