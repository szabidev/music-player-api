# Music Band Database

This project is a simple music band database application built with Node.js, Express, and MongoDB using Mongoose for object data modeling (ODM). It allows users to create, read, update, and delete (CRUD) band information, including albums and songs.

## Features

- Connect to MongoDB using Mongoose
- CRUD operations for band information
- Import band data from a JSON file
- REST API for managing band data
- CORS enabled for cross-origin requests

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository

   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```

2. Install npm packages
   `npm install`

3. Start MongoDB server on your local machine
   `sudo systemctl start mongod` for linux
   `C:\mongodb\bin\mongod.exe --dbpath "pathToMongoDB\db\data"` for windows (replace with the correct path for MongoDB's data directory path)

4. Start server
   `npm start`

### Usage

After starting the server, you can use any HTTP client (like Postman or curl) to interact with the API.
ex: ```POST /bands
Content-Type: application/json

{
"name": "New Band",
"albums": [
{
"title": "New Album",
"songs": [
{
"title": "New Song",
"length": "4:30"
}
],
"description": "Album description here."
}
]
}```
