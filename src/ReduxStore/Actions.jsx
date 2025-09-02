const ADD_TODO_BOX = "ADD_TODO_BOX";
const DELETE_TODO_BOX = "DELETE_TODO_BOX";
const ADD_TODO = "ADD_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";

export const addToDoBox = () => ({
    type: ADD_TODO_BOX,
    payload: Date.now()
})

export const addTodo = (boxId, text) => ({
    type: ADD_TODO,
    payload: { boxId, text }

})

export const toggleTodo = (boxId, todoId) => ({
    type: TOGGLE_TODO,
    payload: { boxId, todoId }
})

export const deleteToDoBox = (boxId, todoId) => ({
    type: DELETE_TODO_BOX,
    payload: { boxId, todoId }
})

const initialState = {
  todoBoxes: [],
  todos: {}
};