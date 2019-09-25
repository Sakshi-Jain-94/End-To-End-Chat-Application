import React from 'react';
import AgentMessage from '../agent/message';
import CustomerMessage from '../customer/message';

class ActionButton extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
      var myElement = document.getElementsByClassName('start-chat-box')[0].getElementsByClassName("msg-box agent");
      var idx = myElement.length > 0 ? myElement.length - 1 : null;
      if(idx){
        document.getElementsByClassName('start-chat-box')[0].scrollTop = myElement[idx].offsetTop - myElement[idx].offsetHeight;
      }
    }

    sendMessage = (event) => {
      const { text, intent } = event.currentTarget.dataset;
      if(typeof intent == 'function'){
        this.props.commonFunctions.deleteComponent(this.props.index);
        intent();
        return;
      }
      this.props.wsConn.send(JSON.stringify({
        agentText: this.props.data.message.text.join("<br /><br />"),
        message: text,
        intent: intent,
        type: 'bot'
      }));
      this.props.commonFunctions.deleteComponent(this.props.index,() => {
        this.props.commonFunctions.addComponent([
          {
              name: AgentMessage,
              data: { message: this.props.data.message.text.join("<br /><br />") },
              key: `am${new Date().getTime()}`,
          },
          {
            name: CustomerMessage,
            data: { message: text },
            key: `cm${new Date().getTime()}`,
          }
        ], () => {
            myChat.utils.scrollToBottom();
        });
      });
    }

    render() {
        return (
          <React.Fragment>
            {this.props.data.message.text.length > 0 &&
              <AgentMessage data={{message: this.props.data.message.text.join("<br /><br />")}} timeString={myChat.utils.getTimeString(new Date().getTime())} />
            }
            {
              this.props.data.message.actionType == 'button'
                && this.props.data.message.actions.map((action,index) => {
                  return  (
                    <div className="msg-box fl" key={index}>
                      {typeof action.intent != 'function' &&
                        <input type="button" onClick={this.sendMessage} data-text={action.text}  value={action.text} data-intent={action.intent} />
                      }
                      {typeof action.intent == 'function' &&
                        <input type="button" onClick={() => {this.props.commonFunctions.deleteComponent(this.props.index);action.intent();}} value={action.text} />
                      }
                    </div>
                  )
                })
            }
          </React.Fragment>
        );
    }
}

export default ActionButton;
