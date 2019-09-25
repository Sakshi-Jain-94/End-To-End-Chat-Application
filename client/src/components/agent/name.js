import React from 'react';
import ReactDOM from 'react-dom';

class AgentName extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    render() {
        return (
            <div className="agent-bar fl">
              {this.props.data.agentName ? `${this.props.data.agentName} is connected` : 'You will be connected to our representative very soon '}
            </div>
        );
    }
}

export default AgentName;
