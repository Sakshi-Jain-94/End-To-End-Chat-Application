import React from 'react';
import AgentIcon from '../../images/agent-icon.jpg'

class AgentMessage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
          <div className="msg-box fl agent">
            <img className="agent-icon fl" src={AgentIcon} />
            <div className='agent-msg fl' dangerouslySetInnerHTML={{ __html: unescape(this.props.data.message) }}></div>
            <span className="time-string full txt-left fl">{this.props.timeString}</span>
          </div>
        );
    }
}

export default AgentMessage;
