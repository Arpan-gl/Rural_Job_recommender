import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Clock, Award, ExternalLink } from 'lucide-react';
import { useUserStore } from '../store/userStore';

export default function Dashboard() {
  const { skills } = useUserStore();

  const skillGapData = [
    { skill: 'Mobile Repair', current: 80, required: 90 },
    { skill: 'Communication', current: 70, required: 85 },
    { skill: 'Digital Marketing', current: 40, required: 80 },
    { skill: 'Data Entry', current: 75, required: 85 },
    { skill: 'Customer Service', current: 65, required: 90 },
  ];

  const demandData = [
    { skill: 'Digital Marketing', demand: 95 },
    { skill: 'Data Analysis', demand: 88 },
    { skill: 'Mobile Repair', demand: 82 },
    { skill: 'English Communication', demand: 78 },
    { skill: 'Computer Skills', demand: 75 },
  ];

  const learningPaths = [
    {
      title: 'Digital Marketing Mastery',
      provider: 'PMKVY Certified',
      duration: '12 weeks',
      skillsGained: ['SEO', 'Social Media', 'Content Marketing'],
      estimatedIncrease: '+35% job matches',
      link: '#'
    },
    {
      title: 'Advanced Communication Skills',
      provider: 'Udemy',
      duration: '8 weeks',
      skillsGained: ['English Speaking', 'Presentation', 'Email Writing'],
      estimatedIncrease: '+25% job matches',
      link: '#'
    },
    {
      title: 'Data Entry Professional',
      provider: 'Local Training Center',
      duration: '6 weeks',
      skillsGained: ['MS Office', 'Typing Speed', 'Data Management'],
      estimatedIncrease: '+20% job matches',
      link: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Skill Gap Dashboard
            </h1>
            <p className="text-gray-600">
              Understand your skills and discover opportunities to grow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Award className="w-10 h-10" />
                <span className="text-3xl font-bold">{skills.length}</span>
              </div>
              <h3 className="text-lg font-semibold mb-1">Current Skills</h3>
              <p className="text-blue-100">Skills in your profile</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-10 h-10" />
                <span className="text-3xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-1">Growth Areas</h3>
              <p className="text-green-100">Skills to develop</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-10 h-10" />
                <span className="text-3xl font-bold">12</span>
              </div>
              <h3 className="text-lg font-semibold mb-1">Weeks to Goal</h3>
              <p className="text-purple-100">Average learning time</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Skill Gaps</h2>

              <div className="space-y-6">
                {skillGapData.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">{item.skill}</span>
                      <span className="text-sm text-gray-500">
                        {item.current}% / {item.required}%
                      </span>
                    </div>

                    <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.current}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="absolute h-full bg-blue-500 rounded-full"
                      ></motion.div>

                      <div
                        className="absolute h-full border-r-2 border-green-500"
                        style={{ left: `${item.required}%` }}
                      >
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>

                    <div className="flex justify-between mt-1 text-xs">
                      <span className="text-blue-600">Current Level</span>
                      <span className="text-green-600">Target Level</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-gray-700">
                  <strong>Tip:</strong> Focus on closing the largest gaps first to maximize your job opportunities.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Top 5 In-Demand Skills Nearby
              </h2>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={demandData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="skill" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="demand" fill="#3b82f6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6 p-4 bg-green-50 rounded-xl">
                <p className="text-sm text-gray-700">
                  <strong>Insight:</strong> Learning these skills can increase your employability by up to 60% in your region.
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Recommended Learning Paths
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {learningPaths.map((path, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Award className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {path.estimatedIncrease}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {path.title}
                  </h3>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <span>{path.provider}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{path.duration}</span>
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Skills you'll gain:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {path.skillsGained.map((skill, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a
                    href={path.link}
                    className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <span>Start Course</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 text-center text-white"
          >
            <h3 className="text-2xl font-bold mb-4">Ready to Upskill?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Start learning today and unlock better job opportunities. Our AI will track your progress and update your recommendations.
            </p>
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg">
              Browse All Courses
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
