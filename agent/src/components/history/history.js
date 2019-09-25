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
import ReactDOM from 'react-dom';
import CustomerMessage from '../customer/message';
import AgentMessage from '../agent/message';

class History extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        myChat.utils.scrollToBottom();
    }

    render() {
        return (
            <div className="history fl">
                {this.props.data.messages.map((msgItem, index) => (
                    <React.Fragment key={index}>
                        {msgItem.msgBy == 'user' && <CustomerMessage data={{ message: msgItem.message }} timeString={myChat.utils.getTimeString(msgItem.createdOn ? msgItem.createdOn : new Date().getTime())} />}
                        {msgItem.msgBy != 'user' && <AgentMessage data={{ message: msgItem.message }} timeString={myChat.utils.getTimeString(msgItem.createdOn ? msgItem.createdOn : new Date().getTime())} />}
                    </React.Fragment>
                ))}
            </div>
        );
    }
}

export default History;
