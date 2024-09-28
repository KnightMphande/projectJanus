# Project

A single car rental service management system

## Table of Contents
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Swagger](#swagger)
- [API Endpoints](#api-endpoints)
- [Features](#features)
- [Technologies Used](#technologies-used)


## Installation

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v20.17.0)
- [npm](https://www.npmjs.com/)

### Steps
1. Install dependencies:
    ```bash
    npm install -g nodemon
    npm install
    ```

## Configuration

### Environment Variables
Create a `.env` file in the root of your project and configure the following environment variables:
* PORT
* POSTGRES_USER
* POSTGRES_HOST
* POSTGRES_DATABASE
* POSTGRES_PASS
* PORT_DB
* NODEMAILER_USER
* NODEMAILER_PASS


## Usage

### Running the App

To start the server in development mode:

```bash
npm run dev
```

## Swagger
To access the swagger docs and make sure server is running on localhost:
[http://localhost:5000/api/docs](http://localhost:5000/api/docs)

## API Endpoints
List of API routes:

| Method        | Endpoint                  | Description                                           |
| ------------- |:-------------------------:| -----------------------------------------------------:|
|    GET        |  /api/test                |  returns hello message                                |
|    POST       |  /api/auth/register       |  register new customer                                |



## Technologies Used
* Node.js
* Express.js framework
* JWT for authentication
* Nodemon for auto-restarting the server in development
