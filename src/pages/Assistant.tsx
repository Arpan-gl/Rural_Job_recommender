import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Bookmark, ExternalLink, Bot, User } from 'lucide-react';
import { useJobStore, Job } from '../store/jobStore';
import axios from 'axios';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  jobs?: Job[];
}

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your AI job assistant. I can help you find jobs, answer questions about your skills, and guide you through your career journey. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { saveJob, savedJobs } = useJobStore();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post('/api/assistant/chat', {
        message: input,
        history: messages
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.data.reply,
        timestamp: new Date(),
        jobs: response.data.jobs
      };

      setTimeout(() => {
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      const mockResponses: { [key: string]: { reply: string; jobs?: Job[] } } = {
        'mobile repair': {
          reply: "Great! I found some mobile repair jobs for you. These positions match your skills well.",
          jobs: [
            {
              id: 'm1',
              title: 'Mobile Repair Technician',
              company: 'TechFix Solutions',
              location: 'Lucknow, UP',
              payRange: '₹15,000 - ₹25,000/month',
              skillMatch: 92,
              description: 'Looking for experienced mobile repair technician.',
              requiredSkills: ['Mobile Repair', 'Problem Solving'],
              category: 'Technical'
            }
          ]
        },
        'skills': {
          reply: "I can help you understand your skills! Could you tell me about your experience or what kind of work you've done before?"
        },
        'default': {
          reply: "I understand you're looking for information. I can help you with:\n\n• Finding jobs that match your skills\n• Understanding skill gaps\n• Learning recommendations\n• Career guidance\n\nWhat would you like to explore?"
        }
      };

      let response = mockResponses.default;
      const lowerInput = input.toLowerCase();

      if (lowerInput.includes('mobile') || lowerInput.includes('repair')) {
        response = mockResponses['mobile repair'];
      } else if (lowerInput.includes('skill')) {
        response = mockResponses.skills;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.reply,
        timestamp: new Date(),
        jobs: response.jobs
      };

      setTimeout(() => {
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-IN';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
      alert('Error occurred during speech recognition.');
    };

    recognition.start();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          style={{ height: 'calc(100vh - 8rem)' }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center space-x-3">
            <div className="bg-white p-2 rounded-full">
              <Bot className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Job Assistant</h1>
              <p className="text-blue-100 text-sm">Always here to help</p>
            </div>
          </div>

          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: 'calc(100vh - 20rem)' }}>
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' ? 'bg-blue-600' : 'bg-gray-200'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="w-5 h-5 text-white" />
                        ) : (
                          <Bot className="w-5 h-5 text-gray-600" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className={`rounded-2xl px-4 py-3 ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>

                        {message.jobs && message.jobs.length > 0 && (
                          <div className="mt-3 space-y-3">
                            {message.jobs.map((job) => (
                              <div
                                key={job.id}
                                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h4 className="font-semibold text-gray-900">{job.title}</h4>
                                    <p className="text-sm text-gray-600">{job.company}</p>
                                  </div>
                                  <button
                                    onClick={() => saveJob(job.id)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                  >
                                    <Bookmark
                                      className={`w-4 h-4 ${
                                        savedJobs.includes(job.id)
                                          ? 'fill-blue-600 text-blue-600'
                                          : 'text-gray-400'
                                      }`}
                                    />
                                  </button>
                                </div>

                                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                  <span>{job.location}</span>
                                  <span>•</span>
                                  <span>{job.payRange}</span>
                                </div>

                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-sm text-gray-600">Match</span>
                                  <span className="text-sm font-bold text-blue-600">{job.skillMatch}%</span>
                                </div>

                                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                                  <div
                                    className="bg-blue-600 h-1.5 rounded-full"
                                    style={{ width: `${job.skillMatch}%` }}
                                  ></div>
                                </div>

                                <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                                  <span>Apply Now</span>
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <p className="text-xs text-gray-400 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start space-x-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="flex items-end space-x-2">
                <button
                  onClick={handleVoiceInput}
                  disabled={isListening}
                  className={`p-3 rounded-xl transition-colors ${
                    isListening
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
                </button>

                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message or ask about jobs..."
                  rows={1}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />

                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-2 text-center">
                AI can make mistakes. Verify important information.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
