import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { MapPin, DollarSign, Briefcase, Search, Filter } from "lucide-react";
import { useJobStore, type Job } from "@/store/jobStore";
import { motion } from "framer-motion";

const Jobs = () => {
  const { jobs, filters, setJobs, setFilters } = useJobStore();
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Simulate fetching jobs from API
    const mockJobs: Job[] = [
      {
        id: "1",
        title: "Mobile Repair Technician",
        company: "Tech Solutions Ltd",
        location: "Delhi NCR",
        salary: { min: 15000, max: 25000, currency: "₹" },
        matchScore: 92,
        skills: ["Mobile Repair", "Electronics", "Customer Service"],
        description: "Looking for experienced mobile repair technician",
        distance: 5
      },
      {
        id: "2",
        title: "Agricultural Field Officer",
        company: "AgriTech India",
        location: "Punjab",
        salary: { min: 20000, max: 30000, currency: "₹" },
        matchScore: 85,
        skills: ["Farming", "Field Work", "Communication"],
        description: "Field officer for agricultural operations",
        distance: 12
      },
      {
        id: "3",
        title: "Digital Marketing Assistant",
        company: "Digital Hub",
        location: "Remote",
        salary: { min: 18000, max: 28000, currency: "₹" },
        matchScore: 78,
        skills: ["Social Media", "Communication", "Computer Skills"],
        description: "Remote position for digital marketing support",
        distance: 0
      },
      {
        id: "4",
        title: "Customer Service Representative",
        company: "CallCenter Pro",
        location: "Bangalore",
        salary: { min: 16000, max: 22000, currency: "₹" },
        matchScore: 88,
        skills: ["Communication", "Computer Skills", "Problem Solving"],
        description: "Customer support role with training provided",
        distance: 8
      }
    ];
    setJobs(mockJobs);
  }, [setJobs]);

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
            {jobs.length} opportunities matched to your skills
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-card border-border mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs by keyword..."
                  value={filters.keyword}
                  onChange={(e) => setFilters({ keyword: e.target.value })}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>

            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="mt-4 pt-4 border-t border-border space-y-4"
              >
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Distance: {filters.distance}km
                  </label>
                  <Slider
                    value={[filters.distance]}
                    onValueChange={([value]) => setFilters({ distance: value })}
                    max={100}
                    step={5}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Salary Range: ₹{filters.salaryMin} - ₹{filters.salaryMax}
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.salaryMin}
                      onChange={(e) => setFilters({ salaryMin: Number(e.target.value) })}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.salaryMax}
                      onChange={(e) => setFilters({ salaryMax: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Job Listings */}
          <div className="lg:col-span-2 space-y-4">
            {jobs.map((job, index) => (
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
                        {job.matchScore}% Match
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, i) => (
                        <Badge key={i} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                        {job.distance !== undefined && (
                          <span className="text-xs">• {job.distance}km away</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>
                          {job.salary.currency}{job.salary.min.toLocaleString()} - {job.salary.currency}{job.salary.max.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Skill Match</span>
                        <span className="font-medium">{job.matchScore}%</span>
                      </div>
                      <Progress value={job.matchScore} className="h-2" />
                    </div>

                    <Button className="w-full bg-gradient-hero shadow-soft">
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
