import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import QuestionCard from '../components/QuestionCard';
import VideoRecorder from '../components/VideoRecorder';
import { Mic, MicOff, ArrowRight } from 'lucide-react';

const InterviewRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        setTranscript(prev => prev + finalTranscript);
      };
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const response = await axios.get(`/api/interview/${id}`);
        setInterview(response.data);
      } catch (error) {
        console.error('Error fetching interview:', error);
      } finally {
        setLoading(false);
      }
      initializeSpeechRecognition();
    };
    initialize();
  }, [id]);

  const startRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsRecording(true);
      setTranscript('');
    }
  };

  const stopRecording = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);

      // Save answer
      try {
        setError(null);
        const response = await axios.post(`/api/interview/${id}/answer`, {
          questionIndex: currentQuestionIndex,
          answer: transcript,
          transcript: transcript
        });
        setAnalysis(response.data.analysis);
      } catch (error) {
        setError(error.response?.data?.message || 'Error saving answer.');
        console.error('Error saving answer:', error);
      }
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < interview.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTranscript('');
      setAnalysis(null);
    } else {
      // Complete interview
      completeInterview();
    }
  };

  const completeInterview = async () => {
    try {
      setError(null);
      await axios.post(`/api/interview/${id}/complete`);
      navigate(`/analytics/${id}`);
    } catch (error) {
      const message = error.response?.data?.message || 'Error completing interview.';
      setError(message);
      console.error('Error completing interview:', message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!interview) {
    return <div>Interview not found</div>;
  }

  if (!interview.questions || interview.questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-24 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          No questions available
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This interview does not have generated questions yet. Upload a resume and create a new interview to generate personalized questions.
        </p>
      </div>
    );
  }

  const currentQuestion = interview.questions[currentQuestionIndex];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {interview.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Question {currentQuestionIndex + 1} of {interview.questions.length}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Video Section */}
        <div className="space-y-6">
          <VideoRecorder isRecording={isRecording} />

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Recording Controls
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isRecording
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                <span>{isRecording ? 'Stop' : 'Start'} Recording</span>
              </button>

              {transcript && (
                <button
                  onClick={nextQuestion}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 flex items-center space-x-2"
                >
                  <span>{currentQuestionIndex < interview.questions.length - 1 ? 'Next Question' : 'Submit Interview'}</span>
                  <ArrowRight size={20} />
                </button>
              )}
            </div>

            {error && (
              <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-4 text-red-700 dark:text-red-200">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-6">
          {currentQuestion && (
            <QuestionCard
              question={currentQuestion.question}
              index={currentQuestionIndex}
              isActive={true}
              isRecording={isRecording}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              analysis={analysis}
            />
          )}

          {transcript && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Your Response
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300">{transcript}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;