import { motion } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';

const QuestionCard = ({
  question,
  index,
  isActive,
  isRecording,
  onStartRecording,
  onStopRecording,
  analysis
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-6 rounded-lg border-2 transition-all ${
        isActive
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Question {index + 1}
          </h3>
          <p className="text-gray-700 dark:text-gray-300">{question}</p>
        </div>
      </div>

      {isActive && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={isRecording ? onStopRecording : onStartRecording}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isRecording
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
              <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
            </button>

            {isRecording && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-600 font-medium">Recording...</span>
              </div>
            )}
          </div>

          {analysis && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Real-time Analysis</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Confidence:</span>
                  <span className="ml-1 font-medium">{analysis.confidence}%</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">WPM:</span>
                  <span className="ml-1 font-medium">{analysis.wpm}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Filler Words:</span>
                  <span className="ml-1 font-medium">{analysis.fillerWords}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Score:</span>
                  <span className="ml-1 font-medium">{analysis.score}/100</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default QuestionCard;