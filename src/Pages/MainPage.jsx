import React, { useState, useEffect } from "react";
import { Grid, List, Star, MoreHorizontal, Users } from "lucide-react";
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
    navigate("/landing-page");
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

  // Load projects and activity feed on mount
  useEffect(() => {
    if (authData) {
      dispatch(fetchProjects());
      dispatch(fetchActivityFeed());
    }
  }, [dispatch, authData]);

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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">All Projects</h1>
          <button
            onClick={() => createNewTodoBox()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Start a new project'}
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm">
            <button className="p-2 rounded-md bg-gray-100 text-gray-700">
              <Grid size={18} />
            </button>
            <button className="p-2 rounded-md text-gray-400 hover:text-gray-700">
              <List size={18} />
            </button>
          </div>

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

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex justify-between items-center">
            <span>Error: {error}</span>
            <button
              onClick={() => dispatch(clearError())}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tasks Error Display */}
        {tasksError && (
          <div className="mb-4 p-4 bg-orange-100 text-orange-700 rounded-lg flex justify-between items-center">
            <span>Task Error: {tasksError}</span>
            <button
              onClick={() => dispatch(clearError())}
              className="text-orange-500 hover:text-orange-700"
            >
              ✕
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-500">Loading projects...</div>
          </div>
        ) : todoBoxes.length === 0 ? (
          <div className="flex justify-center text-center items-center h-screen w-full text-5xl font-bold text-gray-500">
            Your tasks, your goals <br />
            all in one place 📝
          </div>
        ) : null}

        {/* Projects Grid */}
        {!loading && todoBoxes.length > 0 && (
          <ProjectCard 
            projects={todoBoxes} 
            onDelete={handleDeleteProject}
          />
        )}
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-orange-500 font-bold text-sm">👨</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Hello,</p>
              <p className="font-semibold text-gray-900">{authData?.name}</p>
            </div>
          </div>
          <button
            className="text-gray-500 hover:text-gray-900 cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total projects:</p>
            <p className="text-2xl font-bold text-gray-900">
              {numberOfProjects}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Tasks:</p>
            <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">In progress:</p>
            <p className="text-2xl font-bold text-gray-900">
              {totalNotCompletedTasks}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Completed:</p>
            <p className="text-2xl font-bold text-gray-900">
              {totalCompletedTasks}
            </p>
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Activity Feed</h3>
            <button 
              onClick={() => dispatch(fetchActivityFeed())}
              className="text-sm text-blue-500 hover:text-blue-700"
              disabled={loading}
            >
              Refresh
            </button>
          </div>

          <div className="space-y-4 divide-y divide-gray-200">
            {activityFeed.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">No recent activity</p>
              </div>
            ) : (
              activityFeed.map((activity) => {
                const project = todoBoxes.find(
                  (p) => p.id === activity.projectId
                );
                return (
                  <div
                    key={activity.id}
                    className="p-2 transition hover:bg-gray-100 rounded"
                  >
                    <p className="text-md text-gray-900">
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
                    <p className="text-xs text-gray-500 mt-1">
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
      />
    </div>
  );
};

export default ProjectDashboard;