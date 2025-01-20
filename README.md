# Stack Overflow Backend: From Monolith to Microservices

## Project Overview
This project is a basic implementation of a Stack Overflow-like system built first as a monolithic web-based application and later broken down into microservices. The main goal of this project is to demonstrate the transition from a monolithic architecture to a microservices architecture.

## Features
The application includes the following features:

### Client
- **SignUp Page**: Register new users with an email and password.
- **SignIn Page**: Users can log in using their email and password.
- **Home Page**: Displays a list of posts (text or code snippets) from other users.
- **Notification Page**: Shows notifications of recent posts. Clicking on a notification opens the related post.

### Server
The server provides several RESTful API endpoints:
- **/signup**: Register a new user using email and password.
- **/signin**: Log in an existing user using email and password.
- **/post**: 
  - `GET`: Retrieve the latest posts from all users except the logged-in user.
  - `POST`: Create a new post for the logged-in user.
- **/notification**:
  - `GET`: Retrieve notifications for the logged-in user.
  - `POST`: Create a notification against a post.

### Jobs
- **Notification Cleaner**: A background job that periodically deletes old notifications from the system.

## Technology Stack
- **Backend**: Node.js
- **Frontend**: React
- **Database**: MongoDB
- **Object Store**: MinIO for storing code snippets uploaded with posts.


## System Assumptions
- The system will not include extra features (e.g., comments, votes) to keep the initial implementation simple.
- The object store database (MinIO) is used for storing code snippet files.

## Installation
### Prerequisites
- [Node.js](https://nodejs.org/)  installed on your system.
- [MinIO](https://min.io/) for object storage.
- MongoDB database system.

### Steps
### 1. Clone the Repository
   ```bash
   https://github.com/thabir303/Stack-OverFlow2.0.git
   cd Stack-OverFlow2.0
   ```
### 2. Install Backend Dependencies
```bash
cd Server
npm install  
```

### 3. Install Frontend Dependencies
```bash
cd ../client
npm install
```

### 4. Set Up MinIO
- Follow the [official MinIO guide](https://min.io/docs/minio/linux/index.html) for installation and configuration.

### 5. Configure Environment Variables
- Create `.env` files in both the `Server` and `client` directories with the required configuration (e.g., database connection, MinIO settings).

### 6. Run the Application
- **Server:**
    ```bash
    cd Server
    npm start  
    ```
- **Client:**
    ```bash
    cd client
    npm start
    ```
    
### 7. Access the Application
- Open a browser and navigate to `http://localhost:5173`.

## Breaking Down to Microservices
In the next phase, this monolithic application will be broken down into microservices:

1. **User Service**: Handle user authentication (SignUp/SignIn).
2. **Post Service**: Manage post creation and retrieval.
3. **Notification Service**: Handle notifications and cleaning jobs.
4. **Object Storage Service**: Separate service for storing code snippets in MinIO.
