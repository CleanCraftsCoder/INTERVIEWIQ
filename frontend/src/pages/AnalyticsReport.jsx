import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, MessageSquare, Target, Clock } from 'lucide-react';
import AnalyticsCard from '../components/AnalyticsCard';

const AnalyticsReport = () => {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInterview = async () => {
      try {
        const response = await axios.get(`/api/interview/${id}`);
        setInterview(response.data);
      } catch (error) {
        console.error('Error fetching interview:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInterview();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!interview || !interview.overallAnalysis) {
    return <div>No analysis available</div>;
  }

  const analysis = interview.overallAnalysis;

  // Prepare chart data
  const questionData = interview.questions.map((q, index) => ({
    question: `Q${index + 1}`,
    score: q.analysis?.score || 0,
    confidence: q.analysis?.confidence || 0,
    wpm: q.analysis?.wpm || 0
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Interview Report
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {interview.title} - {new Date(interview.completedAt).toLocaleDateString()}
        </p>
      </div>

      {/* Overall Scores */}
      <div className="grid md:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Overall Score"
          value={`${analysis.totalScore}%`}
          icon={Target}
          color="blue"
        />
        <AnalyticsCard
          title="Average Confidence"
          value={`${analysis.averageConfidence}%`}
          icon={TrendingUp}
          color="green"
        />
        <AnalyticsCard
          title="Words Per Minute"
          value={analysis.averageWpm}
          icon={Clock}
          color="yellow"
        />
        <AnalyticsCard
          title="Filler Words"
          value={analysis.totalFillerWords}
          icon={MessageSquare}
          color="red"
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Question Scores
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={questionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="question" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Performance Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Confidence', value: analysis.averageConfidence },
                  { name: 'Communication', value: 100 - analysis.averageConfidence }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {[analysis.averageConfidence, 100 - analysis.averageConfidence].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Feedback */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8"
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          AI Feedback & Recommendations
        </h3>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-medium text-green-600 dark:text-green-400 mb-3">
              Strengths
            </h4>
            <ul className="space-y-2">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium text-red-600 dark:text-red-400 mb-3">
              Areas for Improvement
            </h4>
            <ul className="space-y-2">
              {analysis.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span className="text-gray-700 dark:text-gray-300">{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <h4 className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-3">
            Communication Tips
          </h4>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {analysis.tips}
          </p>
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="text-blue-600 dark:text-blue-400" size={20} />
            <span className="font-medium text-blue-800 dark:text-blue-200">
              Hiring Probability: {analysis.hiringProbability}%
            </span>
          </div>
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            {analysis.technicalDepth}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsReport;