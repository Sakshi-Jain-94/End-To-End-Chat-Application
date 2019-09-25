import React from 'react';

class CustomerMessage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
          <div className="msg-box fl">
            <div className='user-msg fr' dangerouslySetInnerHTML={{ __html: unescape(this.props.data.message) }}></div>
            <span className="time-string full txt-right fr">{this.props.timeString}</span>
          </div>
        );
    }
}

export default CustomerMessage;
