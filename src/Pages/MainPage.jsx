import React from 'react';
import { Grid, List, Star, MoreHorizontal, Users } from 'lucide-react';
import ProjectCard from '../Components/ProjectCard';

const ProjectDashboard = () => {
  const projects = [
    {
      id: 1,
      title: "Video Campaign",
      subtitle: "Application Concept",
      subtitle2: "Website Concept",
      teamMembers: 2,
      status: "Active recently",
      starred: true,
      color: "bg-yellow-100"
    },
    {
      id: 2,
      title: "NPS",
      subtitle: "Statistics and Overview",
      email: "nps@gmail.com",
      teamMembers: 2,
      status: "1 day ago",
      starred: true,
      color: "bg-blue-100"
    },
    {
      id: 3,
      title: "Internal",
      subtitle: "",
      teamMembers: 3,
      status: "1 day ago",
      starred: true,
      color: "bg-gray-100",
      hasBoxes: true
    },
    {
      id: 4,
      title: "Growth Hacking",
      subtitle: "Ideas, challenges and tests",
      teamMembers: 2,
      status: "2 days ago",
      starred: false,
      color: "bg-green-100"
    },
    {
      id: 5,
      title: "Product Marketing",
      subtitle: "All things marketing",
      teamMembers: 2,
      status: "1 week ago",
      starred: false,
      color: "bg-purple-100"
    },
    {
      id: 6,
      title: "Mobile App Design",
      subtitle: "Prototypes, mockups, client and collaboration",
      teamMembers: 2,
      status: "1 week ago",
      starred: false,
      color: "bg-orange-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">All Projects</h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
            Start a new project
          </button>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          {/* View Toggle */}
          <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm">
            <button className="p-2 rounded-md bg-gray-100 text-gray-700">
              <Grid size={18} />
            </button>
            <button className="p-2 rounded-md text-gray-400 hover:text-gray-700">
              <List size={18} />
            </button>
          </div>

          {/* Filters */}
          <div className="flex space-x-3">
            <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Clients</option>
            </select>
            <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Filter 1</option>
            </select>
            <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Filter 2</option>
            </select>
            <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Filter 3</option>
            </select>
            <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Filter 4</option>
            </select>
          </div>
        </div>
        <ProjectCard projects={projects} />
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-white shadow-lg p-6">
        {/* User Profile */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-orange-500 font-bold text-sm">👨</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Hello,</p>
              <p className="font-semibold text-gray-900">Sullivan</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total projects:</p>
            <p className="text-2xl font-bold text-gray-900">189</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Completed:</p>
            <p className="text-2xl font-bold text-gray-900">174</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">In progress:</p>
            <p className="text-2xl font-bold text-gray-900">13</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Out of schedule:</p>
            <p className="text-2xl font-bold text-gray-900">2</p>
          </div>
        </div>

        {/* Illustration */}
        <div className="bg-purple-600 rounded-2xl p-6 mb-6 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full opacity-60"></div>
            <div className="absolute top-8 right-8 w-1 h-1 bg-white rounded-full opacity-40"></div>
            <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-white rounded-full opacity-50"></div>
          </div>
          <div className="relative z-10 flex items-center justify-center h-32">
            <div className="text-white text-center">
              <div className="mb-2">🎉</div>
              <p className="text-sm opacity-90">Great work!</p>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Activity Feed</h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Completed task</span> Prepare moodboard for website branding
                </p>
              </div>
            </div>

            <div className="bg-yellow-100 rounded-lg p-3 text-center">
              <span className="text-sm font-medium text-yellow-800">Coffee Break</span>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Overload task</span> Search references for multi-colored background.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <span className="text-2xl">😊</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;