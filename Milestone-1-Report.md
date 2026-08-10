# Milestone 1 – User Management & Authentication

## Objective

The objective of this milestone was to implement the foundational system for user authentication and role-based access control in the WasteZero platform.

## Features Implemented

* User Registration (User, Volunteer, Admin)
* Secure Login using JWT Authentication
* Role-based Access Control
* Separate Dashboards for each role
* Angular Frontend UI for Login and Register
* Backend API for authentication
* Database integration for storing user data

## Technologies Used

* Angular (Frontend)
* Node.js & Express (Backend)
* MongoDB (Database)
* JWT for Authentication
* Bcrypt for Password Hashing

## Outcome

The system successfully supports secure login and registration with role-based dashboards. This milestone established the base for further modules like opportunity management and messaging.


FRONTEND

auth/
  login/
  register/

dashboards/
  admin-dashboard/
  user-dashboard/
  volunteer-dashboard/

shared/
  navbar/
  sidebar/


  BACKEND

  models/
  User.js

controllers/
  authController.js

routes/
  authRoutes.js

middleware/
  authMiddleware.js

config/
  db.js