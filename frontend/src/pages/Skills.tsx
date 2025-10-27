import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Loader2, X, Sparkles, Trash2, CheckCircle2, AlertCircle, ExternalLink, TrendingUp, MapPin, Briefcase } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import { motion } from "framer-motion";
import axios from "../../axios";

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

interface AnalysisResult {
  skills: string[];
  job_titles: string[];
  locations: string[];
  experience_level: string;
  jobs: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    url: string;
    source: string;
    match_score: number;
    skills_matched: string[];
    skills_missing: string[];
  }>;
  total_found: number;
}

const Skills = () => {
  const [skillText, setSkillText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { profile, setSkills, removeSkill } = useUserStore();
  const navigate = useNavigate();

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const webkitRecognition = (window as unknown as { webkitSpeechRecognition: { new (): SpeechRecognition } }).webkitSpeechRecognition;
      recognitionRef.current = new webkitRecognition();
    } else if (typeof window !== 'undefined' && 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as unknown as { SpeechRecognition: { new (): SpeechRecognition } }).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
    }

    if (recognitionRef.current) {
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US,hi-IN'; // English and Hindi

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setSkillText((prev) => {
          const newText = prev + finalTranscript;
          return newText;
        });
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        toast.error('Speech recognition error');
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        if (isRecording) {
          recognitionRef.current?.start();
        }
      };
    }

    return () => {
      if (recognitionRef.current && isRecording) {
        recognitionRef.current.stop();
      }
    };
  }, [isRecording]);

  // Handle voice input toggle
  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition not supported in your browser");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      toast.info("Voice input stopped");
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        toast.info("Voice input started");
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        toast.error("Could not start voice input");
      }
    }
  };

  // Analyze skills by calling backend
  const analyzeSkills = async () => {
    if (!skillText.trim()) {
      toast.error("Please describe your skills first");
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await axios.post('/recommender/analyze', {
        query: skillText
      });

      if (response.data.success) {
        const { skills, jobs, job_titles, locations, experience_level, total_found } = response.data.data;
        setSkills(skills);
        setAnalysisResult({
          skills,
          jobs,
          job_titles,
          locations,
          experience_level,
          total_found
        });
        setIsAnalyzing(false);
        setShowResults(true);
        toast.success("Analysis complete!");
      } else {
        throw new Error(response.data.message || "Failed to analyze skills");
      }
    } catch (error: unknown) {
      console.error("Error analyzing skills:", error);
      const errorMessage = error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && typeof error.response.data === 'object' && error.response.data && 'message' in error.response.data
        ? error.response.data.message as string
        : "Failed to analyze skills";
      toast.error(errorMessage);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-muted/30">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Step 1: Share Your Skills</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">Tell Us About Your Skills</h1>
            <p className="text-muted-foreground">
              Describe your work experience, skills, or upload your resume
            </p>
          </div>

          <Card className="shadow-card border-border mb-6">
            <CardHeader>
              <CardTitle>Input Your Skills</CardTitle>
              <CardDescription>
                Choose any method: type, speak, or upload a file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Textarea
                  placeholder="Example: I have 3 years of experience in mobile phone repair, basic computer knowledge, and good communication skills..."
                  value={skillText}
                  onChange={(e) => setSkillText(e.target.value)}
                  rows={6}
                  className="resize-none pr-20"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSkillText("")}
                  className="absolute top-2 right-2"
                  disabled={!skillText}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className={isRecording ? "bg-destructive/10 border-destructive" : ""}
                  onClick={handleVoiceInput}
                  disabled={isAnalyzing}
                >
                  <Mic className={`mr-2 h-4 w-4 ${isRecording ? "animate-pulse" : ""}`} />
                  {isRecording ? "Stop Recording" : "Voice Input"}
                </Button>

                <Button
                  onClick={analyzeSkills}
                  disabled={isAnalyzing || !skillText.trim() || isRecording}
                  className="bg-gradient-hero shadow-soft ml-auto"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Analyze & Find Jobs
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {showResults && analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Skills Summary */}
              <Card className="shadow-card border-border mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Skills Analysis Complete
                  </CardTitle>
                  <CardDescription>
                    Your skills and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Your Skills */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Your Skills ({analysisResult.skills.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.skills.map((skill, index) => (
                        <Badge key={index} variant="default" className="px-3 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Job Titles */}
                  {analysisResult.job_titles.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-primary" />
                        Recommended Roles ({analysisResult.job_titles.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.job_titles.map((title, index) => (
                          <Badge key={index} variant="secondary" className="px-3 py-1">
                            {title}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience Level */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Experience Level</h3>
                    <Badge className="px-3 py-1 text-base">
                      {analysisResult.experience_level}
                    </Badge>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-primary/5">
                      <p className="text-sm text-muted-foreground">Jobs Found</p>
                      <p className="text-2xl font-bold">{analysisResult.total_found}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-accent/5">
                      <p className="text-sm text-muted-foreground">Matches</p>
                      <p className="text-2xl font-bold">{analysisResult.jobs.length}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => navigate("/dashboard")}
                      className="flex-1 bg-gradient-hero shadow-soft"
                    >
                      View Dashboard
                    </Button>
                    <Button
                      onClick={() => navigate("/jobs")}
                      variant="outline"
                      className="flex-1"
                    >
                      Browse Jobs
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Top Job Matches */}
              {analysisResult.jobs.length > 0 && (
                <Card className="shadow-card border-border mb-6">
                  <CardHeader>
                    <CardTitle>Top Job Matches</CardTitle>
                    <CardDescription>
                      Best jobs matched to your skills
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysisResult.jobs.slice(0, 3).map((job, index) => (
                      <motion.div
                        key={job.id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{job.title}</h4>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              {job.company}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {job.location}
                            </p>
                          </div>
                          <Badge className="bg-gradient-hero text-primary-foreground">
                            {Math.round(job.match_score)}% Match
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {job.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {job.skills_matched.slice(0, 3).map((skill, i) => (
                            <Badge key={i} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {skill}
                            </Badge>
                          ))}
                          {job.skills_missing.slice(0, 2).map((skill, i) => (
                            <Badge key={i} variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {skill}
                            </Badge>
                          ))}
                          {job.skills_missing.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{job.skills_missing.length - 2} more
                            </Badge>
                          )}
                        </div>

                        {job.url && (
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                          >
                            View Job <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {profile.skills.length > 0 && !showResults && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-card border-border">
                <CardHeader>
                  <CardTitle>Extracted Skills</CardTitle>
                  <CardDescription>
                    Review and remove any incorrect skills
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1.5 text-sm"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Skills;
