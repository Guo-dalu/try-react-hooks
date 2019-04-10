import React, { useReducer, useContext } from "react"
import Button from "@material-ui/core/Button"
// import fetchCat from "./utils/fetchCat"
// import Divider from "@material-ui/core/Divider"

const TodosDispatch = React.createContext(null)


function DeepTree({todos}) {
  return (<>{todos.map(todo => (<DeepChild todo={todo} key={todo.text}/>) )}</>)
}

function DeepChild({ todo }) {
  // If we want to perform an action, we can get dispatch from context.
  const dispatch = useContext(TodosDispatch)

  function handleClick() {
    dispatch({ type: "add", text: "hello" })
  }

  return (
    <>
      <Button onClick={handleClick}>Add todo</Button>
      <p>{todo.text}</p>
    </>
  )
}

const initialState = [{text: 'asdfasd'}]

function todosReducer(state, action) {
  switch (action.type) {
    case "add":
      return state.concat({text: action.text})
    case "delete":
      return state
    default:
      throw new Error()
  }
}

function Example() {
  // Note: `dispatch` won't change between re-renders
  const [todos, dispatch] = useReducer(todosReducer, initialState)

  console.log(todos)

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  )
}

export default Example
