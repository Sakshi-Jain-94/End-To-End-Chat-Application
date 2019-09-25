# End-To-End-Chat-Application
Small POC kind of chat application that conatins client, agent & server(node) built with webpack.
Entire message sharing / token management is through websocket. No rest apis are used for login or validation purpose.
For client side. Otp validations for mobile number is dummy. You can integrate your own otp validation service if required.


Its a chat application with tech stack - React JS & backend with Node JS. 
You can have fun while chat with BOT/manual agent at a single place.

To Start with,:

We have three main folders - client, agent & server.

Steps to setup:

Commands to run client app  ./client/

1. npm install
2. npm start (to start app in webpack dedv server mode @ https://localhost:7000)
3. npm run build (for development)
4. npm run build:prod (for production)

Any dummy mobile number & OTP wil work


Commands to run agent app ./agent/

1. npm install
2. npm start (to start app in webpack dedv server mode @ https://localhost:8888)
3. npm run build (for development)
4. npm run build:prod (for production)

For agent one needs to login with valid credentials. For initial setup credentials already saved in DB are:

username - test.chat@mychat.in
password - passcode

Commands to set up node server ./server/

1. Import "my-chat.sql" to your my sql server
2. change database configuartion in "database.js" file if needed to connect to your DB
3. Run mysql server
4. Inside server/ , execute command "node server.js"
      OR
   To add "watch-restart" so that your server automatically restart on change, execute "nodemon server.js"
   
   
For chatbot: 
Current Romantic Trip intent are completed. For other you can add intent as per your requirement in tripPlanner.js

For any issue while setup. feel free to contact.
   



