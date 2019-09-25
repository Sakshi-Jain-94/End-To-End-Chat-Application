import React from "react";
import ReactDOM from "react-dom";
import StartChat from "./components/start-chat/start-chat";

const App = () => (
   <div>
      <StartChat />
   </div>
 )
 ReactDOM.render(<App/>, document.getElementById("root"));
