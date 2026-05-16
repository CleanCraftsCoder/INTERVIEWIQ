import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Plus, Play, BarChart3, Calendar, TrendingUp } from 'lucide-react';
import AnalyticsCard from '../components/AnalyticsCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

const Dashboard = () => {
  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const [interviewsRes, statsRes] = await Promise.all([
        axios.get('/api/interview'),
        axios.get('/api/user/stats')
      ]);

      setInterviews(interviewsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      await fetchDashboardData();
    };
    loadDashboard();
  }, []);

  const createNewInterview = async () => {
    try {
      const response = await axios.post('/api/interview', {
        title: `Interview ${new Date().toLocaleDateString()}`,
        type: 'technical'
      });

      // Redirect to interview room
      window.location.href = `/interview/${response.data._id}`;
    } catch (error) {
      const message = error.response?.data?.message || 'Error creating interview';
      console.error('Error creating interview:', message);
      setError(message);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <LoadingSkeleton key={i} className="h-32" />
          ))}
        </div>
        <LoadingSkeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Ready to practice your interview skills?
          </p>
        </div>

        <button
          onClick={createNewInterview}
          className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Interview</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid md:grid-cols-4 gap-6">
          <AnalyticsCard
            title="Total Interviews"
            value={stats.totalInterviews}
            icon={Play}
            color="blue"
          />
          <AnalyticsCard
            title="Completed"
            value={stats.completedInterviews}
            icon={BarChart3}
            color="green"
          />
          <AnalyticsCard
            title="Average Score"
            value={`${stats.averageScore?.toFixed(1) || 0}%`}
            icon={TrendingUp}
            color="purple"
          />
          <AnalyticsCard
            title="This Month"
            value={interviews.filter(i =>
              new Date(i.createdAt).getMonth() === new Date().getMonth()
            ).length}
            icon={Calendar}
            color="yellow"
          />
        </div>
      )}

      {/* Recent Interviews */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Interviews
          </h2>
        </div>

        <div className="p-6">
          {interviews.length === 0 ? (
            <div className="text-center py-12">
              <Play size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No interviews yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start your first mock interview to begin improving your skills.
              </p>
              <button
                onClick={createNewInterview}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Start Your First Interview
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {interviews.slice(0, 5).map((interview) => (
                <motion.div
                  key={interview._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {interview.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(interview.createdAt).toLocaleDateString()} •
                      {interview.status === 'completed' ? ' Completed' : ' In Progress'} •
                      {interview.type}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    {interview.status === 'completed' && interview.overallAnalysis && (
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {interview.overallAnalysis.totalScore}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Score
                        </div>
                      </div>
                    )}

                    <Link
                      to={interview.status === 'completed'
                        ? `/analytics/${interview._id}`
                        : `/interview/${interview._id}`
                      }
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                    >
                      {interview.status === 'completed' ? 'View Report' : 'Continue'}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link
          to="/resume-upload"
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
              <BarChart3 className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Upload Resume
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get personalized questions
              </p>
            </div>
          </div>
        </Link>

        <div
          onClick={createNewInterview}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
              <Play className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Quick Practice
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Start a new interview
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/profile"
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg">
              <TrendingUp className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                View Progress
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track your improvement
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;