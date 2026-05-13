import { useState } from 'react';

// AI-Enhanced Event Card Component
function AIEventCard({ event }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100">
      {/* AI Match Badge */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3">
        <div className="flex items-center justify-between">
          <span className="text-white font-bold text-lg">{event.matchScore}% Match</span>
          <span className="text-white text-2xl">✨</span>
        </div>
      </div>

      {/* Placeholder Image */}
      <div className="h-48 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center">
        <span className="text-white text-6xl">{event.icon}</span>
      </div>
      
      {/* Card Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <span className="mr-2">📅</span>
            <span className="text-sm">{event.date}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <span className="mr-2">📍</span>
            <span className="text-sm">{event.location}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <span className="mr-2">🏷️</span>
            <span className="text-sm font-medium text-purple-600">{event.category}</span>
          </div>
        </div>

        {/* AI Match Reason - Highlighted */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-500 p-4 rounded-r-lg mb-4">
          <div className="flex items-start">
            <span className="text-purple-600 mr-2 mt-1">🤖</span>
            <div>
              <p className="text-sm font-semibold text-purple-900 mb-1">AI Match Reason</p>
              <p className="text-sm text-gray-700">{event.aiReason}</p>
            </div>
          </div>
        </div>
        
        <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <span className="text-6xl">🤖✨</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
            AI Matchmaker
          </h1>
          <p className="text-gray-600 text-lg">
            Let AI find the perfect events and connections tailored to your goals
          </p>
        </div>

        {/* Input Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
            <label htmlFor="goals" className="block text-lg font-semibold text-gray-800 mb-3">
              What are you looking for?
            </label>
            <textarea
              id="goals"
              rows="5"
              placeholder="Describe what kind of connections or events you are looking for... (e.g., 'I'm looking for software investors and networking opportunities in the AI space')"
              value={userGoals}
              onChange={(e) => setUserGoals(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none transition-all resize-none text-gray-700"
              disabled={isAnalyzing}
            />

            {/* Find Matches Button */}
            <button
              onClick={handleFindMatches}
              disabled={isAnalyzing}
              className={`w-full mt-6 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                isAnalyzing
                  ? 'bg-gradient-to-r from-purple-400 to-blue-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-105 hover:shadow-2xl'
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                ✨ Recommended for You
              </h2>
              <p className="text-gray-600">
                AI-powered matches based on your goals and profile
              </p>
            </div>

            {/* Event Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockAIMatches.map(event => (
                <AIEventCard key={event.id} event={event} />
              ))}
            </div>

            {/* Additional Info */}
            <div className="mt-12 text-center">
              <div className="inline-block bg-white rounded-xl shadow-lg px-8 py-6 border border-purple-100">
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold text-purple-600">Pro Tip:</span> Update your profile for even better matches!
                </p>
                <p className="text-sm text-gray-500">
                  Our AI learns from your preferences to provide increasingly accurate recommendations
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State (when no results yet) */}
        {!showResults && !isAnalyzing && (
          <div className="text-center py-12 max-w-2xl mx-auto">
            <div className="text-8xl mb-6 animate-bounce">🎯</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">
              Ready to discover your perfect matches?
            </h3>
            <p className="text-gray-500 text-lg">
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
