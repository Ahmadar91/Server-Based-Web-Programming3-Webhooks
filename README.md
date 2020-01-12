# aa224fn-examination-3

Examination assignment 3 for Ahmad Abdilrahim

# URL FOR application:  
http://assign3.softuza.com/

# Describe what you have done to make your application secure, both in code and when configuring your application server:

# In code:

For back end i have used express, express-github-webhook, octanode and http for communcation between my server and githubs and i also have used a secret which both express-github-webhook octanode use to validate that the response is coming from github and it uses the secret which i have used as an enviroment variable and compares it with the secret from gihub and if they dont mat ch the response is droped. Also i have sent only sent the data i need to display in the payload to the front end which i use a framework react which also have a XSS prote ction by default and since i dont have forms and POSTS i did not implement a csurf Token and since i dont have POST Requests in the client my websocket is not listing to request from the Client. I have used depndancys which have none vulnerability using npm -update. and for production i have used the npm run build for react with a environment variable which has the socket listing on wss.

# In server:

I have Used Digial Ocean Hosting service which provides secure servers for productions and by following their guides i have confugired the servers firewall listing to NginxFull which is (443 and 80) and openSSH and i used PM2 which is a proccess manager.

# Describe the following parts, how you are using them, and what their purpose is in your solution:

# Reversed proxy:

A reserve proxy is a server that is behide the firewall which role is to diract clients request to the spcified server. It also provides better secureity in case of attacts which will not be directly to the server and better control for flow of tracffic between client and server it is like a middleware which provides extra protection.I have used Nginx as a reserver proxy which sits as medium between client and the backend server and i have configured it to listing to ports 80 and 443 by NginxFull.

# Process manager:

Production process managers helps and keeps the appication online it runs it in the background a service applications that crashes are restart automatically by PM2 which i am using following the digital ocean guide configurations.

# TLS certificates:

Transfare layer security certificates which is certificate that do two things. The first it grants permission to use encrypted communication via Public Key Infrastructure.The second authenticates the identity of the certificate’s holder.I have used a self-signed certificates by following digital ocean guide to allow me to use the https. then i got a domain name and modified the certifcate using lets-Encrypt which is better than self-signed.

https://www.ssllabs.com/ssltest/

# Environment variables: 

By using .env i can declare a variable or sensitive vaiables in the env file which will not be uploaded or showing in github for example like the Token from github which is a personal Token. it is also used for if you have the same variale in diffrent places and you need to change it that would call to change each one but by using a env you only need to change it in the env file. i am using them both in the Client and the Server which i have .env with varaibles like Token, socket.

DigitalOcean guides that i used:  
https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu-18-04  
https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04  
https://certbot.eff.org/lets-encrypt/ubuntubionic-nginx  

# What differs in your application when running it in development from running it in production:

In my application the only thing that defers between development and production is the Client side in which i have to run npm run build to build the Client side in which i serve it using the server. Also it mean the my application has react a stable version and the code is cleaned both in server and client and by running the server through pm2 start app.js.

# Which extra modules did you use in the assignment? Motivate the use of them, and how you have to make sure that they are secure enough for production:

dotenv:to load the enviroment variables.  
morgan:logger for development and testing.   
body-parser:persing incomming request.  
ws: websocket to communicate with the client.  
octonode: github apiv3 library as suggested in the examination 3 to authinticate and get the issues.  
express-github-webhook: github library to handle webhooks.  
checking their secuiry by running npm install --production and npm update.  

# Have you implemented any extra features (see below) that could motivate a higher grade of this assignment? If so, describe them:

No
