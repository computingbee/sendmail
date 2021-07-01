# SendMail Web App

## INTRO
SendMail is a MEAN web app that allows sending email attachments from DoNotReply@yourdomain.com email address.

This ReadMe outlines the instructions to develop and deploy sendmail.

Please read this document carefully. It's divided into **TWO** sections. Production section contains instructions for deploying. Development section contains instructions for development. 

The web app structure is divided into **backend (REST API)** and **frontend (Angular SPA)**. 

There are two backend services:
1. **relaymail**:  https://sendmail.yourdomain.com:8084/api/relaymail
	- Endpoints:
		- https://sendmail.yourdomain.com:8084/api/relaymail/relay - Submit (or relay) email
		- https://sendmail.yourdomain.com:8084/api/relaymail/history - History of emails sent
		
2. **upload-files**: https://sendmail.yourdomain.com:8082
	- Endpoints:
		- https://sendmail.yourdomain.com:8082/upload - Upload a file

***Production Features***:
- Frontend Angular SPA is deployed to IIS website after compiling.  
- Let's Encrypt certificate is used for TLS. 
- URL Rewrite is used for redirecting http to https.
- MongoDB is used to store email history. 

## Production Setup
**Base Folder(s)**:
- S:\sendmail
- S:\nodejs
- S:\mongodb

Directory Structure:
```
.\sendmail
		 \frontend\sendmailui
		 \backend\relaymail
		 \backend\upload-files
		 \uploads
.\nodejs
		\pm2-installer-main
.mongodb
		\data
		\bin
```

#### MongoDB Prod Service
DB Folder: S:\mongodb
Data Folder: S:\mongodb\data
Config File: S:\mongodb\bin\mongod.conf
```
----------------------------------------------------------------
systemLog:
  destination: file
  path: "S:\\mongodb\\data\\stdlogs\\stdmongodb.log"
  logAppend: true
  logRotate: reopen
storage:
  dbPath: "S:\\mongodb\\data"
security:
  authorization: enabled
net:
   bindIp: 0.0.0.0
   port: 27017
storage:
   journal:
      enabled: true
----------------------------------------------------------------
```
***Install MongoDB Instance as Service***:
- Download **zip** (not MSI) and extract it to s:\mongodb
- Install C:\dev\sendmail\tools\VC_redist.x64.exe
- Install Compass GUI
***NOTE***: *Keep development and production instances on separate TCP port*
1. Set MongoDB_HOME = S:\mongodb
2. Set PATH=%PATH%\%MongoDB_HOME%\bin
3. Install VC_redist if not already installed 
4. Extract MongoDB zip file to S:\mongodb
5. Install Windows Service
```
mongod.exe -f S:\mongodb\bin\mongod.conf --install
```
*Setup MongoDB Auth*: https://docs.mongodb.com/manual/tutorial/enable-authentication/
6. Change authorization: enabled -> authorization: disabled and restart Windows service
7. Use Compass GUI to connect using mongodb://localhost:27017
8. Create *sendmail* database
9. Create *emails* collection in database
10. Create username/password in MongoDB shell
```
use sendmail
db.createUser({
	user:"sendmailuser",
	pwd:passwordPrompt(),
	roles: [
		{role:"readWrite", db:"sendmail"}
	]
})
```
11. Change authorization: disabled -> authorization: enabled
12. Restart Windows service
13. Test from Compass using 
```
mongodb://sendmailuser:sendmailpass@localhost:27017/sendmail?authSource=sendmail
```

#### IIS Prod Setup
- Install Web Server role and enable following additional features
	- Dynamic Compression
	- HTTP Redirection
- Download and Install URLRewrite
- Stop Default Website
- Create new website and point its physical directory to S:\sendmail\frontend\sendmailui
- Configure the site to use SSL
- web.config already contains rule for redirection from http -> https. Ensure rule is enabled.
- Renewal of SSL cert is handled by Let's Encrypt script, Publish-LECert.ps1

