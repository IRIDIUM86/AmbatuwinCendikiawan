import { useState } from 'react';

// EventCard Component
function EventCard({ event }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Placeholder Image */}
      <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
        <span className="text-white text-6xl">🎉</span>
      </div>
      
      {/* Card Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
        
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
            <span className="text-sm font-medium text-blue-600">{event.category}</span>
          </div>
        </div>
        
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Event Discovery</h1>
          <p className="text-gray-600">Discover exciting events tailored for SME businesses</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Events
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Category Dropdown */}
            <div className="md:w-64">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
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
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No events found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
