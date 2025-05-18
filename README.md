# Skillbook - Learning Management System UI

A modern React-based user interface for the Skillbook learning management system. This application provides a platform for learners and instructors to manage online courses and learning materials.

## Features

- User Authentication
  - Login and Registration system
  - Role-based access control (Learner, Instructor, Admin)
  - Secure password handling
- Responsive Navigation
  - Dynamic navigation based on user authentication status
  - Clean and intuitive user interface
- Dashboard System
  - Personalized dashboard for users
  - Course management interface
- Modern UI/UX
  - Consistent styling with CSS variables
  - Responsive design for all screen sizes
  - Interactive form elements with validation

## Technology Stack

- React 19.1.0
- React Router DOM 6.22.3
- Axios 1.9.0
- React Icons 5.5.0
- Modern CSS with CSS Variables
- Jest and React Testing Library for testing

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
   ```bash
   git clone [your-repository-url]
   cd skillbook-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add necessary environment variables:
   ```
   REACT_APP_API_URL=http://localhost:8080
   ```

## Available Scripts

- `npm start`: Runs the app in development mode at [http://localhost:3000](http://localhost:3000)
- `npm test`: Launches the test runner in interactive watch mode
- `npm run build`: Builds the app for production to the `build` folder
- `npm run eject`: Ejects the create-react-app configuration (one-way operation)

## Project Structure

```
skillbook-ui/
├── public/
├── src/
│   ├── assets/         # Static assets
│   ├── components/     # Reusable React components
│   ├── context/        # React context providers
│   ├── models/         # Data models and types
│   ├── pages/          # Page components
│   ├── styles/         # Global styles and CSS modules
│   └── App.js          # Main application component
```

## Backend Integration

The UI is designed to work with a RESTful backend API running on `http://localhost:8080`. Ensure the backend server is running before starting the application.


## Testing

The project uses Jest and React Testing Library for testing. Run the tests using:

```bash
npm test
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - [your-email@example.com]
Project Link: [https://github.com/yourusername/skillbook-ui]
