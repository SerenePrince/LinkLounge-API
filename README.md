---

# **LinkLounge API**

The backend API for the **LinkLounge** project, built with **Node.js**, **Express**, and **MongoDB**. This API powers the LinkLounge platform, enabling users to create personalized lounges to share links, images, and social media profiles in a centralized, customizable space.

---

## **About the Project**

This project is a personal endeavor developed solely by me, showcasing my skills in building robust and scalable backend systems. The **LinkLounge API** is part of the MERN stack implementation, providing all the functionality required for the LinkLounge platform.

---

## ✨ **Features**

- **User Management**:  
  - Securely store user data (username, password, email).  
  - Authentication using industry-standard practices (JWT).

- **Lounge Management**:  
  - Create, update, and delete custom lounges.  
  - Store and manage links to social media profiles, websites, and other URLs.

- **Image Hosting**:  
  - Seamless integration with **Cloudinary** for storing images.  
  - Cloudinary URLs stored in the database for efficient management.

---

## 🛠️ **Technologies Used**

- **Node.js**: JavaScript runtime for executing server-side code.  
- **Express**: Web framework for building RESTful APIs.  
- **MongoDB**: NoSQL database for storing user and lounge data.  
- **Cloudinary**: Cloud-based media storage and optimization service.

---

## 🚀 **Getting Started**

### **Prerequisites**

Ensure the following are installed on your system:

- [Node.js](https://nodejs.org/) (version 16 or later recommended)  
- [MongoDB](https://www.mongodb.com/try/download/community)  
- [Cloudinary Account](https://cloudinary.com/)

### **Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/LinkLounge-API.git
   cd LinkLounge-API
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables by creating a `.env` file with the following details:
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

---

## **API Endpoints**

### **Authentication**

- **POST** `/api/auth`: Log in with username and password.  
- **GET** `/api/auth/refresh`: Refresh access token using a refresh token.  
- **POST** `/api/auth/logout`: Log out and clear refresh token cookie.  
- **POST** `/api/auth/forgot-password`: Request a password reset.  
- **POST** `/api/auth/reset-password`: Reset the password.  
- **POST** `/api/auth/forgot-username`: Request a forgotten username.  
- **POST** `/api/auth/feedback`: Submit user feedback.

### **User Management**

- **POST** `/api/users`: Create a new user.  
- **GET** `/api/users`: Retrieve all users (authentication required).  
- **PATCH** `/api/users`: Update user details (authentication required).  
- **DELETE** `/api/users`: Delete a user (authentication required).

### **Lounge Management**

- **GET** `/api/lounges/:username/:title`: Fetch a public lounge.  
- **GET** `/api/lounges/:user`: Retrieve lounges by user.  
- **POST** `/api/lounges`: Create a new lounge (authentication required).  
- **PATCH** `/api/lounges`: Update an existing lounge (authentication required).  
- **DELETE** `/api/lounges`: Delete a lounge (authentication required).  
- **PATCH** `/api/lounges/public`: Make a lounge public (authentication required).

### **Image Upload**

- **POST** `/api/uploads`: Upload an image to Cloudinary and retrieve its URL.

---

## **Deployment**

### **Deploy Locally**

- Use tools like [Postman](https://www.postman.com/) for testing API endpoints.  
- Ensure that MongoDB and Cloudinary configurations are properly set up.

### **Deploy to Production**

1. Choose a hosting platform like [Heroku](https://www.heroku.com/) or [AWS](https://aws.amazon.com/).  
2. Set environment variables in the production environment.  
3. Push your code to the production server.

---

## **Showcase and Contact**

This project is a personal showcase of my backend development capabilities. For questions or feedback, feel free to reach out to me via [GitHub Issues](https://github.com/yourusername/LinkLounge-API/issues) or visit my [portfolio](https://yourportfolio.com).

---

## **License**

This project is proprietary and developed solely by me. No part of this project may be reused, modified, or distributed without explicit permission.
