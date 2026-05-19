import { useState } from 'react';

// EventCard Component - Neon Glassmorphism
function EventCard({ event }) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:border-purple-500/50 transition-all duration-300 group">
      {/* Placeholder Image with Gradient */}
      <div className="h-48 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      {/* Card Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">{event.title}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-slate-300">
            <span className="text-sm">{event.date}</span>
          </div>

          <div className="flex items-center text-slate-300">
            <span className="text-sm">{event.location}</span>
          </div>

          <div className="flex items-center text-slate-300">
            <span className="text-sm font-medium text-cyan-400">{event.category}</span>
          </div>
        </div>
        
        <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] text-white font-semibold py-2.5 px-4 rounded-full transition-all duration-300 transform hover:scale-105">
          View Details
        </button>
      </div>
    </div>
  );
}

export default function EventDiscovery() {
  // Mock event data
  const mockEvents = [
    {
      id: 1,
      title: "Tech Innovation Summit 2024",
      date: "March 15, 2024",
      location: "San Francisco Convention Center",
      category: "Technology"
    },
    {
      id: 2,
      title: "Retail Excellence Expo",
      date: "April 22, 2024",
      location: "New York Trade Center",
      category: "Retail"
    },
    {
      id: 3,
      title: "Food & Beverage Festival",
      date: "May 10, 2024",
      location: "Chicago Lakefront Park",
      category: "F&B"
    },
    {
      id: 4,
      title: "Digital Marketing Conference",
      date: "June 5, 2024",
      location: "Austin Convention Hall",
      category: "Technology"
    },
    {
      id: 5,
      title: "Fashion Week Showcase",
      date: "July 18, 2024",
      location: "Los Angeles Fashion District",
      category: "Retail"
    },
    {
      id: 6,
      title: "Culinary Arts Workshop",
      date: "August 12, 2024",
      location: "Seattle Culinary Institute",
      category: "F&B"
    }
  ];

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [events] = useState(mockEvents);

  // Categories for dropdown
  const categories = ['All', 'Technology', 'Retail', 'F&B'];

  // Mock filter function
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-3">Event Discovery</h1>
          <p className="text-slate-300 text-lg">Discover exciting events tailored for SME businesses</p>
        </div>

        {/* Search and Filter Bar - Glassmorphism */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-[0_0_30px_rgba(139,92,246,0.2)] p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input - Dark with Neon Glow */}
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-slate-200 mb-2">
                Search Events
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-3 bg-slate-900/50 border border-white/10 rounded-full text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:shadow-[0_0_20px_rgba(139,92,246,0.4)] outline-none transition-all"
              />
            </div>

            {/* Category Dropdown - Dark with Neon Glow */}
            <div className="md:w-64">
              <label htmlFor="category" className="block text-sm font-medium text-slate-200 mb-2">
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-6 py-3 bg-slate-900/50 border border-white/10 rounded-full text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:shadow-[0_0_20px_rgba(139,92,246,0.4)] outline-none transition-all"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-slate-900">
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-slate-400">
            Showing {filteredEvents.length} of {events.length} events
          </div>
        </div>

        {/* Event Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-slate-200 mb-2">No events found</h3>
            <p className="text-slate-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
