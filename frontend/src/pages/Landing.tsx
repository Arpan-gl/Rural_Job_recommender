import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles, Target, TrendingUp, Users, Zap, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const Landing = () => {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Matching",
      description: "Advanced algorithms match your skills with perfect job opportunities"
    },
    {
      icon: Target,
      title: "Skill Gap Analysis",
      description: "Identify missing skills and get personalized learning recommendations"
    },
    {
      icon: MessageSquare,
      title: "Voice Assistant",
      description: "Speak your skills in any language - our AI understands"
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Track your progress and discover new opportunities"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get job recommendations in seconds, not days"
    },
    {
      icon: Users,
      title: "For Rural Youth",
      description: "Designed specifically for job seekers in rural areas"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Mobile Repair Technician",
      content: "Found my dream job in just 2 days! The AI perfectly matched my skills.",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      role: "Agricultural Specialist",
      content: "The voice feature helped me share my farming experience easily.",
      rating: 5
    },
    {
      name: "Anita Patel",
      role: "Digital Marketing Assistant",
      content: "The skill gap analysis helped me learn exactly what I needed.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-accent/30 via-background to-background py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>AI-Powered Job Matching</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
              Find Jobs That Match Your Skills — Instantly
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              AI-powered job recommendations for rural youth. Speak, type, or upload your skills to discover perfect career opportunities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/skills">
                <Button size="lg" className="bg-gradient-hero shadow-card hover:shadow-elevated transition-all group">
                  Start Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/jobs">
                <Button size="lg" variant="outline" className="shadow-soft">
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose JobMatch AI?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help rural youth find meaningful employment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-border shadow-card hover:shadow-elevated transition-all h-full">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-lg bg-gradient-hero flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from rural youth who found their dream jobs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-border shadow-card h-full">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-500">★</span>
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                    <div className="border-t border-border pt-4">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Find Your Dream Job?
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of rural youth who have already found meaningful employment
          </p>
          <Link to="/skills">
            <Button size="lg" variant="secondary" className="shadow-elevated">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/20" />
      </section>
    </div>
  );
};

export default Landing;