#### NodejS Setup
- Copy or download extract latest NodeJS to S:\nodejs
- Set:
	-  NODEJS_HOME = S:\nodejs
	- PATH = %PATH%\%NODEJS_HOME
	- NODE_ENV=production
- Setup ***PM2*** as Windows Service:
	-	Download https://github.com/jessety/pm2-installer to S:\nodejs\pm2-installer-main and run
```
npm run configure
npm run configure-policy
npm run setup
pm2 list
```
*NOTE: Ensure Windows service called PM2 is running before continuing or PM2 will be out of sync*
- Copy relaymail and upload-files to S:\sendmail\backend\ and register with PM2 as below:
```
cd \sendmail\backend\relaymail
pm2 start server.js --name relaymail --watch
pm2 monitor relaymail

cd \sendmail\backend\upload-files
pm2 start server.js --name upload-files --watch
pm2 monitor upload-files

pm2 save

pm2 status
```

*NOTE: All PM2 data is saved under ***C:\ProgramData\pm2***.*

## Development
**Base Folder(s)**:
 - C:\dev\sendmail

Directory Structure:
```
.\sendmail\
		 \tools
		 \tools\mongodb
		 \tools\nodejs
		 \tools\ide\vscode
		 \tools\ide\workspaces
		 \data\db
		 \data\stdlogs
		 \webapp\frontend\sendmailui
		 \webapp\backend\relaymail
		 \webapp\backend\upload-files
		 \ReadMe.md
		 \setpath.cmd
```

IDE: VSCode

URLs: 
- sendmailui: https://sendmail.yourdomain.com:4200
- relaymail: https://sendmail.yourdomain.com:6084/api/relaymail
- upload-files: https://sendmail.yourdomain.com:6082/
- mongodb-url: mongodb://sendmailuser:sendmailpass@localhost:37017/sendmail?authSource=sendmail

Running/Testing:
```
setpath.cmd

Code.exe

cd \webapp\frontend\sendmailui
ng serve --host 0.0.0.0 sendmailui

cd \webapp\backend\relaymail
node . start

cd \webapp\backend\upload-files
node . start

```

#### MongoDB DEV Setup
DB Folder: C:\dev\sendmail\tools\mongodb
Data Folder: C:\dev\sendmail\data
Config File: C:\dev\sendmail\tools\mongodb\bin\mongod.conf
```
----------------------------------------------------------------
systemLog:
  destination: file
  path: "C:\\dev\\sendmail\\data\\stdlogs\\stdmongodb.log"
  logAppend: true
  logRotate: reopen
storage:
  dbPath: "C:\\dev\\sendmail\\data"
security:
  authorization: enabled
net:
   bindIp: 0.0.0.0
   port: 37017
storage:
   journal:
      enabled: true
----------------------------------------------------------------
```
***Start Dev MongoDB Instance in CMD***:
```
cd c:\dev\sendmail
setpath.cmd
mongod.exe -f C:\dev\sendmail\tools\mongodb\bin\mongod.conf
```
Follow instructions in PROD section to setup Authentication

#### Setup IDE and Projects 
1. Setup VSCode
	- Download VSCode zip file and extract to tools\ide\vscode 
	- Create new workspace called sendmail under tools\ide\workspaces
	- Add sendmail\webapp folder to workspace

2. NodeJS Projects
```
setpath.cmd

cd \webapp\backend\upload-files
npm install express multer cors winston

cd \webapp\backend\relaymail
npm install nodemailer express body-parser cors winston mongoose mongoose-aggregate-paginate-v2
```
3. Angular project with angular-cli
```
setupenv.cmd
npm install @angular/cli
npm install ngx-pagination
cd .\sendmail\webapp\frontend
ng new sendmailui
cd sendmailui
ng g s services/email

ng g c components/email-submit
ng g c components/emails-list
ng g c components/progress
ng g d components/dnd

ng g class models/email
```