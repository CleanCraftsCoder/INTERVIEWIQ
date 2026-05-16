const OpenAI = require('openai');

const useMistral = Boolean(process.env.MISTRAL_API_KEY);
const mistralApiKey = process.env.MISTRAL_API_KEY;
const mistralModel = process.env.MISTRAL_MODEL || 'mistral-7b-instruct';
const useOpenAI = Boolean(process.env.OPENAI_API_KEY);
const openai = useOpenAI ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const extractMistralText = (data) => {
  if (!data) return '';

  const candidates = [
    data.output?.[0]?.content?.[0]?.text,
    data.results?.[0]?.content?.[0]?.text,
    data.output?.[0]?.text,
    data.results?.[0]?.text,
    data.response?.output?.[0]?.content?.[0]?.text
  ];

  for (const text of candidates) {
    if (typeof text === 'string' && text.trim()) {
      return text.trim();
    }
  }

  return '';
};

const callMistral = async (prompt, { maxTokens = 1000, temperature = 0.7 } = {}) => {
  if (!mistralApiKey) {
    throw new Error('Mistral API key is not configured. Set MISTRAL_API_KEY in .env');
  }

  const response = await fetch(`https://api.mistral.ai/v1/models/${mistralModel}/generate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${mistralApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      input: prompt,
      max_tokens: maxTokens,
      temperature,
      top_p: 1,
      stop_sequences: []
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Mistral API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return extractMistralText(data);
};

const callOpenAI = async (prompt, { maxTokens = 1000, temperature = 0.7 } = {}) => {
  if (!openai) {
    throw new Error('OpenAI API key is not configured. Set OPENAI_API_KEY in .env');
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: maxTokens,
    temperature
  });

  return response.choices?.[0]?.message?.content || '';
};

const callLLM = async (prompt, options = {}) => {
  if (useMistral) {
    return await callMistral(prompt, options);
  }

  if (useOpenAI) {
    return await callOpenAI(prompt, options);
  }

  throw new Error('No AI provider configured. Set MISTRAL_API_KEY or OPENAI_API_KEY in .env');
};

const safeParseJson = (text) => {
  try {
    return JSON.parse(text);
  } catch (err) {
    return null;
  }
};

// Generate interview questions based on resume text
const generateQuestions = async (resumeText, jobType = 'technical') => {
  try {
    const prompt = `You are an expert interviewer. Based on this candidate resume, generate 5 interview questions tailored to the candidate's experience, skills, and education. Use the ${jobType} interview style. Return only a JSON array of strings, without any extra text.\n\nResume: ${resumeText}`;
    const responseText = await callLLM(prompt, { maxTokens: 1000 });
    const questions = safeParseJson(responseText);
    return Array.isArray(questions) ? questions : [];
  } catch (error) {
    console.error('Error generating questions:', error);
    return [];
  }
};

// Analyze interview answer
const analyzeAnswer = async (question, answer, transcript) => {
  try {
    const prompt = `Analyze this interview answer for:\n- Confidence level (0-100)\n- Number of filler words (uh, um, like, etc.)\n- Speaking speed (words per minute)\n- Number of pauses (long silences >2 seconds)\n- Overall quality score (0-100)\n\nQuestion: ${question}\nAnswer Transcript: ${transcript}\n\nReturn as JSON with keys: confidence, fillerWords, wpm, pauses, score`;
    const responseText = await callLLM(prompt, { maxTokens: 500 });
    const analysis = safeParseJson(responseText);

    if (analysis && typeof analysis === 'object') {
      return analysis;
    }

    throw new Error('Invalid analysis response');
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
    const prompt = `Based on this interview data, provide comprehensive feedback including:\n- Strengths\n- Weaknesses  \n- Communication tips\n- Technical depth evaluation\n- Estimated hiring probability (0-100)\n\nInterview Summary: ${JSON.stringify(interviewData)}\n\nReturn as JSON with keys: strengths (array), weaknesses (array), tips (string), technicalDepth (string), hiringProbability (number)`;
    const responseText = await callLLM(prompt, { maxTokens: 1000 });
    const feedback = safeParseJson(responseText);

    if (feedback && typeof feedback === 'object') {
      return feedback;
    }

    throw new Error('Invalid feedback response');
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