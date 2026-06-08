#  EmotionSense AI

### Advanced Multimodal Emotion Detection Platform.

> AI-powered platform for real-time emotion detection through facial expressions, voice analysis, and text sentiment using cutting-edge deep learning models.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178c6?logo=typescript)
![Python](https://img.shields.io/badge/Python-3.11-3776ab?logo=python)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47a248?logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?logo=docker)
![License](https://img.shields.io/badge/License-MIT-green)

---

##  Features

###  Multimodal Emotion Detection
- **Face Detection** — Real-time webcam analysis with CNN-powered facial expression recognition
- **Audio Analysis** — Voice tone and emotion detection using MFCC feature extraction
- **Text Analysis** — NLP-powered emotion detection using HuggingFace transformers
- **AI Fusion** — Weighted ensemble combining all modalities for superior accuracy

###  Analytics & Insights
- Emotion history tracking and mood trends
- Interactive charts, heatmaps, and weekly reports
- AI-generated mental wellness insights
- Personalized recommendations

###  Admin Panel
- User management dashboard
- System-wide detection statistics
- Role-based access control

###  Premium UI/UX
- Cyberpunk-inspired glassmorphism design
- Dark/light mode support
- Framer Motion animations
- Fully responsive (mobile-first)

---

##  Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion, Recharts |
| **Backend** | FastAPI, Python 3.11, Uvicorn, WebSocket |
| **AI/ML** | DeepFace, FER, HuggingFace Transformers, Librosa, OpenCV, Scikit-learn |
| **Database** | MongoDB (Motor async driver) |
| **Auth** | JWT (python-jose + bcrypt) |
| **DevOps** | Docker, Docker Compose |
| **Deployment** | Vercel (frontend), Railway/Render (backend) |

---

##  Project Structure

```
EmotionSenseAI/
├── frontend/                    # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── layout.tsx            # Root layout
│   │   │   ├── globals.css           # Global styles & design system
│   │   │   ├── auth/
│   │   │   │   ├── login/page.tsx    # Login page
│   │   │   │   ├── signup/page.tsx   # Signup page
│   │   │   │   └── forgot-password/page.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── layout.tsx        # Dashboard layout
│   │   │   │   ├── page.tsx          # Main dashboard
│   │   │   │   ├── face/page.tsx     # Face detection
│   │   │   │   ├── audio/page.tsx    # Audio analysis
│   │   │   │   ├── text/page.tsx     # Text analysis
│   │   │   │   ├── fusion/page.tsx   # AI fusion
│   │   │   │   ├── analytics/page.tsx # Analytics
│   │   │   │   ├── insights/page.tsx # AI insights
│   │   │   │   └── settings/page.tsx # Settings
│   │   │   └── admin/
│   │   │       ├── layout.tsx        # Admin layout
│   │   │       └── page.tsx          # Admin panel
│   │   ├── components/
│   │   │   └── layout/
│   │   │       ├── Sidebar.tsx       # Navigation sidebar
│   │   │       ├── Header.tsx        # Top header bar
│   │   │       └── ThemeProvider.tsx  # Dark/light mode
│   │   └── lib/
│   │       ├── api.ts               # Axios API client
│   │       ├── auth-context.tsx     # Auth context provider
│   │       └── utils.ts             # Utilities & constants
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── Dockerfile
│
├── backend/                     # FastAPI Backend
│   ├── main.py                  # Application entry point
│   ├── config.py                # Configuration settings
│   ├── database.py              # MongoDB connection
│   ├── requirements.txt         # Python dependencies
│   ├── Dockerfile
│   ├── routes/
│   │   ├── auth.py              # Authentication endpoints
│   │   ├── face.py              # Face detection endpoint
│   │   ├── audio.py             # Audio detection endpoint
│   │   ├── text.py              # Text detection endpoint
│   │   ├── fusion.py            # Fusion endpoint
│   │   ├── analytics.py         # Analytics endpoints
│   │   └── admin.py             # Admin endpoints
│   ├── services/
│   │   ├── face_service.py      # DeepFace/FER integration
│   │   ├── audio_service.py     # Librosa audio analysis
│   │   ├── text_service.py      # HuggingFace NLP
│   │   └── fusion_service.py    # Weighted ensemble fusion
│   ├── middleware/
│   │   └── auth_middleware.py   # JWT auth middleware
│   ├── websocket/
│   │   └── manager.py          # WebSocket connection manager
│   └── tests/
│       └── test_api.py          # API tests
│
├── docker-compose.yml           # Full stack orchestration
├── .env.example                 # Environment template
├── .gitignore
└── README.md
```

---

##  Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- MongoDB (local or Atlas)
- Docker (optional)

### Option 1: Docker (Recommended)

```bash
# Clone the project
git clone <repo-url>
cd EmotionSenseAI

# Copy environment file
cp .env.example .env

# Start all services
docker-compose up --build
```

Frontend: http://localhost:3000
Backend API: http://localhost:8000
API Docs: http://localhost:8000/docs

### Option 2: Manual Setup

#### Backend
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows

# Install dependencies
pip install -r requirements.txt

# Start server
uvicorn main:app --reload --port 8000
```

#### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

---

##  API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/signup` | Register new user |
| POST | `/api/v1/auth/login` | Login and get JWT token |
| POST | `/api/v1/auth/forgot-password` | Request password reset |
| GET | `/api/v1/auth/profile` | Get user profile |
| PUT | `/api/v1/auth/profile` | Update profile |

### Emotion Detection
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/detect/face` | Analyze face image |
| POST | `/api/v1/detect/audio` | Analyze audio file |
| POST | `/api/v1/detect/text` | Analyze text |
| POST | `/api/v1/detect/fusion` | Multimodal fusion |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/analytics/history` | Detection history |
| GET | `/api/v1/analytics/trends/{period}` | Mood trends |
| GET | `/api/v1/analytics/distribution` | Emotion distribution |
| GET | `/api/v1/analytics/weekly-report` | Weekly report |
| GET | `/api/v1/analytics/insights` | AI insights |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/users` | List all users |
| GET | `/api/v1/admin/stats` | System statistics |
| DELETE | `/api/v1/admin/users/{id}` | Delete user |
| PUT | `/api/v1/admin/users/{id}/role` | Update user role |

---

##  Detected Emotions

| Emotion | Color | Icon |
|---------|-------|------|
| Happy |  #facc15 |  |
| Sad |  #3b82f6 |  |
| Angry |  #ef4444 |  |
| Fear |  #a855f7 |  |
| Surprise |  #f97316 |  |
| Neutral |  #6b7280 |  |
| Disgust |  #22c55e |  |
| Anxiety |  #8b5cf6 |  |
| Stress |  #f43f5e |  |
| Excited |  #06b6d4 |  |

---

##  AI Models

### Face Emotion Detection
- **Primary**: DeepFace with OpenCV backend
- **Fallback**: FER (Facial Expression Recognition)
- **Input**: Webcam capture / uploaded images
- **Output**: Emotion label + confidence scores + face bounding box

### Audio Emotion Analysis
- **Features**: MFCC, Pitch, Energy, Spectral Centroid, Zero Crossing Rate
- **Library**: Librosa for audio processing
- **Input**: WAV, MP3, FLAC, OGG audio files

### Text Emotion Analysis
- **Model**: `j-hartmann/emotion-english-distilroberta-base` (HuggingFace)
- **Fallback**: Keyword-based emotion classification
- **Output**: Emotion + sentiment (positive/negative/neutral) + score

### Multimodal Fusion
- **Method**: Weighted ensemble prediction
- **Weights**: Face (45%), Text (30%), Audio (25%)
- **Combines confidence-weighted scores from all active modalities**

---

##  Security

- JWT-based authentication with bcrypt password hashing
- Role-based access control (user/admin)
- CORS middleware configuration
- Input validation with Pydantic models
- Secure password reset flow

---

##  Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Deploy via Vercel CLI or GitHub integration
```

### Backend -> Render

This repo includes a `render.yaml` Blueprint for deploying the FastAPI backend on Render:

- `emotionsense-backend`: FastAPI Docker web service

Create a MongoDB Atlas database first, then create a Render Blueprint from this GitHub repo and set:

```bash
MONGODB_URL=<your MongoDB Atlas connection string>
```

Render generates `JWT_SECRET_KEY` automatically. If you deploy the frontend separately, set `NEXT_PUBLIC_API_URL` to the backend's Render URL.

### Backend → Railway/Render
```bash
# Use the Dockerfile or connect your repo
# Set environment variables in the dashboard
```

### Database → MongoDB Atlas
- Create a free cluster at mongodb.com
- Update MONGODB_URL in your .env

---

##  License

This project is licensed under the MIT License.

---

##  Acknowledgments

- [DeepFace](https://github.com/serengil/deepface) — Face analysis framework
- [HuggingFace Transformers](https://huggingface.co/) — NLP models
- [Librosa](https://librosa.org/) — Audio analysis
- [FER2013](https://www.kaggle.com/datasets/msambare/fer2013) — Face emotion dataset
- [RAVDESS](https://zenodo.org/record/1188976) — Audio emotion dataset

---

Built with  by EmotionSense AI Team
