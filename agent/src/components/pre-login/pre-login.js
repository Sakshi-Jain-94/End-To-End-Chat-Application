import React from 'react';
import Validate from '../../shared/validations.js';

class PreLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            agentID: '',
            password: '',
        };
    }

    componentDidMount() {
    }

    submit = () => {
        const agentID = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        if (myChat.utils.isEmpty(agentID) || myChat.utils.isEmpty(password)) {
            this.setState({
                showError: true,
            });
            return;
        }
        this.setState({
            showError: false,
        });
        this.props.startChat(`${agentID}###${password}`);
    }

    onKeyDown = (event) => {
        const code = event.keyCode || event.which;
        if (code === 13 && !event.shiftKey) {
            this.submit();
        }
    }

    render() {
        return (
            <div className="mobile-div">
                <label>Username*</label>
                <input type="text" id="username" />
                <label>Password*</label>
                <input type="password" id="password" onKeyDown={this.onKeyDown} />
                <button onClick={this.submit}>Submit</button>
                {this.state.showError && <span className="errorMsg">*username & password required</span>}
            </div>
        );
    }
}

export default PreLogin;
