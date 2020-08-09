Nodejs - Expressjs CRUD with Materialize css framework and mongoDB, nodemailer included.

---------------
Required: Nodejs and mongoDB must be installed.
Recommended: nodemon global installation:
open terminal and type:  npm install -g nodemon
---------------
Open terminal in root (node-express-demo folder) and type:
npm install
------------------
Seeding a initial user to be able to use Admin area,
signup only for authenticated user accessible.

Seeding initial user data:
start Mongo server, local:
(sudo mongod in linux)
open terminal in seed folder (node-express-demo/seed folder) and type:
node user-seeder.js

Initial user credentials:
name = test
email = test@test.com
password = test 
-----------------
Start server:
open terminal in root (node-express-demo folder) and type:
npm start
or (if nodemon installed)
nodemon server.js
or simply (preferred)
nodemon
----------------
open browser and type URL:
http://localhost:3000/

Admin area, type URL:
http://localhost:3000/users/signin
