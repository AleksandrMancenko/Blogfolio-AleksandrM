# Blogfolio - Personal Blog Platform

A modern React-based blog platform built with TypeScript, Redux Toolkit, and styled-components.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with dark/light theme support
- **Authentication**: JWT-based user authentication system with profile management
- **Post Management**: Create, read, update, and delete blog posts with image upload
- **Search & Filter**: Real-time search functionality with history
- **Favorites**: Save and manage favorite posts
- **Likes & Dislikes**: Interactive post feedback system
- **Sorting**: Sort posts by date, title, text, or lesson number
- **Pagination**: Browse posts with page navigation
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **State Management**: Redux Toolkit
- **Routing**: React Router v7
- **Styling**: CSS Modules + Global CSS Variables
- **Image Upload**: react-images-uploading
- **API**: RESTful API integration
- **Build Tool**: Create React App

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Blogfolio-AleksandrM
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## 🎯 Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner

## 📁 Project Structure

```
src/
├── api/           # API services and HTTP client
│   ├── authService.ts    # Authentication endpoints
│   ├── postsService.ts   # Posts CRUD operations
│   └── http.ts           # HTTP client
├── components/    # Reusable UI components
│   └── common/    # Shared components (Header, OverlayMenu, PostCard, etc.)
├── features/      # Redux slices and business logic
│   ├── auth/      # Authentication state
│   ├── posts/     # Posts management
│   ├── favorites/ # Favorite posts
│   ├── likes/     # Like/dislike functionality
│   └── search/    # Search functionality
├── layouts/       # Page layouts
├── pages/         # Application pages
├── store/         # Redux store configuration
└── styles/        # Global styles and themes
```

## 🔧 Key Features Explained

### Authentication
- JWT-based authentication with access and refresh tokens
- User profile management
- Protected routes requiring authentication
- Logout functionality

### Posts
- View posts with pagination (12 per page)
- Sort by: date, title, text, lesson_num
- Sort order: ascending or descending
- Create posts with image upload
- Like/dislike posts
- Add posts to favorites

### Search
- Real-time search autocomplete
- Search history
- Results page with highlighted matches

### UI/UX
- Light and dark theme support
- Responsive design
- Loading states and error handling
- Toast notifications
- Image preview modal

## 🔑 Environment Variables

The app connects to:
- API Base URL: `https://studapi.teachmeskills.by`

## 📝 License

This project is private and proprietary.

## 👤 Author

Aleksandr Malkin
