import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, DollarSign, Filter, Bookmark, ExternalLink, TrendingUp } from 'lucide-react';
import { useJobStore, Job } from '../store/jobStore';
import { useUserStore } from '../store/userStore';
import axios from 'axios';

export default function JobResults() {
  const { filteredJobs, filters, setFilters, setJobs, savedJobs, saveJob, unsaveJob } = useJobStore();
  const { skills } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [skills]);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/jobs', { skills });
      setJobs(response.data.jobs);
    } catch (error) {
      const mockJobs: Job[] = [
        {
          id: '1',
          title: 'Mobile Repair Technician',
          company: 'TechFix Solutions',
          location: 'Lucknow, UP',
          payRange: '₹15,000 - ₹25,000/month',
          skillMatch: 92,
          description: 'Looking for experienced mobile repair technician. Must know Android and iOS troubleshooting.',
          requiredSkills: ['Mobile Repair', 'Problem Solving', 'Customer Service'],
          category: 'Technical',
          distance: '5 km'
        },
        {
          id: '2',
          title: 'Agriculture Supervisor',
          company: 'FarmTech India',
          location: 'Patna, Bihar',
          payRange: '₹18,000 - ₹30,000/month',
          skillMatch: 88,
          description: 'Supervise farm operations and implement modern farming techniques.',
          requiredSkills: ['Farming', 'Team Management', 'Agriculture'],
          category: 'Agriculture',
          distance: '12 km'
        },
        {
          id: '3',
          title: 'Data Entry Operator',
          company: 'Digital Services Ltd',
          location: 'Jaipur, Rajasthan',
          payRange: '₹12,000 - ₹18,000/month',
          skillMatch: 85,
          description: 'Enter data accurately and maintain digital records. Basic computer knowledge required.',
          requiredSkills: ['Data Entry', 'Computer Skills', 'Attention to Detail'],
          category: 'Office Work',
          distance: '8 km'
        },
        {
          id: '4',
          title: 'Delivery Partner',
          company: 'QuickDeliver',
          location: 'Lucknow, UP',
          payRange: '₹20,000 - ₹35,000/month',
          skillMatch: 78,
          description: 'Deliver packages on time. Own vehicle preferred.',
          requiredSkills: ['Driving', 'Time Management', 'Navigation'],
          category: 'Logistics',
          distance: '3 km'
        },
        {
          id: '5',
          title: 'Customer Support Executive',
          company: 'CallCenter Pro',
          location: 'Varanasi, UP',
          payRange: '₹14,000 - ₹22,000/month',
          skillMatch: 82,
          description: 'Handle customer queries via phone and email. Good communication skills required.',
          requiredSkills: ['Communication', 'Problem Solving', 'Customer Service'],
          category: 'Service',
          distance: '15 km'
        },
        {
          id: '6',
          title: 'Electrical Technician',
          company: 'Power Solutions',
          location: 'Kanpur, UP',
          payRange: '₹16,000 - ₹28,000/month',
          skillMatch: 90,
          description: 'Install and maintain electrical systems. ITI certificate preferred.',
          requiredSkills: ['Electrical Work', 'Problem Solving', 'Safety'],
          category: 'Technical',
          distance: '20 km'
        }
      ];
      setJobs(mockJobs);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveJob = (jobId: string) => {
    if (savedJobs.includes(jobId)) {
      unsaveJob(jobId);
    } else {
      saveJob(jobId);
    }
  };

  const upskillRecommendations = [
    { title: 'Digital Marketing Basics', platform: 'PMKVY', duration: '4 weeks' },
    { title: 'Advanced Mobile Repair', platform: 'Udemy', duration: '6 weeks' },
    { title: 'English Communication', platform: 'Local NGO', duration: '8 weeks' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Top Matches for You
            </h1>
            <p className="text-gray-600">
              Found {filteredJobs.length} jobs matching your skills
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={filters.keyword}
                  onChange={(e) => setFilters({ keyword: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Location..."
                  value={filters.location}
                  onChange={(e) => setFilters({ location: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t grid md:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    <option value="Technical">Technical</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Office Work">Office Work</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Service">Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Distance: {filters.maxDistance} km
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={filters.maxDistance}
                    onChange={(e) => setFilters({ maxDistance: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </motion.div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search criteria</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredJobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                {job.title}
                              </h3>
                              <p className="text-gray-600">{job.company}</p>
                            </div>
                            <button
                              onClick={() => handleSaveJob(job.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Bookmark
                                className={`w-5 h-5 ${
                                  savedJobs.includes(job.id)
                                    ? 'fill-blue-600 text-blue-600'
                                    : 'text-gray-400'
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{job.location}</span>
                              {job.distance && <span className="text-gray-400">({job.distance})</span>}
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4" />
                              <span>{job.payRange}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Skill Match</span>
                          <span className="text-sm font-bold text-blue-600">{job.skillMatch}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${job.skillMatch}%` }}
                          ></div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4">{job.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.requiredSkills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        <span>Apply Now</span>
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Upskill Recommendations
                  </h3>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Boost your chances with these courses
                </p>

                <div className="space-y-3">
                  {upskillRecommendations.map((course, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-100"
                    >
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {course.title}
                      </h4>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{course.platform}</span>
                        <span>{course.duration}</span>
                      </div>
                      <button className="mt-3 w-full px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                        Start Course
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
