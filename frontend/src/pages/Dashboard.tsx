import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Target, Award, ArrowRight, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Match {
  id: string;
  title: string;
  company: string;
  location: string;
  description?: string;
  url?: string;
  match_score: number;
  skills_matched: string[];
  skills_missing: string[];
  source?: string;
  createdAt: Date;
}

const Dashboard = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await axios.get('/recommender/matches');
      if (response.data.success) {
        setMatches(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
      toast.error("Failed to load job matches");
    } finally {
      setLoading(false);
    }
  };
  // Calculate skill gaps from matches
  const skillGaps = matches
    .flatMap(match => match.skills_missing || [])
    .reduce((acc: any, skill: string) => {
      if (!acc.find((s: any) => s.skill === skill)) {
        acc.push({ skill, current: 0, required: 80, gap: 80 });
      }
      return acc;
    }, [])
    .slice(0, 4);

  // Calculate in-demand skills from matches
  const inDemandSkills = matches
    .reduce((acc: any, match) => {
      match.skills_matched?.forEach((skill: string) => {
        const existing = acc.find((s: any) => s.name === skill);
        if (existing) {
          existing.jobs += 1;
        } else {
          acc.push({ name: skill, jobs: 1 });
        }
      });
      return acc;
    }, [])
    .sort((a: any, b: any) => b.jobs - a.jobs)
    .slice(0, 5);

  const totalMatches = matches.length;
  const avgMatchScore = matches.length > 0 
    ? Math.round(matches.reduce((sum, m) => sum + m.match_score, 0) / matches.length)
    : 0;

  return (
    <div className="min-h-screen py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Skill Gap Dashboard</h1>
            <p className="text-muted-foreground">
              Track your progress and plan your learning journey
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="shadow-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Job Matches</p>
                    <p className="text-3xl font-bold">{totalMatches}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-gradient-hero flex items-center justify-center">
                    <Award className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Avg Match Score</p>
                    <p className="text-3xl font-bold">{avgMatchScore}%</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-gradient-accent flex items-center justify-center">
                    <Target className="h-6 w-6 text-success-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Skills to Learn</p>
                    <p className="text-3xl font-bold">{skillGaps.length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Best Matches */}
            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle>Best Job Matches</CardTitle>
                <CardDescription>
                  Top opportunities matched to your skills
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <p className="text-muted-foreground">Loading matches...</p>
                ) : matches.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No job matches yet</p>
                    <Button onClick={() => navigate('/skills')}>
                      Find Jobs
                    </Button>
                  </div>
                ) : (
                  matches.slice(0, 5).map((match, index) => (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg border hover:bg-muted/50 transition-colors space-y-3"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium">{match.title}</h4>
                          <p className="text-sm text-muted-foreground">{match.company} • {match.location}</p>
                        </div>
                        <Badge>{Math.round(match.match_score)}% Match</Badge>
                      </div>

                      {match.skills_matched && match.skills_matched.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Skills You Have:</p>
                          <div className="flex flex-wrap gap-1">
                            {match.skills_matched.slice(0, 3).map((skill, i) => (
                              <Badge key={i} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                ✓ {skill}
                              </Badge>
                            ))}
                            {match.skills_matched.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{match.skills_matched.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {match.skills_missing && match.skills_missing.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Skills You Need:</p>
                          <div className="flex flex-wrap gap-1">
                            {match.skills_missing.slice(0, 3).map((skill, i) => (
                              <Badge key={i} variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                                ! {skill}
                              </Badge>
                            ))}
                            {match.skills_missing.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{match.skills_missing.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {match.url && (
                        <a 
                          href={match.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          View Job <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* In-Demand Skills Chart */}
            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle>Top In-Demand Skills</CardTitle>
                <CardDescription>
                  Your skills in demand
                </CardDescription>
              </CardHeader>
              <CardContent>
                {inDemandSkills.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={inDemandSkills}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Bar dataKey="jobs" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No skills data available yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
