# TODO NodeJS Backend Application
By Ido Rosenberger <br>
ido.ross98@gmail.com <br>
Feel free to contact me :)
# Microservices
## Todo REST API
This is a Microservice to manage the CRUD operations for Todo items with support for user notifications.
## Notifications service
This is a Microservice to manage different types of notifications to send to the user.<br>
Currently only supporting Todo notifications but this service is highly scalable to support new types of notifications i.e. messages.
## Notes
The Todo Microservice will manage its own notification whilst the Notifications service will only create update delete and send the notifications to the user.<br>
This is so the Notifications service will be genaric and highly scalable so it can support new types of notifications.

# How to run
1. Add `.env` file to both Microservices root:<br>
```
MONGO_URI=YOUR_ATLAS_CONNECTION_STRING
```
1. Open terminal
1. ```cd notification-service```
2. ```npm i```
3. ```npm run start:dev```
4. Open new terminal
5. ```cd todo-rest-api```
6. ```npm i```
7. ```npm run start:dev``` 


Now both Microservices are up and running.
<br>
You can use attached Postman collection to use these apis. Postman collection has result examples for all API calls.<br>
Creating a todo via the Postman collection will set its deadline so it will be notified by the notifications microservice