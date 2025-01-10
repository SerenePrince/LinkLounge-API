# LinkLounge API

The backend API for the **LinkLounge** project, built using **Node.js**, **Express**, and **MongoDB**. This API is part of the MERN stack implementation used in the full production of LinkLounge.

## About the Project
This project is a personal endeavor developed solely by me to showcase my skills in building robust and scalable backend systems. The **LinkLounge API** powers the LinkLounge platform, enabling users to create personalized lounges to share links, images, and social media profiles in a centralized, customizable space.

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
   NODE_ENV=development
   DATABASE_URI=your-mongodb-connection-string
   ACCESS_TOKEN_SECRET=your-access-token-secret
   REFRESH_TOKEN_SECRET=your-refresh-token-secret
   PASSWORD_RESET_TOKEN_SECRET=your-password-reset-token-secret
   EMAIL_USERNAME=your-email-username
   EMAIL_PASSWORD=your-email-password
   FRONTEND_URL=your-frontend-url
   CLOUD_NAME=your-cloudinary-cloud-name
   API_KEY=your-cloudinary-api-key
   API_SECRET=your-cloudinary-api-secret
   CLOUDINARY_URL=your-cloudinary-url
   ```

4. Start the server:
   ```bash
   npm start
   ```
   The API will be available at `http://localhost:5000`.

## API Endpoints

### Authentication
- **POST** `/api/auth`: Log in with username and password.
- **GET** `/api/auth/refresh`: Refresh access token using a refresh token.
- **POST** `/api/auth/logout`: Log out and clear refresh token cookie.
- **POST** `/api/auth/forgot-password`: Handle password reset request.
- **POST** `/api/auth/reset-password`: Reset the password.
- **POST** `/api/auth/forgot-username`: Handle forgotten username requests.
- **POST** `/api/auth/feedback`: Submit feedback.

### User Management
- **POST** `/api/users`: Create a new user.
- **GET** `/api/users`: Retrieve all users (requires authentication).
- **PATCH** `/api/users`: Update user details (requires authentication).
- **DELETE** `/api/users`: Delete a user (requires authentication).

### Lounge Management
- **GET** `/api/lounges/:username/:title`: Fetch a public lounge.
- **GET** `/api/lounges/:user`: Retrieve lounges by user.
- **POST** `/api/lounges`: Create a new lounge (authenticated).
- **PATCH** `/api/lounges`: Update an existing lounge (authenticated).
- **DELETE** `/api/lounges`: Delete a lounge (authenticated).
- **PATCH** `/api/lounges/public`: Make a lounge public (authenticated).

### Static Files
- **GET** `/` or `/index`: Serve the landing page (`index.html`).

### Image Upload
- **POST** `/api/uploads`: Upload an image to Cloudinary and retrieve its URL.

## Deployment

### To Deploy Locally
- Use a tool like [Postman](https://www.postman.com/) to test API endpoints.
- Make sure your MongoDB server and Cloudinary account are properly configured.

### To Deploy to Production
1. Choose a hosting platform like [Heroku](https://www.heroku.com/) or [AWS](https://aws.amazon.com/).
2. Set environment variables in the production environment.
3. Push your code to the production server.

## Showcase and Contact
This project is not open for contributions or further development by others but serves as a showcase of my capabilities in backend development. If you have any questions or feedback, feel free to reach out to me via [GitHub Issues](https://github.com/yourusername/LinkLounge-API/issues) or through my [portfolio](https://yourportfolio.com).

## License
This project is proprietary and developed solely by me. No part of this project may be reused, modified, or distributed without explicit permission.
