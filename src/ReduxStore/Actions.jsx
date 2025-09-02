
const ADD_TODO_BOX = "ADD_TODO_BOX";



export const addTodoBox = (projectData) => ({
    type: ADD_TODO_BOX,
    payload: { 
        id: Date.now(), 
        title: projectData?.title || 'Todo List',
        subtitle: projectData?.subtitle || ''
    }
});