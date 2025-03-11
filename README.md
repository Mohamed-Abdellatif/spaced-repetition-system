# Spaced Repetition System (SRS)

A modern web application for efficient learning through spaced repetition, built with React and Firebase.

## Overview

The Spaced Repetition System (SRS) is a sophisticated learning tool that helps users retain information more effectively by scheduling review sessions at optimal intervals. This application combines proven learning techniques with modern technology to create an engaging and effective study experience.

## Features

- **Smart Question Management**
  - Create and organize questions with multiple formats (MCQ, text-based)
  - Categorize questions by genre and difficulty
  - Add images to questions for visual learning
  - Search functionality for quick access to specific questions

- **Spaced Repetition**
  - Intelligent scheduling of review sessions
  - Progress tracking for each study session
  - Visual feedback on learning progress
  - Customizable study lists

- **List Management**
  - Create and manage multiple study lists
  - Add questions to different lists
  - Search and filter lists
  - List descriptions and metadata

- **User Authentication**
  - Secure login with email/password
  - Google authentication integration
  - Protected routes and user-specific content
  - Profile management

- **Modern UI/UX**
  - Responsive design for all devices
  - Clean and intuitive interface
  - Progress visualization
  - Loading states and animations

## Technology Stack

- **Frontend**
  - React 18.2.0
  - React Bootstrap 5.3.1
  - React Router 7.2.0
  - Styled Components 5.3.6
  - Font Awesome for icons
  - Framer Motion for animations
  - FullCalendar for scheduling

- **Backend & Services**
  - Firebase Authentication
  - Firebase Firestore
  - Google Generative AI integration
  - Axios for API communication

- **Development**
  - Vite for build tooling
  - ESLint for code quality
  - SASS for styling
  - Environment variable management

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with the following variables:
   ```
   VITE_SRS_BE_URL=your_backend_url
   VITE_API_KEY=your_google_api_key
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:5173](http://localhost:5173) to view the app in your browser

## Project Structure

```
src/
├── Authentication/       # Authentication components and styles
├── components/          # React components
│   ├── navbar/         # Navigation components
│   ├── questionList/   # Question management
│   ├── StudyPage/      # Study interface
│   └── ...
├── contexts/           # React contexts
├── Utils/             # Utility functions
├── assets/            # Static assets
└── App.jsx            # Main application component
```

## Key Components

- **QuestionList**: Manages the creation, editing, and organization of questions
- **StudyCards**: Implements the spaced repetition study interface
- **ListsPage**: Handles the organization of study lists
- **Authentication**: Manages user authentication and profile
- **Navbar**: Provides navigation and user interface controls

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Create React App for the initial project setup
- Firebase for authentication and database services
- React Bootstrap for UI components
- The spaced repetition learning community for inspiration
