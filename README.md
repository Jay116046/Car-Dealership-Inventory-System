# Car Inventory

A full-stack MERN inventory application for managing and browsing a car showroom. The project includes:
- Backend: Node.js, Express, MongoDB, JWT authentication, role-based authorization, admin routes, and image upload support.
- Frontend: React, Vite, Redux Toolkit, Tailwind CSS, and client-side routing for inventory browsing and admin management.

## Project Overview

Car Inventory is a two-part application:
1. **Backend** (`backend/`) serves REST APIs for authentication and vehicle inventory management.
2. **Frontend** (`frontend/`) provides a responsive user interface for customers and administrators.

Users can register, log in, view vehicles, and purchase vehicles. Admin users can additionally create, update, delete, and restock vehicles.

## Architecture

The app follows a standard MERN stack architecture:
- **MongoDB** for data storage.
- **Express** for server-side HTTP API routing.
- **React** for the client-side UI.
- **Redux Toolkit** for front-end state management.
- **Tailwind CSS** for styling.

## Folder Structure

### Root
- `backend/` - server application and API implementation.
- `frontend/` - React application and UI logic.

### Backend structure
- `backend/app.js` - main Express application setup, middleware, and route registration.
- `backend/server.js` - starts the backend server in development mode.
- `backend/database-connection.js` - MongoDB connection helper.
- `backend/Controller/` - controller functions for authentication, admin vehicle management, and user vehicle purchase logic.
- `backend/Routes/` - route definitions by feature area:
  - `auth/` - authentication endpoints.
  - `Admin/` - admin vehicle management endpoints.
  - `User/` - user purchase and inventory endpoints.
- `backend/Model/` - Mongoose models:
  - `User.js` - user schema with username, email, password, and role.
  - `Vehicles.js` - vehicle schema with image URL, make, model, category, price, and quantity.
- `backend/helpers/cloudinary.js` - Cloudinary configuration and upload helper.
- `backend/package.json` - backend dependencies and npm scripts.

### Frontend structure
- `frontend/src/main.jsx` - React application entry point.
- `frontend/src/App.jsx` - root app shell, auth status handling, and route layout.
- `frontend/src/routes.jsx` - React Router route definitions.
- `frontend/src/pages/` - page-level UI components:
  - `HomePage.jsx` - inventory browsing, search, and purchase interface.
  - `AdminPage.jsx` - vehicle management dashboard for admin users.
- `frontend/src/components/` - reusable UI pieces:
  - `VehicleCard.jsx` - vehicle card component for listings and admin actions.
  - `AdminVehicleForm.jsx` - add/edit vehicle form for admin users.
- `frontend/src/store/` - Redux Toolkit slices:
  - `authSlice.js` - authentication actions and user session handling.
  - `vehicleSlice.js` - vehicle list, purchase, admin create/update/delete/restock actions.
- `frontend/package.json` - frontend dependencies and npm scripts.

## Key Features

### Authentication & Authorization
- Register new users.
- Login with email and password.
- Save session via secure cookie-based JWT.
- `authmiddleware` protects backend routes.
- `adminOnly` middleware restricts admin vehicle management endpoints.
- Frontend uses `localStorage` to persist the current user session.

### Vehicle Inventory
- Public vehicle list and inventory data.
- Search and category filter in the home page.
- Purchase functionality decreases quantity by 1.
- Admin-only management available on `/admin`.

### Admin capabilities
- Add new vehicles with image URL, make, model, category, price, and quantity.
- Edit existing vehicle fields.
- Delete vehicles from inventory.
- Restock vehicles using a configurable amount.

### Cloudinary integration
- `backend/helpers/cloudinary.js` includes image upload utility.
- `backend/Routes/Admin/vehiclesRoute.js` has an `upload-image` endpoint for authenticated admin uploads.

## API Endpoints

### Authentication
- `POST /api/auth/register` - create a new user.
- `POST /api/auth/login` - log in and receive a JWT cookie.
- `POST /api/auth/logout` - clear authentication cookie.
- `GET /api/auth/authcheck` - verify current token and return user data.

### Admin vehicle management
- `GET /api/admin/vehicles/getList` - fetch all vehicles.
- `POST /api/admin/vehicles/add` - add a new vehicle. Requires admin auth.
- `PUT /api/admin/vehicles/update/:id` - update a vehicle. Requires admin auth.
- `DELETE /api/admin/vehicles/delete/:id` - delete a vehicle. Requires admin auth.
- `POST /api/admin/vehicles/restock/:id` - increase vehicle quantity. Requires admin auth.
- `POST /api/admin/vehicles/upload-image` - upload image via Cloudinary. Requires admin auth.

### User vehicle actions
- `GET /api/user/vehicles/getList` - fetch all vehicles for users.
- `POST /api/user/vehicles/:id/purchase` - purchase a vehicle and decrease its stock.

## Environment Variables

Backend `.env` should include:
- `MONGODB_URL` - MongoDB connection string.
- `CLIENT_ORIGIN` - frontend origin for CORS (example: `http://localhost:5173`).
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name.
- `CLOUDINARY_API_KEY` - Cloudinary API key.
- `CLOUDINARY_API_SECRET` - Cloudinary API secret.

Frontend `.env` should include:
- `VITE_API_BASE_URL` - base URL for the backend API, e.g. `http://localhost:3000`.

## Setup Instructions

### Backend
1. Open a terminal in `backend/`.
2. Run `npm install`.
3. Create a `.env` file with the values listed above.
4. Start the backend server in development:
   - `npm run dev`

### Frontend
1. Open a terminal in `frontend/`.
2. Run `npm install`.
3. Create a `.env` file with `VITE_API_BASE_URL=http://localhost:3000`.
4. Start the frontend:
   - `npm run dev`

> The backend currently starts only when `NODE_ENV !== 'production'`.

## Testing

Backend tests are configured with Jest and Supertest.
- Run `npm test` from the `backend/` folder.

## Notes and Suggestions

- The backend currently uses a hard-coded JWT secret string in `backend/Controller/auth-controller.js`.
  It is recommended to replace this with an environment variable for production security.
- The `AdminPage` route in the frontend is protected by role checks via Redux state and route guards.
- The Cloudinary upload route is available, but the admin form currently accepts an image URL directly.

## Summary

This repository contains a complete car inventory showroom application with user authentication, vehicle browsing, and admin inventory management. The project is split into a dedicated Node/Express/MongoDB backend and a React/Vite frontend, making it easy to extend with new features such as file upload, payment flows, or product categories.
