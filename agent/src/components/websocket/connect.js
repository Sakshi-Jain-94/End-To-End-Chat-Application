import React from 'react';
import ReactDOM from 'react-dom';

class ConnectToWebsocket extends React.Component {
    constructor(props) {
        super(props);
        this.connection = null;
        this.wsUri = 'ws://127.0.0.1:1337';
        this.output = null;
        this.websocket = null;
    }

    componentDidMount() {
        this.init();
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
  }

  onMessage = (evt) => {
      console.log(`RESPONSE: ${evt.data}`);
      this.props.data.onMessageCallback(evt.data);
      // this.websocket.close();
  }

  onError = (evt) => {
      console.log(`ERROR: ${evt.data}`);
  }

  init = () => {
      this.testWebSocket();
  }

  doSend = (message) => {
      console.log(`SENT: ${message}`);
      this.websocket.send(message);
  }

  render() {
      return null;
  }
}

export default ConnectToWebsocket;
