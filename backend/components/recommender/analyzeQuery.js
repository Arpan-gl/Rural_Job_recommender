import axios from 'axios';
import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

export async function analyzeUserQuery(req, res) {
  try {
    const { query } = req.body;
    const userId = req.user.id;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: "Query is required" 
      });
    }

    // Call FastAPI backend to analyze the query
    const fastApiUrl = process.env.FASTAPI_URL || 'http://localhost:5000/recommend';
    
    let aiResponse;
    try {
      aiResponse = await axios.post(fastApiUrl, { query }, {
        timeout: 60000, // 60 seconds timeout for AI processing
      });
    } catch (error) {
      console.error("FastAPI error:", error.message);
      return res.status(500).json({
        success: false,
        message: "AI service is temporarily unavailable. Please try again later."
      });
    }

    // Extract data from AI response
    const { skills, job_titles, locations, experience_level, 
            best_matches, other_jobs, total_jobs_found } = aiResponse.data;

    // Update user's skills in database
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          skills: skills || [],
          preferred_roles: job_titles || [],
        }
      });
    } catch (dbError) {
      console.error("Error updating user skills:", dbError);
      // Continue processing even if user update fails
    }

    // Store jobs in database and create matches
    const jobMatches = [];
    const allJobsToStore = [...(best_matches || []), ...(other_jobs || [])];

    for (const jobData of allJobsToStore) {
      try {
        // Check if job already exists by URL
        let job = await prisma.job.findFirst({
          where: { url: jobData.url }
        });

        // Create job if it doesn't exist
        if (!job) {
          job = await prisma.job.create({
            data: {
              title: jobData.title,
              company: jobData.company,
              location: jobData.location,
              description: jobData.description || '',
              source: jobData.source,
              url: jobData.url,
              requirements: [], // Can be parsed from description if needed
            }
          });
        }

        // Use AI-calculated match score if available, otherwise calculate manually
        const matchScore = jobData.match_score || 50;
        const matchedSkills = jobData.skills_matched || [];
        const missingSkills = jobData.skills_missing || [];

        // Check if match already exists
        const existingMatch = await prisma.match.findFirst({
          where: {
            userId: userId,
            jobId: job.id
          }
        });

        let match;
        if (existingMatch) {
          // Update existing match
          match = await prisma.match.update({
            where: { id: existingMatch.id },
            data: {
              match_score: matchScore,
              skills_matched: matchedSkills,
              skills_missing: missingSkills,
            }
          });
        } else {
          // Create new match
          match = await prisma.match.create({
            data: {
              userId: userId,
              jobId: job.id,
              match_score: matchScore,
              skills_matched: matchedSkills,
              skills_missing: missingSkills,
            }
          });
        }

        jobMatches.push({
          ...job,
          match_score: matchScore,
          skills_matched: matchedSkills,
          skills_missing: missingSkills,
        });
      } catch (jobError) {
        console.error("Error processing job:", jobError);
        // Continue processing other jobs even if one fails
      }
    }

    // Sort matches by match_score
    jobMatches.sort((a, b) => b.match_score - a.match_score);

    // Return best matches (top 10)
    const bestMatchResults = jobMatches.slice(0, 10);

    return res.status(200).json({
      success: true,
      data: {
        skills: skills,
        job_titles: job_titles,
        locations: locations,
        experience_level: experience_level,
        jobs: bestMatchResults,
        total_found: total_jobs_found,
      },
      message: "Successfully analyzed and found job matches"
    });

  } catch (error) {
    console.error("Error in analyzeUserQuery:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

export async function getUserMatches(req, res) {
  try {
    const userId = req.user.id;

    // Get all matches for the user with job details, sorted by match score
    const matches = await prisma.match.findMany({
      where: { userId },
      include: {
        job: true
      },
      orderBy: {
        match_score: 'desc'
      },
      take: 10 // Get top 10 matches
    });

    // Format the response
    const formattedMatches = matches.map(match => ({
      id: match.job.id,
      title: match.job.title,
      company: match.job.company,
      location: match.job.location,
      description: match.job.description,
      url: match.job.url,
      match_score: match.match_score,
      skills_matched: match.skills_matched,
      skills_missing: match.skills_missing,
      source: match.job.source,
      createdAt: match.job.createdAt,
    }));

    return res.status(200).json({
      success: true,
      data: formattedMatches
    });

  } catch (error) {
    console.error("Error in getUserMatches:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

