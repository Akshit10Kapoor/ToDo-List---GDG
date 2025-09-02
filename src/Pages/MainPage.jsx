import React, { useState } from "react";
import { Grid, List, Star, MoreHorizontal, Users } from "lucide-react";
import ProjectCard from "../Components/ProjectCard";
import NewProjectModal from "../Modals/NewProjectModal";
import { useDispatch, useSelector } from 'react-redux'; 
import { addTodoBox } from '../ReduxStore/Reducers'; 

const ProjectDashboard = () => {

    
  const colors = [
  "bg-green-100",
  "bg-yellow-100",
  "bg-red-100",
  "bg-blue-100",
  "bg-purple-100",
  "bg-pink-100"
];
const dispatch = useDispatch();
  const { todoBoxes, todos } = useSelector(state => state.todos);
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
  (sum, taskArray) => sum + taskArray.filter(task => task.completed).length,
  0
);
const totalNotCompletedTasks = Object.values(todos).reduce(
  (sum, taskArray) => sum + taskArray.filter(task => !task.completed).length,
  0
);



const handleModalSubmit = (projectData) => {
  console.log('Project data:', projectData); 
  dispatch(addTodoBox(projectData)); 
};

  return (
    <div className="min-h-screen bg-gray-50 flex">
  
      <div className="flex-1 p-6">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">All Projects</h1>
          <button onClick={() => createNewTodoBox()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
            Start a new project
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
        <ProjectCard projects={todoBoxes} />
      </div>

    
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
              <p className="font-semibold text-gray-900">Sullivan</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal size={20} />
          </button>
        </div>

        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total projects:</p>
            <p className="text-2xl font-bold text-gray-900">{numberOfProjects}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Tasks:</p>
            <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">In progress:</p>
            <p className="text-2xl font-bold text-gray-900">{totalNotCompletedTasks}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Completed:</p>
            <p className="text-2xl font-bold text-gray-900">{totalCompletedTasks}</p>
          </div>
        </div>


      
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Activity Feed</h3>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Completed task</span> Prepare
                  moodboard for website branding
                </p>
              </div>
            </div>

            <div className="bg-yellow-100 rounded-lg p-3 text-center">
              <span className="text-sm font-medium text-yellow-800">
                Coffee Break
              </span>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Overload task</span> Search
                  references for multi-colored background.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <span className="text-2xl">😊</span>
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
