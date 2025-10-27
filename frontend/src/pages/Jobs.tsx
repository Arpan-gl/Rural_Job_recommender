import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { MapPin, DollarSign, Briefcase, Search, Filter, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";
import { useJobStore, type Job } from "@/store/jobStore";
import { motion } from "framer-motion";
import axios from "../../axios";
import { toast } from "sonner";

const Jobs = () => {
  const { filters, setFilters } = useJobStore();
  const [showFilters, setShowFilters] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/recommender/matches');
      if (response.data.success) {
        setJobs(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const upskillRecommendations = [
    { title: "Advanced Excel", platform: "Udemy", duration: "4 weeks" },
    { title: "Digital Marketing Basics", platform: "Coursera", duration: "6 weeks" },
    { title: "Communication Skills", platform: "PMKVY", duration: "2 weeks" }
  ];

  return (
    <div className="min-h-screen py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Job Matches</h1>
          <p className="text-muted-foreground">
            {jobs.length === 0 ? 'Loading opportunities...' : `${jobs.length} opportunities matched to your skills`}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Job Listings */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No jobs found</p>
                <Button onClick={() => navigate('/skills')}>Find Jobs</Button>
              </div>
            ) : (
              jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="shadow-card border-border hover:shadow-elevated transition-all">
                    <CardHeader>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {job.company}
                          </CardDescription>
                        </div>
                        <Badge className="bg-gradient-hero text-primary-foreground">
                          {Math.round(job.match_score)}% Match
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        {job.source && (
                          <div className="text-sm text-muted-foreground">
                            Source: {job.source}
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {job.description}
                      </p>

                      {/* Skills Matched and Missing */}
                      <div className="space-y-3">
                        {job.skills_matched && job.skills_matched.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2 flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              Skills You Have ({job.skills_matched.length})
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {job.skills_matched.map((skill: string, i: number) => (
                                <Badge key={i} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {job.skills_missing && job.skills_missing.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2 flex items-center gap-1">
                              <AlertCircle className="h-4 w-4 text-amber-600" />
                              Skills You Need ({job.skills_missing.length})
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {job.skills_missing.slice(0, 5).map((skill: string, i: number) => (
                                <Badge key={i} variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                                  {skill}
                                </Badge>
                              ))}
                              {job.skills_missing.length > 5 && (
                                <Badge variant="outline" className="text-xs">
                                  +{job.skills_missing.length - 5} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Match Score</span>
                          <span className="font-medium">{Math.round(job.match_score)}%</span>
                        </div>
                        <Progress value={job.match_score} className="h-2" />
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          className="flex-1 bg-gradient-hero shadow-soft"
                          onClick={() => window.open(job.url, '_blank')}
                        >
                          View Job
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle>Upskill Recommendations</CardTitle>
                <CardDescription>
                  Courses to boost your employability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upskillRecommendations.map((course, index) => (
                  <div key={index} className="p-4 rounded-lg bg-muted/50 space-y-2">
                    <h4 className="font-medium">{course.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {course.platform} • {course.duration}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Start Course
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
