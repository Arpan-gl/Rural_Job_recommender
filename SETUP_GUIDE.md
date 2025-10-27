# Integration Setup Guide

## Overview
This project now connects the frontend, Node.js backend, and FastAPI backend for a complete job recommendation system with speech-to-text functionality.

## What Was Implemented

### 1. Frontend Changes
- **Skills.tsx**: Added speech-to-text functionality using Web Speech API
- Removed resume upload box
- Integrated with backend API for skill analysis
- Added clear button for text input
- Direct navigation to jobs page after analysis

### 2. Backend Changes (Node.js)
- **Added axios** for HTTP requests to FastAPI
- **Created recommender routes**: `/api/recommender/analyze` and `/api/recommender/matches`
- **Created analyzeQuery.js**: Connects to AI FastAPI, stores results in database
- **Created getUserSkills.js**: Fetches user skills for profile
- **Updated Prisma schema**: Added unique constraint on Match model (userId, jobId)

### 3. AI Backend Changes (FastAPI)
- **Created ai_recommender.py**: Pure AI-powered job recommendation engine
- **Removed dependency on external scraping APIs** - No more api_client.py scraping
- **Single unified endpoint**: `/recommend` returns skills, jobs, match scores in one call
- **LLM-powered**: Uses Groq to extract skills, generate realistic jobs, calculate matches
- **Production-ready**: Simple, maintainable, no external API dependencies

### 3. Database Schema Update
You need to run a migration to add the unique constraint:
```bash
cd backend
npx prisma migrate dev --name add_unique_match_constraint
```

### 4. Environment Variables
Create a `.env` file in the `backend` directory with:
```
DATABASE_URL="your_postgresql_connection_string"
PORT=3000
FASTAPI_URL=http://localhost:8080/recommend
```

Create a `.env` file in the `ai-model` directory with:
```
GROQ_API_KEY="your_groq_api_key"
```

## Running the Application

### 1. Start PostgreSQL Database
Make sure PostgreSQL is running and create a database if needed.

### 2. Run Database Migration
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### 3. Start Node.js Backend
```bash
cd backend
npm install
npm run dev
```
Backend will run on http://localhost:3000

### 4. Start FastAPI Backend
```bash
cd ai-model
pip install -r requirements.txt
python main.py
```
FastAPI will run on http://localhost:8080

### 5. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on http://localhost:5173

## How It Works

### User Flow
1. User goes to Skills page
2. User types or speaks (voice input) their skills/experience
3. On submit, frontend sends text to Node.js backend (`/api/recommender/analyze`)
4. Node.js backend forwards to FastAPI (`/recommend`)
5. FastAPI uses LLM to extract skills and search for jobs
6. FastAPI returns structured data
7. Node.js backend stores jobs and matches in database
8. Node.js backend updates user's skills in database
9. User is redirected to Jobs page
10. Dashboard shows best matches
11. Profile page shows user skills

### API Endpoints

#### Frontend → Backend
- `POST /api/recommender/analyze` - Analyze user skills and get job recommendations
- `GET /api/recommender/matches` - Get user's job matches
- `GET /api/user/skills` - Get user's skills

#### Backend → AI FastAPI
- `POST http://localhost:8080/recommend` - Get job recommendations from AI
  - Receives: `{"query": "user text"}`
  - Returns: `{skills, job_titles, locations, best_matches, other_jobs, match_scores}`

## Database Models

### User
- `skills`: string[] - User's skills
- `preferred_roles`: string[] - Preferred job roles
- `experience_years`: number - Years of experience
- `location`: string - User location

### Job
- `title`: string - Job title
- `company`: string - Company name
- `location`: string - Job location
- `description`: string - Job description
- `source`: string - Job source (e.g., Naukri, Indeed)
- `url`: string - Job URL

### Match
- `userId`: string - User ID
- `jobId`: string - Job ID
- `match_score`: number - Match percentage (0-100)
- `skills_matched`: string[] - Matched skills
- `skills_missing`: string[] - Missing skills

## Testing the Integration

1. **Sign Up/Login**: Register a new user or login
2. **Go to Skills Page**: Click on "Skills" in navigation
3. **Enter Skills**: Type or use voice input (microphone icon)
4. **Submit**: Click "Analyze & Find Jobs"
5. **View Results**: You'll be redirected to Jobs page
6. **Check Dashboard**: See your best matches
7. **Check Profile**: See your stored skills

## Troubleshooting

### FastAPI Connection Error
- Make sure AI FastAPI is running on http://localhost:8080
- Check `FASTAPI_URL` in backend `.env` file (should be `http://localhost:8080/recommend`)
- Verify `GROQ_API_KEY` is set in `ai-model/.env` file
- Test AI backend: `curl http://localhost:8080/health`

### Database Errors
- Run `npx prisma migrate dev` to apply schema changes
- Make sure PostgreSQL is running
- Check `DATABASE_URL` in backend `.env` file

### Speech Recognition Not Working
- Use Chrome or Edge browser (Web Speech API support)
- Check browser permissions for microphone access
- HTTPS may be required for production

### No Jobs Found
- Check FastAPI is receiving requests (check console logs)
- Verify GROQ_API_KEY is set correctly
- Check network connectivity

## Production Deployment

1. Update environment variables for production
2. Set up secure CORS configuration
3. Use HTTPS for speech recognition
4. Configure proper database connection pooling
5. Set up proper error handling and logging
6. Consider rate limiting for API calls

## Security Notes

- All backend routes require authentication (verifyUser middleware)
- CORS is configured for specific origins
- User data is stored securely in PostgreSQL
- API keys should be kept in environment variables
- Never commit `.env` files to version control

