# File Upload and Download System

A simple yet secure file upload and download system built with Node.js, Express, Multer, and MongoDB.

## Features

- File upload with size validation
- List of uploaded files
- File download functionality
- Metadata storage in MongoDB
- Beautiful and responsive UI with EJS templates

## Prerequisites

- Node.js (v12 or higher)
- npm (v6 or higher)
- MongoDB Atlas account

## Installation

1. Clone the repository or download the source code
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the root directory with:
```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
```

## Configuration

### HTTPS Setup (Optional)

For HTTPS support, you need to generate SSL certificates. You can use self-signed certificates for development:

```bash
openssl genrsa -out key.pem 2048
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem
```

Place the `key.pem` and `cert.pem` files in the root directory of the project.

## Usage

### Starting the Server

```bash
npm start
```

The server will start on port 3000 by default (http://localhost:3000).

### Uploading Files

1. Navigate to the upload page: http://localhost:3000/upload
2. Select a file using the file picker
3. Click the "Upload File" button
4. A success message will appear, and the file details will be displayed

### Downloading Files

1. Navigate to the download page: http://localhost:3000/download
2. You'll see a list of all uploaded files
3. Click the "Download" button next to the file you want to download

## Deployment to Render.com

### Preparation

1. Make sure you have a MongoDB Atlas database set up
2. Ensure you've added your current IP or 0.0.0.0/0 (all IPs) to the MongoDB Atlas IP Whitelist

### Steps for Deployment

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: https-upload-download (or your preferred name)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node app.js`
4. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB connection string
5. Click "Create Web Service"

### After Deployment

- The application will be available at your Render URL (e.g., https://https-upload-download.onrender.com)
- Uploaded files are stored on the Render server and their metadata in MongoDB
- Note that files stored on Render might not persist if you're using the free tier

## Testing with Postman

### Testing File Upload

1. Open Postman
2. Create a new POST request to http://localhost:3000/upload (or your Render URL)
3. Go to the Body tab and select form-data
4. Add a field with the key `file` and select a file from your computer
5. Send the request

### Testing File Download

1. Open Postman
2. Create a new GET request to http://localhost:3000/download/{filename} (or your Render URL)
3. Send the request

## Security Considerations

- File size is limited to 5MB to prevent denial-of-service attacks
- Unique filenames are generated to prevent overwriting existing files
- MongoDB provides secure storage for file metadata
- Always implement proper authentication and authorization in production

## License

This project is licensed under the MIT License - see the LICENSE file for details. 