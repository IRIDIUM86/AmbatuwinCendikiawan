import { useState } from 'react';

// AI-Enhanced Event Card Component - Neon Glassmorphism
function AIEventCard({ event }) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:border-purple-500/50 transition-all duration-300 group">
      {/* AI Match Badge with Gradient */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 animate-pulse"></div>
        <div className="flex items-center justify-between relative z-10">
          <span className="text-white font-bold text-lg drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{event.matchScore}% Match</span>
          <span className="text-white text-2xl animate-pulse">✨</span>
        </div>
      </div>

      {/* Placeholder Image with Neon Gradient */}
      <div className="h-48 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <span className="text-white text-6xl relative z-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] group-hover:scale-110 transition-transform duration-300">{event.icon}</span>
      </div>
      
      {/* Card Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">{event.title}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-slate-300">
            <span className="mr-2">📅</span>
            <span className="text-sm">{event.date}</span>
          </div>
          
          <div className="flex items-center text-slate-300">
            <span className="mr-2">📍</span>
            <span className="text-sm">{event.location}</span>
          </div>
          
          <div className="flex items-center text-slate-300">
            <span className="mr-2">🏷️</span>
            <span className="text-sm font-medium text-cyan-400">{event.category}</span>
          </div>
        </div>

        {/* AI Match Reason - Glassmorphism Box */}
        <div className="bg-purple-500/10 backdrop-blur-sm border-l-4 border-purple-500 p-4 rounded-r-xl mb-4 hover:bg-purple-500/20 transition-all duration-300">
          <div className="flex items-start">
            <span className="text-purple-400 mr-2 mt-1 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">🤖</span>
            <div>
              <p className="text-sm font-semibold text-purple-300 mb-1">AI Match Reason</p>
              <p className="text-sm text-slate-300">{event.aiReason}</p>
            </div>
          </div>
        </div>
        
        <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 hover:shadow-[0_0_25px_rgba(139,92,246,0.6)] text-white font-semibold py-3 px-4 rounded-full transition-all duration-300 transform hover:scale-105">
          View Details
        </button>
      </div>
    </div>
  );
}

export default function AIMatchmaker() {
  // State management
  const [userGoals, setUserGoals] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Mock AI-matched events
  const mockAIMatches = [
    {
      id: 1,
      title: "Tech Innovation & Investment Summit",
      date: "March 20, 2024",
      location: "Silicon Valley Convention Center",
      category: "Technology & Investment",
      matchScore: 98,
      icon: "💡",
      aiReason: "This tech expo aligns perfectly with your stated goal of finding software investors. Features 200+ VCs and angel investors actively seeking tech startups."
    },
    {
      id: 2,
      title: "AI & Machine Learning Networking Mixer",
      date: "April 8, 2024",
      location: "San Francisco Tech Hub",
      category: "Technology & Networking",
      matchScore: 95,
      icon: "🤖",
      aiReason: "Based on your interest in AI connections, this event brings together 150+ AI professionals and features pitch sessions with ML-focused investors."
    },
    {
      id: 3,
      title: "Startup Funding Bootcamp",
      date: "May 15, 2024",
      location: "Austin Innovation District",
      category: "Investment & Education",
      matchScore: 92,
      icon: "🚀",
      aiReason: "Your profile indicates you're seeking investment opportunities. This intensive bootcamp connects founders with seed-stage investors and includes 1-on-1 pitch coaching."
    }
  ];

  // Mock AI analysis function with 2-second delay
  const handleFindMatches = async () => {
    if (!userGoals.trim()) {
      alert('Please describe your goals first!');
      return;
    }

    setIsAnalyzing(true);
    setShowResults(false);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsAnalyzing(false);
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <span className="text-6xl drop-shadow-[0_0_20px_rgba(139,92,246,0.8)]">🤖✨</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-3 drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]">
            AI Matchmaker
          </h1>
          <p className="text-slate-300 text-lg">
            Let AI find the perfect events and connections tailored to your goals
          </p>
        </div>

        {/* Input Section - Glassmorphism */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(139,92,246,0.3)] p-8">
            <label htmlFor="goals" className="block text-lg font-semibold text-slate-200 mb-3">
              What are you looking for?
            </label>
            <textarea
              id="goals"
              rows="5"
              placeholder="Describe what kind of connections or events you are looking for... (e.g., 'I'm looking for software investors and networking opportunities in the AI space')"
              value={userGoals}
              onChange={(e) => setUserGoals(e.target.value)}
              disabled={isAnalyzing}
              className="w-full px-6 py-4 bg-slate-900/50 border border-white/10 rounded-2xl text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:shadow-[0_0_25px_rgba(139,92,246,0.5)] outline-none transition-all resize-none"
            />

            {/* Find Matches Button - Neon Gradient */}
            <button
              onClick={handleFindMatches}
              disabled={isAnalyzing}
              className={`w-full mt-6 py-4 px-6 rounded-full font-bold text-lg transition-all duration-300 transform ${
                isAnalyzing
                  ? 'bg-gradient-to-r from-purple-400 to-blue-400 cursor-not-allowed opacity-70'
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 hover:scale-105 hover:shadow-[0_0_30px_rgba(139,92,246,0.7)]'
              } text-white`}
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center space-x-3">
                  {/* Animated Spinner */}
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {/* Pulsing Text */}
                  <span className="animate-pulse">AI is analyzing your profile and goals...</span>
                </div>
              ) : (
                <span>🔮 Find AI Matches</span>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {showResults && (
          <div className="max-w-7xl mx-auto animate-fadeIn">
            {/* Section Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                ✨ Recommended for You
              </h2>
              <p className="text-slate-300">
                AI-powered matches based on your goals and profile
              </p>
            </div>

            {/* Event Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockAIMatches.map(event => (
                <AIEventCard key={event.id} event={event} />
              ))}
            </div>

            {/* Additional Info - Glassmorphism */}
            <div className="mt-12 text-center">
              <div className="inline-block bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-[0_0_30px_rgba(139,92,246,0.3)] px-8 py-6">
                <p className="text-slate-200 mb-2">
                  <span className="font-semibold text-purple-400">Pro Tip:</span> Update your profile for even better matches!
                </p>
                <p className="text-sm text-slate-400">
                  Our AI learns from your preferences to provide increasingly accurate recommendations
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State (when no results yet) */}
        {!showResults && !isAnalyzing && (
          <div className="text-center py-12 max-w-2xl mx-auto">
            <div className="text-8xl mb-6 animate-bounce drop-shadow-[0_0_20px_rgba(139,92,246,0.6)]">🎯</div>
            <h3 className="text-2xl font-semibold text-slate-200 mb-3">
              Ready to discover your perfect matches?
            </h3>
            <p className="text-slate-400 text-lg">
              Tell us what you're looking for, and our AI will find the best events and connections for you
            </p>
          </div>
        )}
      </div>

      {/* Custom CSS for fade-in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
