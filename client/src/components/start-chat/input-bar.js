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
import Validate from '../../shared/validations';
import CustomerMessage from '../customer/message';
import SendIcon from '../../images/send-icon.png';

class InputBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          value: '',
        };
    }

    componentDidMount() {

    }

    sendMessage = () => {
        const msg = document.getElementById('comments').value;
        if (!myChat.utils.isEmpty(msg)) {
          if(this.props.inputConfig
              && this.props.inputConfig.type
              && Validate[this.props.inputConfig.type]
              && !Validate[this.props.inputConfig.type](msg)) {
              this.props.commonFunctions.showErrorStrip('Invalid Input');
              return false;
          }
            let msgToSend = msg;
            if (this.props.lastmessage.type == 'bot') {
                msgToSend = JSON.stringify({
                    type: 'bot',
                    agentText: this.props.lastmessage.data.text.join('<br /><br />'),
                    message: msg,
                    intent: this.props.lastmessage.data.actions[0].intent,
                });
            }
            this.props.wsConn.send(msgToSend);
            console.log('SENT: ', msgToSend);
            this.props.commonFunctions.addComponent([{
                name: CustomerMessage,
                data: { message: msg },
                key: `cm${new Date().getTime()}`,
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

    validateOnChange = (event) => {
      const input = event.target.value;
      const len = input.length;
      const char = input.slice(len - 1, len);
      if (len === 0) {
          // do nothing
      } else if (this.props.inputConfig
        && this.props.inputConfig.type && Validate[this.props.inputConfig.type]) {
        if(!Validate[this.props.inputConfig.type](char, true)) {
            event.preventDefault();
            return false;
        }
      }
      this.setState({ value: input });
      return true;
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
                        value={this.state.value}
                        onKeyDown={this.onKeyDown}
                        onChange={this.validateOnChange}
                        maxLength={this.props.inputConfig && this.props.inputConfig.maxLength ? this.props.inputConfig.maxLength : ''}
                        placeholder={this.props.inputConfig && this.props.inputConfig.placeholder ? this.props.inputConfig.placeholder : 'Type your message...'}
                    />
                </div>
                <img src={SendIcon} alt="icon" className="send-icon" onClick={this.sendMessage} />
            </React.Fragment>
        );
    }
}

export default InputBar;
