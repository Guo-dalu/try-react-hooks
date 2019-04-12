import React, { useReducer, useContext, useState } from "react"
import Button from "@material-ui/core/Button"
import Input from "@material-ui/core/Input"
import InputLabel from "@material-ui/core/InputLabel"
import InputAdornment from "@material-ui/core/InputAdornment"
import Fab from "@material-ui/core/Fab"
import AddIcon from "@material-ui/icons/Add"
import InfoIcon from "@material-ui/icons/Info"
import DoneIcon from "@material-ui/icons/Done"
import DeleteIcon from "@material-ui/icons/Delete"

// import fetchCat from "./utils/fetchCat"
// import Divider from "@material-ui/core/Divider"

const TodosDispatch = React.createContext(null)

function DeepTree({ todos }) {
  return (
    <>
      {todos.map((todo, index) => (
        <DeepChild todo={todo} key={todo.text + Math.random()} index={index} />
      ))}
    </>
  )
}

function DeepChild({ todo, index }) {
  // If we want to perform an action, we can get dispatch from context.
  const dispatch = useContext(TodosDispatch)

  function completeTodo() {
    dispatch({ type: "complete", index: index })
  }

  function deleteTodo() {
    dispatch({ type: "delete", index: index })
  }

  return (
    <>
      <p>
        <span style={todo.complete ? { textDecoration: "line-through" } : {}}>
          {todo.text}
        </span>
        <Button aria-label="Delete" onClick={deleteTodo}>
          <DeleteIcon />
        </Button>
        <Button aria-label="done" onClick={completeTodo}>
          <DoneIcon />
        </Button>
      </p>
    </>
  )
}

const initialState = [
  { text: "吃饭", complete: false },
  { text: "睡觉", complete: false }
]

function todosReducer(state, action) {
  switch (action.type) {
    case "add":
      console.log("- add")
      return state.concat({ text: action.text, complete: false })
    case "complete": {
      const { index } = action
      return state
        .slice(0, index)
        .concat({ ...state[action.index], complete: true })
        .concat(state.slice(index + 1))
    }
    case "delete":
      const { index } = action
      return state.slice(0, index).concat(state.slice(index + 1))
    default:
      throw new Error()
  }
}

function Example() {
  // Note: `dispatch` won't change between re-renders
  const [todos, dispatch] = useReducer(todosReducer, initialState)
  const [text, setText] = useState("")

  console.log(todos, "---render")

  function addTodo() {
    if (!text) {
      return false
    }
    dispatch({ type: "add", text: text })
    setText("")
  }

  function setTodo(e) {
    setText(e.target.value)
  }

  return (
    <TodosDispatch.Provider value={dispatch}>
      <InputLabel htmlFor="input-todo">add new todo</InputLabel>
      <Input
        id="input-todo"
        startAdornment={
          <InputAdornment position="end">
            <InfoIcon />
          </InputAdornment>
        }
        onChange={setTodo}
        value={text}
      />
      <Fab onClick={addTodo} size="small">
        <AddIcon />
      </Fab>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  )
}

export default Example
