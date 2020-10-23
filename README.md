# e-commerce-backend

This repository contains the code of APIs for Backend of E-commerce system. 
As the wikipedia says, E-commerce is the activity of electronically buying or selling of products on online services or over the Internet.
I have provided APIs for customers, products and their categories along with placing order. We can directly buy product or can checkout cart for ordering all products from cart.

> You can view the list of APIs [here](https://backendapi.turing.com/docs/#/).

The APIs are written using Express (Node.js) and MySql Database with the help of Sequelize ORM. I have implemented token based authentication using JWT. The APIs perform the payload validation by making of JOI Library.

## Checkout the Demo on [youtube](https://youtu.be/VJu8yIPkGEU)

## Setup Instructions :page_facing_up:
### 1.) Install and setup Node on your system
- [Install Node](https://nodejs.org/en/download/)
### 2.) Clone this repo onto your systems: [Clone Me](https://github.com/srishtivishnoi2102/e-commerce-backend.git) 
### 3.) Setup Project :
- Open up a Terminal or Powershell inside the cloned repo folder.
- Then run `npm install`, this will install all the dependencies. 
  (Run `npm install --dev` in case Dev Dependencies are not installed).

  
### 4.) Setup DataBase
- Install phpmyadmin
- Go to 'http://localhost/phpmyadmin/' and create database, (say ecom)

### 5.) Provide Environment Variables
- Run the command on IDE terminal inside project repo : **touch .env**
- Add following field in .env file:
  > PORT=<SERVER_PORT>
  
  > SALT=<SECRET_KEY>  
  > SALT_ROUNDS="12" or any number

  > DB_NAME=<DB_NAME>
  
  > DB_USER=<DB_USERNAME>
  
  > DB_PASSWORD=<YOUR_DB_PASSWORD>
  
  > DB_HOST="localhost"
  
  > DB_DIALECT="mysql"
  
  **Note**: spaces are not allowed before or after equality sign.
  
### 6.) Start the server
 - Run the command on the terminal inside project folder: **npm start**
 - Congo :fire: Your server is running 
 
### 7.) Hit the APIs
 - Download [Postman Collection](https://www.getpostman.com/collections/d630caa65b77df5c6cd8) and start hitting the APIs :rocket:

