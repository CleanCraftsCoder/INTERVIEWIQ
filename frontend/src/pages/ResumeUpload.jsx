import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ResumeUploader from '../components/ResumeUploader';
import { ArrowRight, FileText } from 'lucide-react';

const ResumeUpload = () => {
  const [resumeData, setResumeData] = useState(null);
  const navigate = useNavigate();

  const handleUploadSuccess = (data) => {
    setResumeData(data);
  };

  const handleContinue = () => {
    // Navigate to dashboard or create interview with resume data
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Upload Your Resume
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          We'll analyze your resume to generate personalized interview questions
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8"
      >
        <ResumeUploader onUploadSuccess={handleUploadSuccess} />

        {resumeData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
          >
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="text-green-600 dark:text-green-400" size={24} />
              <h3 className="text-lg font-medium text-green-800 dark:text-green-200">
                Resume Processed Successfully!
              </h3>
            </div>

            <div className="text-sm text-green-700 dark:text-green-300 mb-4">
              <p>Pages extracted: {resumeData.pages ?? 0}</p>
              <p>Text length: {resumeData?.text?.length ?? 0} characters</p>
            </div>

            <button
              onClick={handleContinue}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <span>Continue to Dashboard</span>
              <ArrowRight size={20} />
            </button>
          </motion.div>
        )}
      </motion.div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">
          Why upload your resume?
        </h3>
        <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
          <li>• Get personalized interview questions based on your experience</li>
          <li>• AI analyzes your skills and generates relevant technical questions</li>
          <li>• Better preparation for your specific career path</li>
          <li>• Resume data is securely stored and used only for interview generation</li>
        </ul>
      </div>
    </div>
  );
};

export default ResumeUpload;