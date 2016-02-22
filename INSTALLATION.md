Requres:
NodeJS 4+
NPM
MongoDB
Nginx (optional)

Init
1. Global npm modules
npm i -g bower webpack gulpjs/gulp#4.0

2. Project modules & client libraries
npm i
bower i

3. Generate syles and copy images
gulp build

4. Build frontent app
webpack

5. Init database
npm run initdb

6. Config nginx (optional)
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

5. Visit http://localhost:3000 (or http://localhost if nginx is running)