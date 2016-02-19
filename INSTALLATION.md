Requres:
NodeJS 4+
NPM
MongoDB
Nginx (optional)

Init
1. Global npm modules
npm i -g bower webpack

2. Project modules & client libraries
npm i
bower i

3. Build frontent app
webpack

4. Init database
npm run initdb

5. Config nginx (optional)
Copy nginx.conf to nginx folder
Set your url to server_name roperty
Set alias for 'location /artists/'  to your music collection 


Run
1. Set environment
Windows:
set NODE_PATH=.

Linux:
exports NODE_PATH=.

2. Start MongoDB

3. Start NodeJS
node app.js

4. Start Nginx (optional)
