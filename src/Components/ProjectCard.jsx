import React, { useState, useEffect } from 'react';
import { Star, MoreHorizontal, Plus, Check, X, Trash } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  // Database operations (preferred)
  fetchProjectTasks,
  createTask,
  toggleTaskCompletion,
  deleteTask,
  // Local fallback operations
  addTodo as addTodoAction, 
  toggleTodo as toggleTodoAction, 
  deleteTodo as deleteTodoAction, 
  deleteTodoBox 
} from '../ReduxStore/Reducers';

const ProjectCard = ({ projects, onDelete }) => {
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [newTodoText, setNewTodoText] = useState({});
  const [loadedProjects, setLoadedProjects] = useState(new Set());

  const colors = [
    "bg-green-100",
    "bg-yellow-100", 
    "bg-red-100",
    "bg-blue-100",
    "bg-purple-100",
    "bg-pink-100"
  ];

  const { todos, tasksLoading, tasksError, loading } = useSelector(state => state.todos);
  const { user: authData } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleClick = (projectId) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId); 
      } else {
        newSet.add(projectId);
        // Load tasks when expanding a project (only if not already loaded)
        if (!loadedProjects.has(projectId)) {
          dispatch(fetchProjectTasks(projectId))
            .then(() => {
              setLoadedProjects(prev => new Set(prev).add(projectId));
            })
            .catch(error => {
              console.error('Failed to load tasks:', error);
            });
        }
      }
      return newSet;
    });
  };

  const handleDeleteClick = (projectId) => {
    // Use the parent's onDelete function for consistency
    if (onDelete) {
      onDelete(projectId);
    } else {
      // Fallback to local deletion
      dispatch(deleteTodoBox(projectId));
    }
  };

  const handleAddTodo = async (projectId) => {
    const todoText = newTodoText[projectId]?.trim();
    if (!todoText) return;

    try {
      // Try database operation first
      if (authData) {
        await dispatch(createTask({ 
          projectId, 
          taskData: { text: todoText, title: todoText }
        })).unwrap();
      } else {
        // Fallback to local operation
        dispatch(addTodoAction({ boxId: projectId, text: todoText }));
      }

      // Clear input on success
      setNewTodoText(prev => ({
        ...prev,
        [projectId]: ''
      }));
    } catch (error) {
      console.error('Failed to create task:', error);
      // Fallback to local operation on error
      dispatch(addTodoAction({ boxId: projectId, text: todoText }));
      setNewTodoText(prev => ({
        ...prev,
        [projectId]: ''
      }));
    }
  };

  const toggleTodo = async (projectId, todoId) => {
    try {
      // Try database operation first
      if (authData) {
        await dispatch(toggleTaskCompletion({ taskId: todoId, projectId })).unwrap();
      } else {
        // Fallback to local operation
        dispatch(toggleTodoAction({ boxId: projectId, todoId }));
      }
    } catch (error) {
      console.error('Failed to toggle task:', error);
      // Fallback to local operation on error
      dispatch(toggleTodoAction({ boxId: projectId, todoId }));
    }
  };

  const deleteTodo = async (projectId, todoId) => {
    try {
      // Try database operation first
      if (authData) {
        await dispatch(deleteTask({ taskId: todoId, projectId })).unwrap();
      } else {
        // Fallback to local operation
        dispatch(deleteTodoAction({ boxId: projectId, todoId }));
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
      // Fallback to local operation on error
      dispatch(deleteTodoAction({ boxId: projectId, todoId }));
    }
  };

  const handleKeyPress = (e, projectId) => {
    if (e.key === 'Enter') {
      handleAddTodo(projectId);
    }
  };

  const getWelcomeMessage = () => {
    const messages = [
      "Ready to get started?",
      "Let's make it happen!",
      "Your journey begins here",
      "Time to be productive!",
      "What's on your mind?",
      "Let's organize your thoughts"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // Load tasks for visible projects on mount
useEffect(() => {
  if (authData && projects.length > 0) {
    projects.forEach(project => {
      // Only load if we don't have tasks for this project yet
      if (!todos[project.id] && !loadedProjects.has(project.id)) {
        dispatch(fetchProjectTasks(project.id))
          .then(() => {
            setLoadedProjects(prev => new Set(prev).add(project.id));
          })
          .catch(error => {
            console.error('Failed to load tasks for project:', project.id, error);
          });
      }
    });
  }
}, [projects, authData, dispatch]); // Don't include todos or loadedProjects in dependencies

  return (
    <div className="flex flex-wrap gap-6">
      {/* Error Display */}
      {tasksError && (
        <div className="w-full mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          Task Error: {tasksError}
        </div>
      )}

      {projects.map((project, index) => {
        const colorClass = project.color;
        const isExpanded = expandedCards.has(project.id);
        const projectTodos = todos[project.id] || [];
        const hasTodos = projectTodos.length > 0;
        const isLoadingTasks = tasksLoading && isExpanded;

        return (
          <div
            key={project.id}
            className={`
              ${colorClass} rounded-xl p-6 shadow-sm hover:shadow-md cursor-pointer
              transition-all duration-500 ease-in-out 
              ${isExpanded ? "w-[550px] h-[400px]" : "w-72 h-60"}
            `}
            onClick={(e) => {
              // Only expand if clicking on the card itself, not on interactive elements
              if (e.target === e.currentTarget || 
                  (!e.target.closest('button') && !e.target.closest('input') && !e.target.closest('.todo-item'))) {
                handleClick(project.id);
              }
            }}
          >
            {!isExpanded ? (
              // Collapsed View
              <>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                  <div className="flex items-center space-x-2">
                    {project.starred && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                    <button className="text-gray-400 hover:text-gray-600" onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(project.id);
                    }}>
                      <Trash size={18} />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  {project.subtitle && (
                    <p className="text-sm text-gray-600 mb-3">- {project.subtitle}</p>
                  )}
                  
                  {!hasTodos && (
                    <div className="transition-all duration-300 opacity-70">
                      <p className="text-xs text-gray-500 italic">{getWelcomeMessage()}</p>
                    </div>
                  )}
                </div>

                {hasTodos && (
                  <div className="space-y-2">
                    {projectTodos.slice(0, 3).map((todo) => (
                      <div key={todo.id} className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${todo.completed ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <p className={`text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                          {todo.text.length > 30 ? todo.text.substring(0, 30) + '...' : todo.text}
                        </p>
                      </div>
                    ))}
                    {projectTodos.length > 3 && (
                      <p className="text-xs text-gray-500 italic">+{projectTodos.length - 3} more tasks...</p>
                    )}
                  </div>
                )}
              </>
            ) : (
              // Expanded View
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <div></div>
                    <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                    <div className="flex items-center space-x-2">
                      {project.starred && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                      <button className="text-gray-400 hover:text-gray-600" onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(project.id);
                      }}>
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                  {project.subtitle && (
                    <p className="text-sm text-gray-600">- {project.subtitle}</p>
                  )}
                </div>

                {/* Add Task Input */}
                <div className="mb-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add a new task..."
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
                      value={newTodoText[project.id] || ''}
                      onChange={(e) => {
                        e.stopPropagation();
                        setNewTodoText(prev => ({
                          ...prev,
                          [project.id]: e.target.value
                        }));
                      }}
                      onKeyPress={(e) => handleKeyPress(e, project.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddTodo(project.id);
                      }}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                      disabled={tasksLoading}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Loading State */}
                {isLoadingTasks && (
                  <div className="flex justify-center items-center py-8">
                    <div className="text-sm text-gray-500">Loading tasks...</div>
                  </div>
                )}

                {/* Todo List */}
                <div className="flex-1 overflow-hidden">
                  {!isLoadingTasks && projectTodos.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-sm">No tasks yet. Add your first task above!</p>
                    </div>
                  ) : !isLoadingTasks && (
                    <div className="h-full overflow-y-auto space-y-2 pr-2" style={{maxHeight: '200px'}}>
                      {projectTodos.map((todo, todoIndex) => (
                        <div
                          key={todo.id}
                          className={`todo-item flex items-center space-x-3 p-3 rounded-lg bg-white/30 hover:bg-white/50 transition-all duration-200 ${
                            todoIndex >= 5 ? 'border-t border-gray-200' : ''
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => toggleTodo(project.id, todo.id)}
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                              todo.completed 
                                ? 'bg-green-500 border-green-500 text-white' 
                                : 'border-gray-300 hover:border-green-400'
                            }`}
                            disabled={tasksLoading}
                          >
                            {todo.completed && <Check size={12} />}
                          </button>
                          
                          <p className={`flex-1 text-sm transition-all duration-200 ${
                            todo.completed 
                              ? 'line-through text-gray-500' 
                              : 'text-gray-700'
                          }`}>
                            {todo.text}
                          </p>
                          
                          <button
                            onClick={() => deleteTodo(project.id, todo.id)}
                            className="text-red-400 hover:text-red-600 transition-colors p-1"
                            disabled={tasksLoading}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Stats */}
                <div className="mt-4 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    {projectTodos.filter(t => !t.completed).length} pending, {projectTodos.filter(t => t.completed).length} completed
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProjectCard;