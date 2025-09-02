import React from 'react';
import { Star, MoreHorizontal, Users } from 'lucide-react';

const ProjectCard = ({ projects }) => {
  const colors = [
    "bg-green-100",
    "bg-yellow-100",
    "bg-red-100",
    "bg-blue-100",
    "bg-purple-100",
    "bg-pink-100"
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => {
        // pick color based on index, rotate when colors run out
        const colorClass = colors[index % colors.length];
        return (
          <div
            key={project.id}
            className={`${colorClass} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
              <div className="flex items-center space-x-2">
                {project.starred && (
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                )}
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>

            <div className="mb-4">
              {project.subtitle && (
                <p className="text-sm text-gray-600 mb-1">- {project.subtitle}</p>
              )}
              {project.subtitle2 && (
                <p className="text-sm text-gray-600 mb-1">- {project.subtitle2}</p>
              )}
              {project.email && (
                <p className="text-sm text-blue-600 mb-1">{project.email}</p>
              )}
            </div>

            {/* Three boxes for Internal project */}
            {project.hasBoxes && (
              <div className="flex space-x-2 mb-4">
                <div className="w-8 h-8 bg-white rounded border border-gray-200"></div>
                <div className="w-8 h-8 bg-white rounded border border-gray-200"></div>
                <div className="w-8 h-8 bg-white rounded border border-gray-200"></div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="flex -space-x-2">
                {Array.from({ length: project.teamMembers }).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center"
                  >
                    <Users size={12} className="text-gray-600" />
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-500">{project.status}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectCard;
