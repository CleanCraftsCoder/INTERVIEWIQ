# InterviewIQ - AI-Powered Mock Interview Platform

A comprehensive full-stack application for practicing technical interviews with AI-powered feedback, real-time analytics, and personalized question generation.

## Features

### Core Functionality
- **User Authentication**: JWT-based signup/login with persistent sessions
- **Resume Upload**: PDF parsing and text extraction for personalized questions
- **AI Question Generation**: OpenAI-powered interview questions based on resume content
- **Real-time Mock Interviews**: Live video recording with speech-to-text conversion
- **Speech Analysis**: Real-time filler word detection, confidence scoring, WPM calculation
- **Comprehensive Analytics**: Detailed performance reports with charts and graphs
- **AI Feedback**: Personalized strengths, weaknesses, and improvement tips

### Technical Features
- **Modern UI/UX**: Responsive design with dark/light mode toggle
- **Real-time Communication**: WebRTC and Socket.io integration
- **File Upload**: Multer-based resume handling with PDF parsing
- **State Management**: Zustand for client-side state
- **Animations**: Framer Motion for smooth transitions
- **Charts**: Recharts for data visualization

## Tech Stack

### Frontend
- React.js 19
- Vite (build tool)
- Tailwind CSS (styling)
- React Router (routing)
- Axios (API calls)
- Zustand (state management)
- Framer Motion (animations)
- Lucide React (icons)
- Recharts (data visualization)
- React Webcam (camera access)

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (authentication)
- OpenAI API (AI features)
- Socket.io (real-time features)
- Multer (file uploads)
- PDF-parse (resume processing)
- bcryptjs (password hashing)

## Project Structure

```
InterviewIQ/
├── backend/
│   ├── controllers/     # Route handlers
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API endpoints
│   ├── middleware/     # Auth middleware
│   ├── utils/          # AI utilities
│   ├── uploads/        # File storage
│   └── server.js       # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # React context providers
│   │   ├── pages/      # Page components
│   │   └── App.jsx     # Main app component
│   └── public/         # Static assets
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB
- OpenAI API key

### Backend Setup
```bash
cd backend
npm install
# Create .env file with required variables
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

#### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/interviewiq
JWT_SECRET=your_jwt_secret_key_here
OPENAI_API_KEY=your_openai_api_key_here
FRONTEND_URL=http://localhost:5173
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Interviews
- `POST /api/interview` - Create new interview
- `GET /api/interview` - Get user's interviews
- `GET /api/interview/:id` - Get specific interview
- `POST /api/interview/generate-questions` - Generate AI questions
- `POST /api/interview/:id/answer` - Save interview answer
- `POST /api/interview/:id/complete` - Complete interview

### File Upload
- `POST /api/upload/resume` - Upload resume PDF
- `GET /api/upload/resume/:fileName/text` - Extract resume text

## Deployment

### Backend (Render)
1. Connect GitHub repository
2. Set environment variables
3. Set build command: `npm install`
4. Set start command: `npm start`

### Frontend (Vercel)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`

## Key Features Implementation

### AI Integration
- OpenAI GPT-3.5-turbo for question generation and answer analysis
- Real-time speech analysis for confidence, filler words, and WPM
- Comprehensive feedback generation with hiring probability

### Real-time Features
- Web Speech API for speech-to-text conversion
- Socket.io for real-time communication
- Webcam access via getUserMedia API

### Security
- JWT tokens with expiration
- Password hashing with bcrypt
- CORS configuration
- Input validation and sanitization

### Performance
- Lazy loading for components
- Optimized bundle size
- Efficient database queries
- Caching strategies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@interviewiq.com or join our Discord community.