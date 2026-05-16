import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-slate-950 text-slate-200">
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src="/InterviewAILogo1.png" alt="InterviewIQ logo" className="h-10 w-10 object-contain" />
            <div>
              <h3 className="text-2xl font-semibold text-white">InterviewIQ</h3>
              <p className="text-sm text-slate-400 mt-1">AI-powered mock interviews, analytics, and resume-ready preparation.</p>
            </div>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Build confidence, sharpen your answers, and measure your progress as you prepare for technical interviews with AI-guided feedback.
          </p>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-3 text-slate-400">
            <li>
              <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
            </li>
            <li>
              <Link to="/resume-upload" className="hover:text-blue-400 transition-colors">Resume Upload</Link>
            </li>
            <li>
              <Link to="/signup" className="hover:text-blue-400 transition-colors">Sign Up</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-white mb-4">Contact</h4>
          <p className="text-slate-400 mb-4">
            Need help? Reach out for support, feature requests, or deployment advice.
          </p>
          <p className="text-slate-400">Email: <a href="mailto:support@interviewiq.app" className="text-blue-400 hover:text-blue-200">support@interviewiq.app</a></p>
          <p className="text-slate-400 mt-2">Built with React, Tailwind, Express, MongoDB, and OpenAI.</p>
        </div>
      </div>

      <div className="mt-10 border-t border-slate-800 pt-6 flex flex-col gap-4 items-start justify-between text-slate-500 md:flex-row md:items-center">
        <p>© {new Date().getFullYear()} InterviewIQ. All rights reserved.</p>
        <div className="flex flex-wrap gap-3">
          <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Privacy</a>
          <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Terms</a>
          <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Support</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
