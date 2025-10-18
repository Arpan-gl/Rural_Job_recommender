import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Upload, Loader2, X, Sparkles } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Skills = () => {
  const [skillText, setSkillText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { profile, setSkills, removeSkill } = useUserStore();
  const navigate = useNavigate();

  // Simulate AI skill extraction
  const analyzeSkills = async () => {
    if (!skillText.trim()) {
      toast.error("Please describe your skills first");
      return;
    }

    setIsAnalyzing(true);

    // Simulate API call
    setTimeout(() => {
      const extractedSkills = [
        "Communication",
        "Problem Solving",
        "Time Management",
        "Microsoft Office",
        "Customer Service"
      ];
      setSkills(extractedSkills);
      setIsAnalyzing(false);
      toast.success("Skills extracted successfully!");
    }, 2000);
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.info("Voice input started");
      // Implement Web Speech API here
    } else {
      toast.info("Voice input stopped");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.info(`Processing ${file.name}...`);
      // Simulate file processing
      setTimeout(() => {
        toast.success("Resume uploaded successfully!");
      }, 1500);
    }
  };

  const handleFindJobs = () => {
    if (profile.skills.length === 0) {
      toast.error("Please analyze your skills first");
      return;
    }
    navigate("/jobs");
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
              <Textarea
                placeholder="Example: I have 3 years of experience in mobile phone repair, basic computer knowledge, and good communication skills..."
                value={skillText}
                onChange={(e) => setSkillText(e.target.value)}
                rows={6}
                className="resize-none"
              />

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className={isRecording ? "bg-destructive/10 border-destructive" : ""}
                  onClick={handleVoiceInput}
                >
                  <Mic className={`mr-2 h-4 w-4 ${isRecording ? "animate-pulse" : ""}`} />
                  {isRecording ? "Stop Recording" : "Voice Input"}
                </Button>

                <Button variant="outline" className="relative">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Resume
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                  />
                </Button>

                <Button
                  onClick={analyzeSkills}
                  disabled={isAnalyzing || !skillText.trim()}
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
                      Analyze Skills
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {profile.skills.length > 0 && (
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

                  <Button
                    onClick={handleFindJobs}
                    className="w-full bg-gradient-hero shadow-soft hover:shadow-card"
                  >
                    Find Matching Jobs
                  </Button>
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
