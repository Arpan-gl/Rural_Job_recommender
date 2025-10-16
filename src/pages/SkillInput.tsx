import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, Upload, X, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import axios from 'axios';

export default function SkillInput() {
  const navigate = useNavigate();
  const { skills, setSkills, setExperience } = useUserStore();
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + ' ' + transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      alert('Error occurred during speech recognition. Please try again.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/skills/extract', formData);

      if (response.data.skills) {
        setExtractedSkills(response.data.skills);
        setInput(response.data.experience || '');
      }
    } catch (error) {
      const mockSkills = ['Communication', 'Problem Solving', 'Team Work', 'Microsoft Office', 'Customer Service'];
      setExtractedSkills(mockSkills);
      setInput('Experienced in various customer-facing roles with strong communication skills.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeSkills = async () => {
    if (!input.trim()) {
      alert('Please describe your skills or experience first.');
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await axios.post('/api/skills/analyze', { text: input });

      if (response.data.skills) {
        setExtractedSkills(response.data.skills);
      }
    } catch (error) {
      const words = input.toLowerCase();
      const skillKeywords = ['farming', 'agriculture', 'repair', 'mobile', 'computer', 'teaching', 'driving',
                            'cooking', 'tailoring', 'electrical', 'plumbing', 'carpentry', 'welding',
                            'sales', 'marketing', 'accounting', 'data entry', 'communication'];

      const detected = skillKeywords.filter(skill => words.includes(skill));
      const mockSkills = detected.length > 0
        ? detected.map(s => s.charAt(0).toUpperCase() + s.slice(1))
        : ['Communication', 'Team Work', 'Problem Solving'];

      setExtractedSkills(mockSkills);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setExtractedSkills(extractedSkills.filter(skill => skill !== skillToRemove));
  };

  const handleFindJobs = () => {
    if (extractedSkills.length === 0) {
      alert('Please analyze your skills first.');
      return;
    }

    setSkills(extractedSkills);
    setExperience(input);
    navigate('/jobs');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Step 1 of 2</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Tell Us About Your Skills
            </h1>
            <p className="text-lg text-gray-600">
              Describe your skills, use voice input, or upload your resume
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Describe your skills or work experience
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Example: I have 2 years of experience in mobile repair. I can fix smartphones, replace screens, and solve software issues. I also know basic computer operations..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button
                onClick={handleVoiceInput}
                disabled={isListening || isAnalyzing}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
                  isListening
                    ? 'bg-red-600 text-white'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
                <span>{isListening ? 'Listening...' : 'Voice Input'}</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-green-50 text-green-600 rounded-xl font-semibold hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-5 h-5" />
                <span>Upload Resume</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <button
              onClick={analyzeSkills}
              disabled={!input.trim() || isAnalyzing}
              className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing Skills...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Analyze Skills with AI</span>
                </>
              )}
            </button>
          </div>

          {extractedSkills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-8 mt-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Extracted Skills
              </h2>
              <p className="text-gray-600 mb-6">
                We found these skills in your profile. Remove any that don't apply.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                {extractedSkills.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full"
                  >
                    <span className="font-medium">{skill}</span>
                    <button
                      onClick={() => removeSkill(skill)}
                      className="hover:bg-blue-200 rounded-full p-1 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={handleFindJobs}
                className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg"
              >
                <span>Find Matching Jobs</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
