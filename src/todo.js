import React, { useReducer, useContext, useState } from "react"
import InputBase from "@material-ui/core/InputBase"
import AddIcon from "@material-ui/icons/Add"
import IconButton from "@material-ui/core/IconButton"
import DoneIcon from "@material-ui/icons/Done"
import DeleteIcon from "@material-ui/icons/Delete"
import Paper from "@material-ui/core/Paper"
import { withStyles } from "@material-ui/core/styles"
import Divider from "@material-ui/core/Divider"

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
      <p style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <span style={todo.complete ? { textDecoration: "line-through" } : {}}>
          {todo.text}
        </span>
        <span>
          <IconButton aria-label="Delete" onClick={deleteTodo}>
            <DeleteIcon />
          </IconButton>
          <IconButton aria-label="done" onClick={completeTodo}>
            <DoneIcon />
          </IconButton>
        </span>
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
      return state.concat({ text: action.text, complete: false })
    case "complete": {
      const { index } = action
      if(state[index].complete) {
        return state
      }
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

const styles = {
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 400
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  }
}

function Example({ classes }) {
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
      <Paper className={classes.root} elevation={1}>
        <InputBase
          className={classes.input}
          id="standard-name"
          placeholder="add new todo"
          onChange={setTodo}
          value={text}
        />
        <Divider className={classes.divider} />
        <IconButton
          aria-label="add todo"
          className={classes.iconButton}
          onClick={addTodo}
        >
          <AddIcon />
        </IconButton>
      </Paper>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  )
}

export default withStyles(styles)(Example)
