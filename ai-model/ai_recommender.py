"""
AI-Powered Job Recommendation System
This module uses Groq LLM to extract skills, generate job recommendations,
and provide match scores without relying on external scraping APIs.
"""

import os
from typing import List, Dict, Any
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from models import JobQueryStructured
from dotenv import load_dotenv

load_dotenv()


class JobRecommendationEngine:
    """AI engine for job recommendations using LLM"""
    
    def __init__(self):
        self.llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            temperature=0.3
        )
        self.skills_extractor = self._create_skills_extractor()
        self.job_generator = self._create_job_generator()
    
    def _create_skills_extractor(self):
        """Create a chain to extract skills from user query"""
        prompt_template = """You are an expert career counselor for rural and urban job seekers in India.

Analyze the user's query and extract structured information.

Query: "{query}"

Extract:
1. Skills: List all relevant skills mentioned or inferred (max 15 skills)
2. Job Titles: Suggest 3-5 relevant job titles
3. Locations: Extract mentioned locations, or suggest top 3 locations if not mentioned
4. Experience Level: "entry-level", "mid-level", or "experienced"

Respond in JSON format with this exact structure:
{{
  "skills": ["skill1", "skill2", ...],
  "job_titles": ["title1", "title2", ...],
  "locations": ["location1", "location2", ...],
  "experience_level": "entry-level|mid-level|experienced"
}}
"""
        prompt = ChatPromptTemplate.from_template(prompt_template)
        parser = JsonOutputParser()
        return prompt | self.llm | parser
    
    def _create_job_generator(self):
        """Create a chain to generate job recommendations"""
        prompt_template = """You are a job recommendation expert for Indian job market.

Based on the extracted information:
Skills: {skills}
Job Titles: {job_titles}
Locations: {locations}
Experience: {experience}

Generate 8-12 realistic job opportunities that would be suitable for this candidate.
Consider:
- Government jobs for rural candidates
- Private sector opportunities
- Both remote and on-site positions
- Entry-level to mid-level positions

For each job provide:
- Title (realistic job title)
- Company (realistic company name)
- Location (city, state)
- Description (2-3 lines about responsibilities)
- Source (e.g., "Naukri", "Indeed", "Apna", "Government Portal")

IMPORTANT: Respond ONLY with a valid JSON array. Do not include any text before or after the array.
The JSON should look like this:

[
  {{
    "title": "Job Title",
    "company": "Company Name",
    "location": "City, State",
    "description": "Brief description of responsibilities and requirements",
    "url": "https://example.com/job",
    "source": "Naukri"
  }},
  {{
    "title": "Another Job",
    "company": "Another Company",
    "location": "City, State",
    "description": "Another description",
    "url": "https://example.com/job2",
    "source": "Indeed"
  }}
]

Make the descriptions realistic and relevant to Indian job market. Generate at least 8 jobs.
"""
        prompt = ChatPromptTemplate.from_template(prompt_template)
        parser = JsonOutputParser()
        return prompt | self.llm | parser
    
    def extract_skills_and_info(self, query: str) -> Dict[str, Any]:
        """Extract skills and job information from user query"""
        try:
            result = self.skills_extractor.invoke({"query": query})
            
            # Validate and structure the result
            skills = result.get("skills", [])
            job_titles = result.get("job_titles", [])
            locations = result.get("locations", [])
            experience_level = result.get("experience_level", "entry-level")
            
            return {
                "skills": skills,
                "job_titles": job_titles,
                "locations": locations,
                "experience_level": experience_level,
                "search_keywords": self._generate_search_keywords(skills, job_titles, locations)
            }
        except Exception as e:
            print(f"Error extracting skills: {e}")
            raise
    
    def generate_jobs(self, skills: List[str], job_titles: List[str], 
                     locations: List[str], experience_level: str) -> List[Dict[str, Any]]:
        """Generate job recommendations using LLM"""
        try:
            jobs_json = self.job_generator.invoke({
                "skills": ", ".join(skills),
                "job_titles": ", ".join(job_titles),
                "locations": ", ".join(locations),
                "experience": experience_level
            })
            
            print(f"[DEBUG] Raw jobs_json type: {type(jobs_json)}")
            print(f"[DEBUG] Raw jobs_json: {jobs_json}")
            
            # Ensure it's a list
            if isinstance(jobs_json, list):
                jobs = jobs_json
            elif isinstance(jobs_json, dict) and "jobs" in jobs_json:
                jobs = jobs_json["jobs"]
            elif isinstance(jobs_json, dict):
                # If it's a dict but not with "jobs" key, try to extract jobs from values
                jobs = list(jobs_json.values()) if jobs_json else []
            else:
                print(f"[WARNING] Unexpected jobs_json format: {type(jobs_json)}")
                jobs = []
            
            print(f"[DEBUG] Number of jobs after parsing: {len(jobs)}")
            
            # Validate and clean the jobs
            cleaned_jobs = []
            for job in jobs:
                if isinstance(job, dict) and "title" in job and "company" in job:
                    # Generate a proper URL if not present
                    if "url" not in job or not job["url"]:
                        job_title_slug = job.get("title", "").lower().replace(" ", "-").replace(",", "")
                        job["url"] = f"https://jobs.example.com/{job_title_slug}"
                    cleaned_jobs.append(job)
                else:
                    print(f"[WARNING] Invalid job entry: {job}")
            
            print(f"[DEBUG] Number of cleaned jobs: {len(cleaned_jobs)}")
            return cleaned_jobs[:12]  # Return max 12 jobs
            
        except Exception as e:
            print(f"Error generating jobs: {e}")
            import traceback
            traceback.print_exc()
            return []
    
    def calculate_match_scores(self, jobs: List[Dict], skills: List[str]) -> List[Dict]:
        """Calculate match scores for each job"""
        scored_jobs = []
        
        for job in jobs:
            title = (job.get("title", "") or "").lower()
            description = (job.get("description", "") or "").lower()
            location = (job.get("location", "") or "").lower()
            
            matched_skills = []
            missing_skills = []
            
            # Check each skill
            for skill in skills:
                skill_lower = skill.lower()
                if (skill_lower in title or 
                    skill_lower in description or 
                    skill_lower in location):
                    matched_skills.append(skill)
                else:
                    missing_skills.append(skill)
            
            # Calculate match score (0-100)
            if len(skills) > 0:
                match_score = (len(matched_skills) / len(skills)) * 100
            else:
                match_score = 50
            
            job["match_score"] = round(match_score, 2)
            job["skills_matched"] = matched_skills
            job["skills_missing"] = missing_skills
            
            scored_jobs.append(job)
        
        # Sort by match score descending
        scored_jobs.sort(key=lambda x: x.get("match_score", 0), reverse=True)
        
        return scored_jobs
    
    def _generate_search_keywords(self, skills: List[str], job_titles: List[str], 
                                  locations: List[str]) -> List[str]:
        """Generate search keywords for job portals"""
        keywords = []
        
        # Combine skills with job titles
        for skill in skills[:3]:
            for title in job_titles[:2]:
                keywords.append(f"{title} {skill}")
        
        # Add location-specific searches
        for location in locations[:2]:
            keywords.append(f"jobs in {location}")
        
        return keywords[:5] if keywords else ["jobs", "careers", "employment"]
    
    async def analyze_and_recommend(self, user_query: str) -> Dict[str, Any]:
        """Main method to analyze query and generate recommendations"""
        # Step 1: Extract skills and information
        extracted_info = self.extract_skills_and_info(user_query)
        
        skills = extracted_info["skills"]
        job_titles = extracted_info["job_titles"]
        locations = extracted_info["locations"]
        experience_level = extracted_info["experience_level"]
        search_keywords = extracted_info["search_keywords"]
        
        # Step 2: Generate job recommendations
        jobs = self.generate_jobs(skills, job_titles, locations, experience_level)
        
        # Step 3: Calculate match scores
        scored_jobs = self.calculate_match_scores(jobs, skills)
        
        # Step 4: Separate best matches from others (top 10 by score)
        best_matches = scored_jobs[:10]
        other_jobs = scored_jobs[10:20] if len(scored_jobs) > 10 else []
        
        return {
            "skills": skills,
            "job_titles": job_titles,
            "locations": locations,
            "experience_level": experience_level,
            "search_keywords": search_keywords,
            "total_jobs_found": len(jobs),
            "best_matches": best_matches,
            "other_jobs": other_jobs
        }

