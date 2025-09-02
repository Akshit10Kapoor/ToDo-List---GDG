import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const NewProjectModal = ({ isOpen, onClose, onSubmit }) => {
  const [projectTitle, setProjectTitle] = useState("");
  const [projectSubtitle, setProjectSubtitle] = useState("");
  const [isVisible, setIsVisible] = useState(false);


  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);


  useEffect(() => {
    if (!isOpen) {
      setProjectTitle("");
      setProjectSubtitle("");
    }
  }, [isOpen]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (projectTitle.trim()) {
      onSubmit({
        title: projectTitle.trim(),
        subtitle: projectSubtitle.trim(),
      });
      onClose();
    }
  };


  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
     
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
        isOpen ? " bg-opacity-50 backdrop-blur-sm" : " bg-opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-200 ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Create New Project
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Project Title */}
            <div>
              <label
                htmlFor="projectTitle"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Project Title *
              </label>
              <input
                type="text"
                id="projectTitle"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="Enter your project title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === "Enter" && projectTitle.trim()) {
                    handleSubmit(e);
                  }
                }}
              />
            </div>

            {/* Project Subtitle */}
            <div>
              <label
                htmlFor="projectSubtitle"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Project Subtitle
              </label>
              <input
                type="text"
                id="projectSubtitle"
                value={projectSubtitle}
                onChange={(e) => setProjectSubtitle(e.target.value)}
                placeholder="Enter a brief description (optional)..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && projectTitle.trim()) {
                    handleSubmit(e);
                  }
                }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!projectTitle.trim()}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Create Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProjectModal;
