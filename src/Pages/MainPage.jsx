import React, { useState, useEffect } from "react";
import { Grid, List, Star, MoreHorizontal, Users, Sun, Moon } from "lucide-react";
import ProjectCard from "../Components/ProjectCard";
import NewProjectModal from "../Modals/NewProjectModal";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  createProject,
  deleteProjectAsync,
  addTodoBox,
  logout,
  clearError,
  fetchActivityFeed
} from "../ReduxStore/Reducers";
import { useNavigate } from "react-router-dom";

const ProjectDashboard = () => {
  const colors = [
    "bg-green-100",
    "bg-yellow-100",
    "bg-red-100",
    "bg-blue-100",
    "bg-purple-100",
    "bg-pink-100",
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { todoBoxes, todos, activityFeed, loading, error, tasksLoading, tasksError } = useSelector(
    (state) => state.todos
  );

  const authData = useSelector((state) => state.auth.user);

  const numberOfProjects = todoBoxes.length;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize from localStorage or default to false
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  
  // Add view mode state
  const [viewMode, setViewMode] = useState(() => {
    // Initialize from localStorage or default to 'grid'
    const saved = localStorage.getItem('viewMode');
    return saved ? saved : 'grid';
  });

  // Add sort mode state
  const [sortMode, setSortMode] = useState(() => {
    // Initialize from localStorage or default to 'created'
    const saved = localStorage.getItem('sortMode');
    return saved ? saved : 'created';
  });

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Save view mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

  // Save sort mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('sortMode', sortMode);
  }, [sortMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Toggle view mode function
  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortMode(e.target.value);
  };

  const createNewTodoBox = () => {
    setIsModalOpen(true);
  };

  const totalTasks = Object.values(todos).reduce(
    (sum, taskArray) => sum + taskArray.length,
    0
  );

  const totalCompletedTasks = Object.values(todos).reduce(
    (sum, taskArray) => sum + taskArray.filter((task) => task.completed).length,
    0
  );

  const totalNotCompletedTasks = Object.values(todos).reduce(
    (sum, taskArray) =>
      sum + taskArray.filter((task) => !task.completed).length,
    0
  );

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const handleModalSubmit = async (projectData) => {
    console.log("Project data:", projectData);
    try {
      await dispatch(createProject(projectData)).unwrap();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create project:", error);
      // Fallback to local creation
      dispatch(addTodoBox(projectData));
      setIsModalOpen(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await dispatch(deleteProjectAsync(projectId)).unwrap();
      // Success - project deleted from database and Redux state
    } catch (error) {
      console.error("Failed to delete project:", error);
      // Optionally show error message to user
    }
  };

  // Sort projects based on selected mode
  const getSortedProjects = () => {
    const projectsWithTaskCount = todoBoxes.map(project => ({
      ...project,
      taskCount: todos[project.id] ? todos[project.id].length : 0
    }));

    switch (sortMode) {
      case 'tasks-desc':
        return projectsWithTaskCount.sort((a, b) => b.taskCount - a.taskCount);
      case 'tasks-asc':
        return projectsWithTaskCount.sort((a, b) => a.taskCount - b.taskCount);
      case 'created-desc':
        return projectsWithTaskCount.sort((a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp));
      case 'created-asc':
        return projectsWithTaskCount.sort((a, b) => new Date(a.createdAt || a.timestamp) - new Date(b.createdAt || b.timestamp));
      default:
        return projectsWithTaskCount.sort((a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp));
    }
  };

  // Load projects and activity feed on mount
  useEffect(() => {
    if (authData) {
      dispatch(fetchProjects());
      dispatch(fetchActivityFeed());
    }
  }, [dispatch, authData?.id]);

  // Refresh activity feed periodically (every 30 seconds)
  useEffect(() => {
    if (authData) {
      const interval = setInterval(() => {
        dispatch(fetchActivityFeed());
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [dispatch, authData]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const sortedProjects = getSortedProjects();

  return (
    <div className={`min-h-screen flex transition-all duration-500 ease-in-out ${
      isDarkMode 
        ? 'bg-gray-900' 
        : 'bg-gray-50'
    }`}>
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-2xl font-semibold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Your Projects
          </h1>
          <button
            onClick={() => createNewTodoBox()}
            className="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:cursor-pointer transition-all duration-300 transform hover:scale-105"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Start a new project'}
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            {/* Grid/List Toggle */}
            <div className={`flex items-center space-x-1 rounded-lg p-1 shadow-sm transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <button 
                onClick={() => toggleViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-300 transform hover:scale-105 ${
                  viewMode === 'grid'
                    ? isDarkMode 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-blue-500 text-white shadow-md'
                    : isDarkMode 
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Grid size={18} />
              </button>
              <button 
                onClick={() => toggleViewMode('list')}
                className={`p-2 rounded-md transition-all duration-300 transform hover:scale-105 ${
                  viewMode === 'list'
                    ? isDarkMode 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-blue-500 text-white shadow-md'
                    : isDarkMode 
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <List size={18} />
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <div className="ml-4">
              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex items-center justify-center w-14 h-8 rounded-full transition-all duration-500 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg'
                    : 'bg-gradient-to-r from-yellow-400 to-orange-400 shadow-md'
                }`}
              >
                {/* Toggle Circle */}
                <span
                  className={`absolute left-1 inline-block w-6 h-6 transform rounded-full transition-all duration-500 ease-in-out shadow-lg ${
                    isDarkMode
                      ? 'translate-x-6 bg-gray-900'
                      : 'translate-x-0 bg-white'
                  }`}
                >
                  {/* Icon inside the circle */}
                  <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                    isDarkMode ? 'text-indigo-400' : 'text-yellow-500'
                  }`}>
                    {isDarkMode ? (
                      <Moon size={12} className="transition-transform duration-300 rotate-0" />
                    ) : (
                      <Sun size={12} className="transition-transform duration-300 rotate-180" />
                    )}
                  </span>
                </span>
                
                {/* Background Icons */}
                <div className="flex items-center justify-between w-full px-2">
                  <Sun 
                    size={14} 
                    className={`transition-all duration-300 ${
                      isDarkMode ? 'text-yellow-200 opacity-40' : 'text-white opacity-80'
                    }`} 
                  />
                  <Moon 
                    size={14} 
                    className={`transition-all duration-300 ${
                      isDarkMode ? 'text-purple-200 opacity-80' : 'text-gray-600 opacity-40'
                    }`} 
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="flex space-x-3 ">
            <select 
              value={sortMode}
              onChange={handleSortChange}
              className={`px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 rounded sfocus:ring-blue-500 transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 text-gray-200 border-gray-600' 
                  : 'bg-white text-gray-900'
              }`}
            >
              <optgroup label="Sort by">
                <option value="created-desc">Newest First</option>
                <option value="created-asc">Oldest First</option>
                <option value="tasks-desc">Most Tasks</option>
                <option value="tasks-asc">Least Tasks</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className={`mb-4 p-4 rounded-lg flex justify-between items-center transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-red-900 text-red-200' 
              : 'bg-red-100 text-red-700'
          }`}>
            <span>Error: {error}</span>
            <button
              onClick={() => dispatch(clearError())}
              className={`transition-colors duration-300 ${
                isDarkMode 
                  ? 'text-red-400 hover:text-red-300' 
                  : 'text-red-500 hover:text-red-700'
              }`}
            >
              ✕
            </button>
          </div>
        )}

        {/* Tasks Error Display */}
        {tasksError && (
          <div className={`mb-4 p-4 rounded-lg flex justify-between items-center transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-orange-900 text-orange-200' 
              : 'bg-orange-100 text-orange-700'
          }`}>
            <span>Task Error: {tasksError}</span>
            <button
              onClick={() => dispatch(clearError())}
              className={`transition-colors duration-300 ${
                isDarkMode 
                  ? 'text-orange-400 hover:text-orange-300' 
                  : 'text-orange-500 hover:text-orange-700'
              }`}
            >
              ✕
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className={`text-lg transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Loading projects...
            </div>
          </div>
        ) : todoBoxes.length === 0 ? (
          <div className={`flex justify-center text-center items-center h-screen w-full text-5xl font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Your tasks, your goals <br />
            all in one place 📝
          </div>
        ) : null}

        {/* Projects Grid/List with smooth transition */}
        {!loading && todoBoxes.length > 0 && (
          <div className="transition-all duration-500 ease-in-out">
            <ProjectCard 
              projects={sortedProjects} 
              onDelete={handleDeleteProject}
              isDarkMode={isDarkMode}
              viewMode={viewMode}
            />
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className={`w-80 shadow-lg p-6 transition-colors duration-500 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <span className="text-orange-500 font-bold text-sm">👨</span>
              </div>
            </div>
            <div>
              <p className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Hello,
              </p>
              <p className={`font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {authData?.name}
              </p>
            </div>
          </div>
          <button
            className={`transition-all duration-300 hover:scale-105 cursor-pointer ${
              isDarkMode 
                ? 'text-gray-400 hover:text-white' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <p className={`text-sm mb-1 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Total projects:
            </p>
            <p className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {numberOfProjects}
            </p>
          </div>
          <div>
            <p className={`text-sm mb-1 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Total Tasks:
            </p>
            <p className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {totalTasks}
            </p>
          </div>
          <div>
            <p className={`text-sm mb-1 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              In progress:
            </p>
            <p className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {totalNotCompletedTasks}
            </p>
          </div>
          <div>
            <p className={`text-sm mb-1 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Completed:
            </p>
            <p className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {totalCompletedTasks}
            </p>
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Activity Feed
            </h3>
          </div>

          <div className={`space-y-4 divide-y max-h-96 overflow-y-auto transition-colors duration-300 scrollbar-hidden ${
            isDarkMode ? 'divide-gray-700' : 'divide-gray-200'
          }`}>
            {activityFeed.length === 0 ? (
              <div className="text-center py-4">
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  No recent activity
                </p>
              </div>
            ) : (
              activityFeed.map((activity) => {
                const project = todoBoxes.find(
                  (p) => p.id === activity.projectId
                );
                return (
                  <div
                    key={activity.id}
                    className={`p-2 transition-all duration-300 rounded hover:scale-[1.02] ${
                      isDarkMode 
                        ? 'hover:bg-gray-700' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <p className={`text-md transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-900'
                    }`}>
                      {activity.type === "task_created" && (
                        <>
                          <span className="font-medium">New task created</span>:{" "}
                          {activity.task}
                        </>
                      )}
                      {activity.type === "task_completed" && (
                        <>
                          <span className="font-medium">Task completed</span>:{" "}
                          {activity.task}
                        </>
                      )}
                      {activity.type === "project_created" && (
                        <>
                          <span className="font-medium">Project Created</span>:{" "}
                          {activity.task}
                        </>
                      )}
                      {activity.type === "project_deleted" && (
                        <>
                          <span className="font-medium">Project Deleted</span>:{" "}
                          {activity.task}
                        </>
                      )}
                      {activity.type === "task_reopened" && (
                        <>
                          <span className="font-medium">Task Reopened</span>:{" "}
                          {activity.task}
                        </>
                      )}
                      {activity.type === "task_deleted" && (
                        <>
                          <span className="font-medium">Task Deleted</span>:{" "}
                          {activity.task}
                        </>
                      )}
                    </p>
                    <p className={`text-xs mt-1 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {project ? (
                        activity.projectName
                      ) : (
                        <span className="line-through">
                          {activity.projectName}
                        </span>
                      )}
                      {activity.timestamp && (
                        <span className="ml-2">
                          • {new Date(activity.timestamp).toLocaleTimeString()}
                        </span>
                      )}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default ProjectDashboard;