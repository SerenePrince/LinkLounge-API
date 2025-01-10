# LinkLounge API

The backend API for the **LinkLounge** project, built using **Node.js**, **Express**, and **MongoDB**. This API is part of the MERN stack implementation used in the full production of LinkLounge.

## Features
- **User Management**:
  - Securely store user information, including usernames, passwords, and emails.
  - Authentication using industry-standard practices.
- **Lounge Management**:
  - Create, update, and delete custom lounges.
  - Store and manage links to social media, websites, and other URLs.
- **Image Hosting**:
  - Images are hosted in **Cloudinary**.
  - Store Cloudinary URLs in the LinkLounge database for seamless integration.

## Technologies Used
- **Node.js**: Runtime environment for executing server-side code.
- **Express**: Web application framework for building APIs.
- **MongoDB**: NoSQL database for storing user and lounge data.
- **Cloudinary**: Media storage and optimization service.

## Getting Started

### Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version 16 or later recommended)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Cloudinary Account](https://cloudinary.com/)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/LinkLounge-API.git
   cd LinkLounge-API
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root and add the following environment variables:
   ```env
   PORT=5000
   MONGO_URI=your-mongodb-connection-string
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   JWT_SECRET=your-jwt-secret
   ```

4. Start the server:
   ```bash
   npm start
   ```
   The API will be available at `http://localhost:5000`.

## API Endpoints

### Authentication
- **POST** `/api/auth/register`: Register a new user.
- **POST** `/api/auth/login`: Log in an existing user.

### User Management
- **GET** `/api/users/me`: Retrieve logged-in user's information (requires authentication).

### Lounge Management
- **POST** `/api/lounges`: Create a new lounge.
- **GET** `/api/lounges`: Retrieve all lounges.
- **GET** `/api/lounges/:id`: Retrieve a specific lounge by ID.
- **PUT** `/api/lounges/:id`: Update a lounge by ID.
- **DELETE** `/api/lounges/:id`: Delete a lounge by ID.

### Image Upload
- **POST** `/api/uploads`: Upload an image and get the Cloudinary URL.

## Deployment

### To Deploy Locally
- Use a tool like [Postman](https://www.postman.com/) to test API endpoints.
- Make sure your MongoDB server and Cloudinary account are properly configured.

### To Deploy to Production
1. Choose a hosting platform like [Heroku](https://www.heroku.com/) or [AWS](https://aws.amazon.com/).
2. Set environment variables in the production environment.
3. Push your code to the production server.

## Contributing
Feel free to fork the repository and submit pull requests. Contributions are welcome to improve and expand the API functionality.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

---
