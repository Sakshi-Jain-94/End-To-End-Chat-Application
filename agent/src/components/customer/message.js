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
import UserChatIcon from '../../images/user-chat-icon.png';

class AgentMessage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        myChat.utils.scrollToBottom();
    }

    render() {
        return (
            <div className="msg-box fl customer">
                <img className="user-icon fl" src={UserChatIcon} />
                <div className="user-msg fl" dangerouslySetInnerHTML={{ __html: unescape(this.props.data.message) }} />
                <span className="time-string full txt-left fl">{this.props.timeString}</span>
            </div>
        );
    }
}

export default AgentMessage;
