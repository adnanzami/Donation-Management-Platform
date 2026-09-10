# Givespace

A community-driven, non-monetary physical item donation platform. Givespace connects donors directly with receivers to reduce environmental waste, eliminate middlemen, and foster stronger local neighborhoods.

## Tech Stack
**Frontend:** React.js (Vite), Tailwind CSS, React Router  
**Backend:** Node.js, Express.js  
**Database:** MongoDB Atlas (Mongoose)  
**Authentication:** JSON Web Tokens (JWT), bcrypt  

## Setup Instructions

Before running the project locally, ensure you have [Node.js](https://nodejs.org/) installed and an active MongoDB Atlas cluster. 

1. **Clone the repository** to your local machine and open the project in your code editor.
2. **Install backend dependencies:** Open a terminal, navigate to the `server` directory, and run `npm install`.
3. **Install frontend dependencies:** Open a separate terminal, navigate to the `client` directory, and run `npm install`.

## Environment Variables

To connect your database and authenticate users, you must create a `.env` file inside your `server` directory. Add the following keys:

* `PORT=5000` (or your preferred local backend port)
* `MONGO_URI=your_mongodb_atlas_connection_string` (Ensure your local IP address is whitelisted in your Atlas Network Access settings)
* `JWT_SECRET=your_secure_random_string` (Used for generating authentication tokens)

## Running the Application Locally

To view and interact with the website, you must run both the backend and frontend simultaneously.

1. **Start the Backend:** In your `server` terminal, run `node server.js` (or `npm run dev` if you have nodemon installed). You should see a success message indicating the database is connected.
2. **Start the Frontend:** In your `client` terminal, run `npm run dev`.
3. **Visit the Website:** Open your web browser and navigate to `http://localhost:5173` to start using the Givespace web app.

---
*Note for Production Deployment: To deploy this application, the frontend must be compiled using `npm run build` inside the `client` directory, and the resulting `dist` folder must be served statically by the Express backend.*
