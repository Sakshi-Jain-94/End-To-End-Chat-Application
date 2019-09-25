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
import ReactDOM from 'react-dom';

class ConnectToWebsocket extends React.Component {
    constructor(props) {
        super(props);
        this.connection = null;
        this.wsUri = 'ws://127.0.0.1:1337/';
        this.output = null;
        this.websocket = null;
    }

    componentDidMount() {
        this.init();
    }

    init = () => {
        this.testWebSocket();
    }


    testWebSocket = () => {
        this.websocket = new WebSocket(this.wsUri);
        this.websocket.onopen = (evt) => { this.onOpen(evt); };
        this.websocket.onclose = (evt) => { this.onClose(evt); };
        this.websocket.onmessage = (evt) => { this.onMessage(evt); };
        this.websocket.onerror = (evt) => { this.onError(evt); };
    }

    onOpen = (evt) => {
        console.log('CONNECTED');
        this.props.data.onConnect(this.websocket);
    }

    onClose = (evt) => {
        console.log('DISCONNECTED');
        this.props.data.onDisconnect(this.init);
    }

    onMessage = (evt) => {
        console.log(`RESPONSE: ${evt.data}`);
        this.props.data.onMessageCallback(evt.data);
        // this.websocket.close();
    }

    onError = (evt) => {
        console.log(`ERROR: ${evt.data}`);
        this.props.data.onConnectFail(this.init);
    }

    doSend = (message) => {
        console.log(`SENT: ${message}`);
        this.websocket.send(message);
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.log(error, errorInfo);
    }

    render() {
        return null;
    }
}

export default ConnectToWebsocket;
