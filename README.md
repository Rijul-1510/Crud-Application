# CRUD Application
This is a full-stack CRUD application built with React (frontend) and Node.js (backend) that enables users to sign up, log in, update their profiles, and upload documents (PDF, DOC, or DOCX). The application features form validation, real-time feedback, edit mode, and document previews, making it a solid foundation for modern user management systems.

The backend uses a simple user_data.json file as a mock database and supports file uploads stored in the uploads/ directory. Users can view and manage their profiles through a dedicated fetch data interface.
This project demonstrates practical implementation of:

- Authentication (Login/Sign-up)
- Form validation and controlled components
- File upload with live preview and validation
- JSON-based data persistence (mock DB)
- Edit and update user records
- Organized React project structure with custom styling


# Directory Structure 
``` bash
crudapplication/
├── node_modules/                # Dependencies
├── public/
│   ├── index.html              # Main HTML template
│   ├── manifest.json           # Web manifest
│   └── travel.mp4              # (Optional) Static asset
│
├── server/                     # Express Backend
│   ├── uploads/                # Uploaded user files
│   │   └── .gitkeep            # Keeps uploads folder in Git (optional)
│   ├── Server.js              # Main Express server logic
│   └── user_data.json         # JSON file acting as a mock database
│
├── src/                        # React Frontend
│   ├── App.js                 # Main entry point with routes
│   ├── index.js               # React DOM rendering
│   ├── index.css              # Global styles
│   ├── Login.js               # Login form
│   ├── Login.css              # Login form styles
│   ├── SignUp.js              # Sign-up + edit form
│   ├── SignUp.css             # Sign-up form styles
│   ├── FetchData.js           # Page for fetching and showing user data
│   ├── fetchData.css          # FetchData page styles
│   ├── ForgotPassword.js      # Forgot Password functionality
│
├── .gitignore                 # Git ignore rules (e.g., node_modules, uploads)
├── package.json               # NPM config (dependencies, scripts)
├── package-lock.json          # Auto-generated lockfile
└── README.md                  # Project overview and instructions
```

# Usage 

# 1. Install Dependencies
     In the root directory, run:
     ``` bash
     npm install
     ```
     
# 2. Start the Backend Server
     Navigate to the backend server directory:
     ```bash
      cd server
      ```
     Run the backend:
     ```bash 
     node server.js
     ```
This will start the server on http://localhost:5000

# 3.Start the React Frontend
    In a separate terminal window, start the frontend:
    ```bash
    npm start
    ```
This runs the app in development mode at http://localhost:3000

# Results 

# Login Screen 

https://github.com/user-attachments/assets/6bcaf2d5-0add-446e-8f55-113f984204da

# Forgot Password Screen

![Screenshot 2025-06-10 164923](https://github.com/user-attachments/assets/ccdd958c-33ee-4a7f-bdaa-c209631afea9)

![Screenshot 2025-06-10 165002](https://github.com/user-attachments/assets/07360b71-de3a-4cb7-87a7-846642c23278)

# Signup Screen

https://github.com/user-attachments/assets/8904a6da-ea17-4102-a98a-af5f3170a4f9

# User Details Screen 

![Screenshot 2025-06-10 165155](https://github.com/user-attachments/assets/c42207cc-dc87-4ba8-920c-fa417fddab33)

# Application Working 

https://github.com/user-attachments/assets/2c4d5ef7-22a5-4825-9082-e7ffbfaaa832



