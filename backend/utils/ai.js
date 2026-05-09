const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Generate interview questions based on resume text
const generateQuestions = async (resumeText, jobType = 'technical') => {
  try {
    const prompt = `Based on this resume text, generate 10 interview questions for a ${jobType} position. 
    Include a mix of technical and behavioral questions. Return as JSON array of strings.

    Resume: ${resumeText}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000
    });

    const questions = JSON.parse(response.choices[0].message.content);
    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    return [];
  }
};

// Analyze interview answer
const analyzeAnswer = async (question, answer, transcript) => {
  try {
    const prompt = `Analyze this interview answer for:
    - Confidence level (0-100)
    - Number of filler words (uh, um, like, etc.)
    - Speaking speed (words per minute)
    - Number of pauses (long silences >2 seconds)
    - Overall quality score (0-100)

    Question: ${question}
    Answer Transcript: ${transcript}

    Return as JSON with keys: confidence, fillerWords, wpm, pauses, score`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500
    });

    const analysis = JSON.parse(response.choices[0].message.content);
    return analysis;
  } catch (error) {
    console.error('Error analyzing answer:', error);
    return {
      confidence: 50,
      fillerWords: 0,
      wpm: 150,
      pauses: 0,
      score: 50
    };
  }
};

// Generate overall feedback
const generateFeedback = async (interviewData) => {
  try {
    const prompt = `Based on this interview data, provide comprehensive feedback including:
    - Strengths
    - Weaknesses  
    - Communication tips
    - Technical depth evaluation
    - Estimated hiring probability (0-100)

    Interview Summary: ${JSON.stringify(interviewData)}

    Return as JSON with keys: strengths (array), weaknesses (array), tips (string), technicalDepth (string), hiringProbability (number)`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000
    });

    const feedback = JSON.parse(response.choices[0].message.content);
    return feedback;
  } catch (error) {
    console.error('Error generating feedback:', error);
    return {
      strengths: [],
      weaknesses: [],
      tips: '',
      technicalDepth: '',
      hiringProbability: 50
    };
  }
};

module.exports = {
  generateQuestions,
  analyzeAnswer,
  generateFeedback
};