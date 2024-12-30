# Task Management App Backend

This is the backend server for the Task Management application, built with Node.js, Express, and MongoDB.

## Features

- User authentication (register, login, logout)
- JWT-based authentication
- CRUD operations for tasks
- MongoDB database integration
- CORS enabled for specified origins
- Environment variable configuration
- Cookie-based token storage

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Installation

1. Clone the repository: 
- git clone `https://github.com/0nikhilkumar/task-assign` 
- cd server


2. Install dependencies: 
- npm install


3. Create a `.env` file in the root directory and add the following environment variables:

- PORT=5000
- MONGODB_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret_here
- CORS=*


Replace `your_mongodb_connection_string` with your actual MongoDB connection string and `your_jwt_secret_here` with a secure secret for JWT token generation.

## Running the Server

To start the server in development mode with nodemon:

- npm run dev