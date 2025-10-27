# Blogfolio - Personal Blog Platform

A modern React-based blog platform built with TypeScript, Redux Toolkit, and styled-components.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with dark/light theme support
- **Authentication**: JWT-based user authentication system
- **Post Management**: Create, read, update, and delete blog posts
- **Search & Filter**: Real-time search functionality
- **Favorites**: Save and manage favorite posts
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **State Management**: Redux Toolkit
- **Routing**: React Router v7
- **Styling**: CSS Modules + Styled Components
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

3. Create environment file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## 🎯 Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run format` - Formats code with Prettier

## 📁 Project Structure

```
src/
├── api/           # API services and HTTP client
├── components/    # Reusable UI components
├── features/      # Redux slices and business logic
├── layouts/       # Page layouts
├── pages/         # Application pages
├── store/         # Redux store configuration
└── styles/        # Global styles and themes
```

## 🔧 Configuration

The app uses environment variables for configuration:

- `REACT_APP_API_BASE_URL` - API base URL
- `REACT_APP_USE_MOCK` - Use mock data (0/1)

## 📝 License

This project is private and proprietary.
