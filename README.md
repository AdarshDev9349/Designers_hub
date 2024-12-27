# Designers Hub

Designers Hub is a collaborative platform designed for creative professionals to showcase their projects, connect with peers, and manage their design portfolio seamlessly. With features like user authentication, project addition, and profile management, it serves as a centralized hub for designers.

## Features

- **User Authentication**: Secure login system using tokens to authenticate users.
- **User Profiles**: Personalized profiles to view and manage user details.
- **Project Showcase**: Add, view, and manage design projects with Figma integration.
- **Interactive UI**: Dynamic animations and responsive design for an enhanced user experience.
- **Secure API Integration**: Backend APIs for user data and project management.

## Technologies Used

- **Frontend**: React, TailwindCSS, Framer Motion (for animations)
- **Backend API**: Axios for HTTP requests
- **Routing**: React Router for navigation
- **Deployment**: Render for backend hosting

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/designers-hub.git
   cd designers-hub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Set up your backend server and replace the API URLs in the code (`https://fig-hub.onrender.com`) with your backend's endpoint.

## Folder Structure

- `LoginForm`: Handles user login with authentication.
- `ProfilePage`: Displays user profile information and projects.
- `Modal`: Enables users to add new projects.
- `API Integration`: Connects to backend for login and project management.

## How to Use

1. **Login**: Use your credentials to log in or sign up for a new account.
2. **Profile Management**: View your profile details and manage your projects.
3. **Add Projects**: Use the modal to add new projects with project name and Figma URL.
4. **Explore Projects**: View all your added projects in a visually appealing grid layout.

## Deployment

Ensure that the backend server is hosted and running. Update the environment variables or API URLs accordingly. Deploy the frontend to platforms like Vercel or Netlify for public access.

## Future Enhancements

- Search and explore projects by other users.
- Add collaboration tools for team-based projects.
- Enable project categories and tags for better organization.
