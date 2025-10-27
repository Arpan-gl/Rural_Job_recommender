# main.py
import uvicorn
import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any
from contextlib import asynccontextmanager
from ai_recommender import JobRecommendationEngine

load_dotenv()

# --- LIFESPAN CONTEXT MANAGER ---
recommendation_engine: JobRecommendationEngine = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global recommendation_engine
    print("FastAPI server starting up...")
    if not os.getenv("GROQ_API_KEY"):
        raise RuntimeError("GROQ_API_KEY not set in .env file")
    try:
        recommendation_engine = JobRecommendationEngine()
        print("AI Recommendation Engine initialized successfully.")
    except Exception as e:
        print(f"Error: {e}. AI Engine could not be initialized.")
        recommendation_engine = None
    yield
    print("FastAPI server shutting down...")

app = FastAPI(
    title="AI Job Recommendation System",
    description="AI-powered job recommendations for Indian job market using LLM",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MAIN ENDPOINT ---
@app.post("/recommend", response_model=Dict[str, Any])
async def get_recommendations(query_data: Dict[str, str] = Body(...)):
    """
    Main endpoint for job recommendations.
    
    Receives: {"query": "user input text"}
    Returns: Complete recommendation with skills, jobs, and match scores
    """
    global recommendation_engine
    
    if recommendation_engine is None:
        raise HTTPException(status_code=500, detail="AI engine not ready")
    
    user_query = query_data.get("query", "")
    if not user_query:
        raise HTTPException(status_code=400, detail="Query is required")
    
    try:
        print(f"[API] Processing query: {user_query[:100]}...")
        
        # Get AI-powered recommendations
        result = await recommendation_engine.analyze_and_recommend(user_query)
        
        print(f"[API] Found {result['total_jobs_found']} jobs with {len(result['skills'])} skills")
        
        return result
        
    except Exception as e:
        print(f"[API ERROR] {e}")
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

# --- Health Check Endpoint ---
@app.get("/health")
async def health_check():
    return {"status": "healthy", "engine": recommendation_engine is not None}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=5000, reload=True)