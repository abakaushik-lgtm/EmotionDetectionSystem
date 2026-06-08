# Deploying Bouquet Scanning System

This project is split into:

- `frontend`: Vite React app, deploy to Vercel.
- `backend`: Express API, deploy to Render.

## 1. Push The Repo To GitHub

Commit and push the project to GitHub. Vercel and Render can both deploy directly from the same repo.

## 2. Deploy Backend On Render

Use the existing `render.yaml` from the repo root, or create a Web Service manually with these settings:

- Root directory: `backend`
- Environment: `Node`
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/health`

Add these Render environment variables:

- `NODE_ENV`: `production`
- `MONGODB_URI`: your MongoDB Atlas connection string
- `JWT_SECRET`: a long random secret
- `FRONTEND_URL`: your Vercel frontend URL, for example `https://your-app.vercel.app`
- `GEMINI_API_KEY`: optional, only needed for live Gemini features
- `STRIPE_SECRET_KEY`: optional, only needed for live Stripe checkout
- `GOOGLE_APPLICATION_CREDENTIALS`: optional, only if you configure Google Vision credentials on Render

After deploy, copy your Render service URL, for example:

```txt
https://bouquet-scanner-backend.onrender.com
```

You can test it by opening:

```txt
https://bouquet-scanner-backend.onrender.com/health
```

## 3. Deploy Frontend On Vercel

Import the same GitHub repo into Vercel and configure:

- Framework preset: `Vite`
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

Add this Vercel environment variable:

- `VITE_API_URL`: your Render backend URL, for example `https://bouquet-scanner-backend.onrender.com`

Deploy the frontend, then copy the Vercel URL.

## 4. Connect CORS

Go back to Render and update:

```txt
FRONTEND_URL=https://your-vercel-app.vercel.app
```

If you want to allow multiple frontend URLs, separate them with commas:

```txt
FRONTEND_URL=https://your-vercel-app.vercel.app,http://localhost:5173
```

Redeploy the Render backend after changing environment variables.

## 5. Seed Initial Flowers

After the backend is live and connected to MongoDB, open this once:

```txt
https://your-render-backend.onrender.com/setup-flowers
```

That seeds the default flower catalog.
