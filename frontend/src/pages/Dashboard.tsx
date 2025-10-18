import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Target, Award, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const skillGaps = [
    { skill: "Digital Marketing", current: 40, required: 80, gap: 40 },
    { skill: "Advanced Excel", current: 60, required: 90, gap: 30 },
    { skill: "Data Analysis", current: 30, required: 75, gap: 45 },
    { skill: "Project Management", current: 50, required: 85, gap: 35 },
  ];

  const inDemandSkills = [
    { name: "Digital Marketing", jobs: 245 },
    { name: "Data Analysis", jobs: 189 },
    { name: "Cloud Computing", jobs: 156 },
    { name: "Mobile Development", jobs: 134 },
    { name: "UI/UX Design", jobs: 112 },
  ];

  const learningPath = [
    { week: 1, topic: "Digital Marketing Basics", status: "completed" },
    { week: 2, topic: "Social Media Strategy", status: "completed" },
    { week: 3, topic: "SEO Fundamentals", status: "in-progress" },
    { week: 4, topic: "Content Marketing", status: "upcoming" },
    { week: 5, topic: "Analytics & Reporting", status: "upcoming" },
  ];

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
                    <p className="text-sm text-muted-foreground mb-1">Skills Acquired</p>
                    <p className="text-3xl font-bold">12</p>
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
                    <p className="text-sm text-muted-foreground mb-1">Jobs Applied</p>
                    <p className="text-3xl font-bold">8</p>
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
                    <p className="text-sm text-muted-foreground mb-1">Learning Progress</p>
                    <p className="text-3xl font-bold">65%</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Skill Gaps */}
            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle>Skill Gap Analysis</CardTitle>
                <CardDescription>
                  Current skills vs. job requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {skillGaps.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.skill}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.current}% / {item.required}%
                      </span>
                    </div>
                    <div className="relative">
                      <Progress value={item.required} className="h-3 bg-muted" />
                      <Progress
                        value={item.current}
                        className="h-3 absolute top-0 left-0 bg-gradient-hero"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Gap: {item.gap}% to reach target
                    </p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* In-Demand Skills Chart */}
            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle>Top In-Demand Skills</CardTitle>
                <CardDescription>
                  Most requested skills in your area
                </CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>

          {/* Learning Path */}
          <Card className="shadow-card border-border">
            <CardHeader>
              <CardTitle>Recommended Learning Path</CardTitle>
              <CardDescription>
                5-week journey to bridge your skill gaps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {learningPath.map((week, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-hero flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-foreground font-bold">
                        W{week.week}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{week.topic}</h4>
                      <Badge
                        variant={
                          week.status === "completed"
                            ? "default"
                            : week.status === "in-progress"
                            ? "secondary"
                            : "outline"
                        }
                        className={
                          week.status === "completed"
                            ? "bg-success"
                            : week.status === "in-progress"
                            ? "bg-primary"
                            : ""
                        }
                      >
                        {week.status === "completed"
                          ? "Completed"
                          : week.status === "in-progress"
                          ? "In Progress"
                          : "Upcoming"}
                      </Badge>
                    </div>
                    {week.status === "in-progress" && (
                      <Button variant="outline" size="sm">
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-lg bg-accent/50 border border-accent-foreground/20">
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Ready to Start Learning?</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Complete this learning path to increase your job matches by 40%
                    </p>
                    <Button className="bg-gradient-hero shadow-soft">
                      Start Course
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
