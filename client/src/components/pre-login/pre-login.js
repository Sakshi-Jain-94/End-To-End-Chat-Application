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

class PreLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showMobile: true,
            showOtp: false,
            mobileNo: '',
            otp: '',
        };
    }

    componentDidMount() {
    }

    sendOtp = () => {
        const mobileNo = document.getElementById('mobileNo').value;
        if (myChat.utils.isEmpty(mobileNo) || !Validate.telephone(mobileNo)) {
            this.setState({
                showMobileError: true,
            });
        } else {
            this.setState({ mobileNo }, () => {
                this.setState({
                    showMobile: false,
                    showMobileError: false,
                    showOtp: true,
                });
            });
        }
        return true;
    }

    submitOtp = () => {
        const otp = document.getElementById('otp').value;
        if (myChat.utils.isEmpty(otp)) {
            this.setState({
                showOtpError: true,
            });
        } else {
            this.setState({ otp }, () => {
                this.setState({
                    showMobile: true,
                    showOtpError: false,
                    showOtp: false,
                });
            });
        }
        window.sessionStorage.setItem('mobileNo', this.state.mobileNo);
        this.props.startChat(this.state.mobileNo);
        return true;
    }

    validateMobile = (event) => {
        this.setState({
            showMobileError: false,
        });
        const input = event.target.value;
        const len = input.length;
        const char = input.slice(len - 1, len);
        if (len === 0) {
            // do nothing
        } else if (!Validate.telephone(char, true)) {
            event.preventDefault();
            return false;
        }
        this.setState({ mobileNo: input });
        return true;
    }

    validateOtp = (event) => {
        this.setState({
            showOtpError: false,
        });
        const input = event.target.value;
        const len = input.length;
        const char = input.slice(len - 1, len);
        if (len === 0) {
            // do nothing
        } else if (!Validate.telephone(char, true)) {
            event.preventDefault();
            return false;
        }
        this.setState({ otp: input });
        window.localStorage.setItem('userInfo', JSON.stringify({ mobile: this.state.mobileNo, time: new Date().getTime() }));
        return true;
    }

    onKeyDownMobile = (event) => {
        const code = event.keyCode || event.which;
        if(code === 13 && !event.shiftKey) {
          this.sendOtp();
        }
    }

    onKeyDownOtp = (event) => {
        const code = event.keyCode || event.which;
        if(code === 13 && !event.shiftKey) {
          this.submitOtp();
        }
    }

    render() {
        return (
            <div className="mobile-div">
                {this.state.showMobile && (
                    <React.Fragment>
                        <label>Enter mobile number</label>
                        <input
                            type="text"
                            id="mobileNo"
                            value={this.state.mobileNo}
                            onChange={this.validateMobile}
                            maxLength={10}
                            onKeyDown={this.onKeyDownMobile}
                        />
                        <button type="button" onClick={this.sendOtp}>Send Otp</button>
                        {this.state.showMobileError && <span className="errorMsg">*Enter valid mobile number</span>}
                    </React.Fragment>
                )}
                {this.state.showOtp && (
                    <React.Fragment>
                        <label>Enter otp</label>
                        <input
                            type="text"
                            id="otp"
                            value={this.state.otp}
                            onChange={this.validateOtp}
                            maxLength={6}
                            onKeyDown={this.onKeyDownOtp}
                        />
                        <button type="button" onClick={this.submitOtp}>Submit</button>
                        {this.state.showOtpError && <span className="errorMsg">*Otp required</span>}
                    </React.Fragment>
                )}
            </div>
        );
    }
}

export default PreLogin;
