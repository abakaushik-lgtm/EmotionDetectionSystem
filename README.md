# Bouquet Scanning System

A full-stack application that allows users to scan and analyze bouquets, identify specific flowers, and understand their meaning (floriography). The system also includes an e-commerce aspect with Stripe integration.

## Features

- **Bouquet Scanning:** Upload or capture images of bouquets to identify the flowers present.
- **Floriography Analysis:** Uses Gemini AI to analyze the meaning and symbolism of the identified flowers.
- **E-commerce:** Integrated with Stripe for checkout and purchasing features.
- **Full-Stack Architecture:** A robust React frontend backed by a Node.js Express API and MongoDB database.

## Project Structure

The project is divided into two main parts:

- `/frontend`: A Vite + React frontend styled with Tailwind CSS.
- `/backend`: A Node.js Express API backed by MongoDB.

## Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- React Router DOM
- Stripe.js
- Lucide React (Icons)
- Axios

**Backend:**
- Node.js & Express
- MongoDB (Mongoose)
- Google Gemini API (for AI analysis)
- Stripe (for payments)
- Google Vision (for image scanning)

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- A MongoDB database (e.g., MongoDB Atlas).
- API Keys for:
  - Gemini API
  - Stripe (Secret Key)
  - Google Cloud Vision (Application Credentials)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and fill in your credentials:
   ```env
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:5173
   GEMINI_API_KEY=your_gemini_api_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   GOOGLE_APPLICATION_CREDENTIALS=optional_path_to_gcp_json
   ```
4. Seed the initial database (flowers catalog):
   ```bash
   node setup_db.js
   ```
5. Start the backend server:
   ```bash
   npm start
   ```
   *The backend typically runs on http://localhost:5000 (or as configured).*

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the frontend directory if needed (e.g., pointing to your local backend):
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The frontend typically runs on http://localhost:5173.*

## Deployment

For detailed instructions on deploying the frontend to Vercel and the backend to Render, please see [DEPLOYMENT.md](./DEPLOYMENT.md).
